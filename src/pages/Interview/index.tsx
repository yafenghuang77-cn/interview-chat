import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDidHide, useDidShow, useLoad, useRouter, useUnload } from '@tarojs/taro';
import { View, Button, ScrollView } from '@tarojs/components';
import { QUESTION_COMPONENT_TYPE, type QuestionComponentType } from '@/common/constants';
import {
  persistInterviewAnswer,
  queryCurrentInterviewQuestion,
  resetInterviewFlow,
  selectInterviewCachedItemIds,
  selectInterviewCurrentQuestionId,
  selectInterviewDataList,
  selectInterviewIsFinished,
  selectInterviewIsPollingPaused,
  selectInterviewIsSubmitting,
  selectInterviewRestoredFromCache,
  selectInterviewSubmittedQuestionIds,
  submitCurrentInterviewQuestion,
  timeoutCurrentInterviewQuestion,
} from '@/store/interviewStore';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import AnchorChat from './components/AnchorChat';
import AnswerAreaList, { type AnswerAreaListRef } from './components/AnswerAreaList';
import type { InterviewAnswerSubmitValue } from './types';
import './index.less';

const POLLING_INTERVAL = 2000;
const SCROLL_BOTTOM_ANCHOR_ID = 'interviewBottom';
const SCROLL_RENDER_DELAY = 80;
const DISPLAY_QUESTION_TYPES: QuestionComponentType[] = [
  QUESTION_COMPONENT_TYPE.IMAGE_DISPLAY,
  QUESTION_COMPONENT_TYPE.VIDEO_DISPLAY,
];

