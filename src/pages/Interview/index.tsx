import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLoad, useRouter } from '@tarojs/taro';
import { View, Button, ScrollView } from '@tarojs/components';
import { QUESTION_COMPONENT_TYPE, type QuestionComponentType } from '@/common/constants';
import {
  persistInterviewAnswer,
  queryCurrentInterviewQuestion,
  resetInterviewFlow,
  submitCurrentInterviewQuestion,
  timeoutCurrentInterviewQuestion,
} from '@/store/interviewStore';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import AnchorChat from './components/AnchorChat';
import AnswerAreaList, { type AnswerAreaListRef } from './components/AnswerAreaList';
import type { InterviewAnswerSubmitValue } from './types';
import './index.less';

const POLLING_INTERVAL = 2000;
const DISPLAY_QUESTION_TYPES: QuestionComponentType[] = [
  QUESTION_COMPONENT_TYPE.IMAGE_DISPLAY,
  QUESTION_COMPONENT_TYPE.VIDEO_DISPLAY,
];

const InterviewPage: React.FC = () => {
  const router = useRouter();
  const surveyId = String(router.params?.surveyId || 'default-survey');
  const dispatch = useAppDispatch();
  const dataList = useAppSelector(state => state.interview.dataList);
  const currentQuestionId = useAppSelector(state => state.interview.currentQuestionId);
  const isPollingPaused = useAppSelector(state => state.interview.isPollingPaused);
  const isSubmitting = useAppSelector(state => state.interview.isSubmitting);
  const isFinished = useAppSelector(state => state.interview.isFinished);
  const restoredFromCache = useAppSelector(state => state.interview.restoredFromCache);
  const cachedItemIds = useAppSelector(state => state.interview.cachedItemIds);
  const submittedQuestionIds = useAppSelector(state => state.interview.submittedQuestionIds);
  const answerAreaRefs = useRef<Record<string, AnswerAreaListRef | null>>({});
  const cacheRenderInitializedRef = useRef(false);
  const [typingFinishedMap, setTypingFinishedMap] = useState<Record<number, boolean>>({});
  const [answerCompleteMap, setAnswerCompleteMap] = useState<Record<string, boolean>>({});
  const [visibleItemCount, setVisibleItemCount] = useState(0);
  const visibleDataList = dataList.slice(0, visibleItemCount);
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

  useLoad(() => {
    cacheRenderInitializedRef.current = false;
    dispatch(resetInterviewFlow(surveyId));
    setTypingFinishedMap({});
    setAnswerCompleteMap({});
    setVisibleItemCount(0);
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

  useEffect(() => {
    if (isPollingPaused || isFinished) {
      return undefined;
    }

    pollCurrentQuestion();

    const timer = setInterval(pollCurrentQuestion, POLLING_INTERVAL);

    return () => clearInterval(timer);
  }, [isFinished, isPollingPaused, pollCurrentQuestion]);

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
      <ScrollView className="interview_scroll" scrollY scrollWithAnimation>
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