const InterviewPage: React.FC = () => {
  const router = useRouter();
  const surveyId = String(router.params?.surveyId || 'default-survey');
  const dispatch = useAppDispatch();
  const dataList = useAppSelector(selectInterviewDataList);
  const currentQuestionId = useAppSelector(selectInterviewCurrentQuestionId);
  const isPollingPaused = useAppSelector(selectInterviewIsPollingPaused);
  const isSubmitting = useAppSelector(selectInterviewIsSubmitting);
  const isFinished = useAppSelector(selectInterviewIsFinished);
  const restoredFromCache = useAppSelector(selectInterviewRestoredFromCache);
  const cachedItemIds = useAppSelector(selectInterviewCachedItemIds);
  const submittedQuestionIds = useAppSelector(selectInterviewSubmittedQuestionIds);
  const answerAreaRefs = useRef<Record<string, AnswerAreaListRef | null>>({});
  const cacheRenderInitializedRef = useRef(false);
  const pollingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pageVisibleRef = useRef(false);
  const scrollTimerRefs = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const [typingFinishedMap, setTypingFinishedMap] = useState<Record<number, boolean>>({});
  const [answerCompleteMap, setAnswerCompleteMap] = useState<Record<string, boolean>>({});
  const [visibleItemCount, setVisibleItemCount] = useState(0);
  const [scrollIntoView, setScrollIntoView] = useState('');
  const visibleDataList = dataList.slice(0, visibleItemCount);
  const lastVisibleItemId = visibleDataList[visibleDataList.length - 1]?.id || 0;
  const lastVisibleTypingFinished = lastVisibleItemId
    ? typingFinishedMap[lastVisibleItemId]
    : false;
  const currentItem = visibleDataList.find(item => item.config?.questionId === currentQuestionId);
  const currentAnswerVisible = currentItem
    ? Boolean(currentItem.config) && (!currentItem.content || typingFinishedMap[currentItem.id])
    : false;
  const isCurrentDisplayQuestion = currentItem?.config
    ? DISPLAY_QUESTION_TYPES.includes(currentItem.config.type)
    : false;
  const currentAnswerComplete = currentQuestionId
    ? Boolean(
        answerCompleteMap[currentQuestionId] || (isCurrentDisplayQuestion && currentAnswerVisible),
      )
    : false;
  const currentAnswerRefComplete = currentQuestionId
    ? Boolean(answerAreaRefs.current[currentQuestionId]?.isComplete())
    : false;
  const submitDisabled =
    !currentQuestionId || isSubmitting || !(currentAnswerComplete || currentAnswerRefComplete);

  const clearScrollTimers = useCallback(() => {
    scrollTimerRefs.current.forEach(timer => clearTimeout(timer));
    scrollTimerRefs.current = [];
  }, []);

  const scrollToBottom = useCallback(() => {
    clearScrollTimers();
    setScrollIntoView('');

    const timer = setTimeout(() => {
      setScrollIntoView(SCROLL_BOTTOM_ANCHOR_ID);
    }, SCROLL_RENDER_DELAY);

    scrollTimerRefs.current.push(timer);
  }, [clearScrollTimers]);

  useLoad(() => {
    cacheRenderInitializedRef.current = false;
    dispatch(resetInterviewFlow(surveyId));
    setTypingFinishedMap({});
    setAnswerCompleteMap({});
    setVisibleItemCount(0);
    scrollToBottom();
  });

  useEffect(() => {
    if (!restoredFromCache || cachedItemIds.length === 0 || cacheRenderInitializedRef.current) {
      return;
    }

    cacheRenderInitializedRef.current = true;
    setVisibleItemCount(cachedItemIds.length);
    setTypingFinishedMap(currentMap => {
      const cachedIdSet = new Set(cachedItemIds);

      return dataList.reduce<Record<number, boolean>>((finishedMap, item) => {
        if (item.content && cachedIdSet.has(item.id)) {
          finishedMap[item.id] = true;
        }

        return finishedMap;
      }, currentMap);
    });
  }, [cachedItemIds, dataList, restoredFromCache]);

  const pollCurrentQuestion = useCallback(() => {
    dispatch(queryCurrentInterviewQuestion());
  }, [dispatch]);

  const stopPollingTimer = useCallback(() => {
    if (pollingTimerRef.current) {
      clearInterval(pollingTimerRef.current);
      pollingTimerRef.current = null;
    }
  }, []);

  const startPolling = useCallback(() => {
    if (!pageVisibleRef.current || isPollingPaused || isFinished) {
      stopPollingTimer();
      return;
    }

    if (pollingTimerRef.current) {
      return;
    }

    pollCurrentQuestion();
    pollingTimerRef.current = setInterval(pollCurrentQuestion, POLLING_INTERVAL);
  }, [isFinished, isPollingPaused, pollCurrentQuestion, stopPollingTimer]);

  useDidShow(() => {
    pageVisibleRef.current = true;
    startPolling();
    scrollToBottom();
  });

  useDidHide(() => {
    pageVisibleRef.current = false;
    clearScrollTimers();
    stopPollingTimer();
  });

  useUnload(() => {
    pageVisibleRef.current = false;
    clearScrollTimers();
    stopPollingTimer();
  });

  useEffect(() => {
    startPolling();
  }, [startPolling]);

  useEffect(() => {
    if (dataList.length === 0) {
      setVisibleItemCount(0);
      return;
    }

    setVisibleItemCount(currentCount => {
      if (currentCount > 0 || dataList.length === 0) {
        return currentCount;
      }

      return 1;
    });
  }, [dataList.length]);

  useEffect(() => {
    if (lastVisibleItemId) {
      scrollToBottom();
    }
  }, [lastVisibleItemId, lastVisibleTypingFinished, scrollToBottom]);

  useEffect(() => {
    if (visibleItemCount <= 0 || visibleItemCount >= dataList.length) {
      return;
    }

    const lastVisibleItem = dataList[visibleItemCount - 1];
    const lastVisibleFinished = !lastVisibleItem.content || typingFinishedMap[lastVisibleItem.id];

    if (!lastVisibleFinished) {
      return;
    }

    setVisibleItemCount(currentCount => {
      if (currentCount !== visibleItemCount || currentCount >= dataList.length) {
        return currentCount;
      }

      return currentCount + 1;
    });
  }, [dataList, typingFinishedMap, visibleItemCount]);

  const setAnswerAreaRef = useCallback(
    (questionId: string) => (nextRef: AnswerAreaListRef | null) => {
      answerAreaRefs.current[questionId] = nextRef;
    },
    [],
  );

  const handleSubmit = () => {
    if (submitDisabled) {
      return;
    }

    const submitValue = answerAreaRefs.current[currentQuestionId]?.getSubmitValue();

    if (!submitValue) {
      return;
    }

    dispatch(submitCurrentInterviewQuestion(submitValue));
    scrollToBottom();
  };

  const handleTypingFinish = useCallback((itemId: number) => {
    setTypingFinishedMap(currentMap => {
      if (currentMap[itemId]) {
        return currentMap;
      }

      return {
        ...currentMap,
        [itemId]: true,
      };
    });
  }, []);

  const handleAnswerCompleteChange = useCallback((questionId: string, complete: boolean) => {
    if (!questionId) {
      return;
    }

    setAnswerCompleteMap(currentMap => {
      if (currentMap[questionId] === complete) {
        return currentMap;
      }

      return {
        ...currentMap,
        [questionId]: complete,
      };
    });
  }, []);

  const handleAnswerChange = useCallback(
    (answer: InterviewAnswerSubmitValue, complete: boolean) => {
      dispatch(persistInterviewAnswer(answer));
      handleAnswerCompleteChange(answer.questionId, complete);
    },
    [dispatch, handleAnswerCompleteChange],
  );

  const handleCountdownFinish = useCallback(
    (questionId?: string) => {
      if (!questionId) {
        return;
      }

      dispatch(timeoutCurrentInterviewQuestion(questionId));
    },
    [dispatch],
  );

  return (
    <View className="interview">
      <ScrollView
        className="interview_scroll"
        scrollY
        scrollWithAnimation
        scrollIntoView={scrollIntoView}
      >
        <View className="interview_answerList">
          {visibleDataList.map(item => {
            const shouldShowAnswer =
              Boolean(item.config) && (!item.content || typingFinishedMap[item.id]);
            const questionId = item.config?.questionId;
            const answerDisabled = questionId
              ? questionId !== currentQuestionId ||
                submittedQuestionIds.includes(questionId) ||
                isSubmitting
              : false;

            return (
              <View key={item.id} className="interview__round">
                {item.content && item.content.length > 0 && (
                  <AnchorChat
                    content={item.content}
                    role={item.role}
                    skipTyping={cachedItemIds.includes(item.id)}
                    duration={
                      item.config?.questionId === currentQuestionId ? item.duration || null : null
                    }
                    onCountdownFinish={
                      item.config?.questionId === currentQuestionId
                        ? () => handleCountdownFinish(item.config?.questionId)
                        : undefined
                    }
                    onTypingFinish={() => handleTypingFinish(item.id)}
                  />
                )}
                {shouldShowAnswer && item.config && Object.keys(item.config).length > 0 && (
                  <AnswerAreaList
                    ref={setAnswerAreaRef(item.config.questionId)}
                    options={item.config}
                    disabled={answerDisabled}
                    onAnswerChange={handleAnswerChange}
                    onCompleteChange={complete =>
                      handleAnswerCompleteChange(item.config?.questionId || '', complete)
                    }
                  />
                )}
              </View>
            );
          })}
          <View id={SCROLL_BOTTOM_ANCHOR_ID} className="interview_bottomAnchor" />
        </View>
      </ScrollView>
      {/* 底部提交栏 */}
      <View className="interview_footer">
        <Button
          className={`interview_submit ${
            submitDisabled ? 'interview_submit--disabled' : 'interview_submit--active'
          }`}
          hoverClass="interview_submit--hover"
          onClick={handleSubmit}
          loading={isSubmitting}
          disabled={submitDisabled}
        >
          {isSubmitting ? '提交中' : '提交'}
        </Button>
      </View>
    </View>
  );
};

export default InterviewPage;
