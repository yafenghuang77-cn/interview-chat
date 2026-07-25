import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { getWaitingAnswerProgress } from '@/api/InterviewApi';
import './index.less';

const DEFAULT_SURVEY_ID = 'mock-survey-001';
const DEFAULT_COMPLETED_COUNT = 3;
const DEFAULT_TOTAL_COUNT = 8;
const MOCK_REDIRECT_DELAY = 350;
const PROGRESS_POLLING_INTERVAL = 1000;

const getNumberParam = (value: string | undefined, fallback: number): number => {
  const nextValue = Number(value);

  return Number.isFinite(nextValue) ? nextValue : fallback;
};

const InterviewWaitingPage: React.FC = () => {
  const router = useRouter();
  const surveyId = String(router.params?.surveyId || DEFAULT_SURVEY_ID);
  const questionId = router.params?.questionId ? String(router.params.questionId) : undefined;
  const totalCount = getNumberParam(router.params?.total, DEFAULT_TOTAL_COUNT);
  const initialCompletedCount = getNumberParam(router.params?.completed, DEFAULT_COMPLETED_COUNT);
  const [completedCount, setCompletedCount] = useState(initialCompletedCount);
  const [progressPercent, setProgressPercent] = useState(() => {
    if (totalCount <= 0) {
      return 0;
    }

    return Math.min(Math.max((initialCompletedCount / totalCount) * 100, 0), 100);
  });
  const normalizedProgressPercent = useMemo(
    () => Math.min(Math.max(progressPercent, 0), 100),
    [progressPercent],
  );

  const handleEnterInterview = useCallback(() => {
    Taro.redirectTo({
      url: `/pages/Interview/index?surveyId=${encodeURIComponent(surveyId)}`,
    });
  }, [surveyId]);

  useEffect(() => {
    let progressTimer: ReturnType<typeof setInterval> | null = null;
    let redirectTimer: ReturnType<typeof setTimeout> | null = null;
    const queryProgress = () => {
      const response = getWaitingAnswerProgress({
        surveyId,
        questionId,
        completedAnswerCount: initialCompletedCount,
        totalAnswerCount: totalCount,
      });

      setCompletedCount(response.data.completedAnswerCount);
      setProgressPercent(response.data.progressPercent);

      if (response.data.isCompleted) {
        if (progressTimer) {
          clearInterval(progressTimer);
          progressTimer = null;
        }

        redirectTimer = setTimeout(handleEnterInterview, MOCK_REDIRECT_DELAY);
      }
    };

    queryProgress();
    if (!redirectTimer) {
      progressTimer = setInterval(queryProgress, PROGRESS_POLLING_INTERVAL);
    }

    return () => {
      if (progressTimer) {
        clearInterval(progressTimer);
      }

      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
  }, [handleEnterInterview, initialCompletedCount, questionId, surveyId, totalCount]);

  return (
    <View className="interviewWaiting">
      <View className="interviewWaiting_header">
        <View className="interviewWaiting_loading" />
        <Text className="interviewWaiting_title">请稍候</Text>
        <Text className="interviewWaiting_subtitle">主持人正在准备问题，请稍后</Text>
      </View>

      <View className="interviewWaiting_progressCard">
        <Text className="interviewWaiting_progressLabel">追问进度</Text>
        <View className="interviewWaiting_countLine">
          <Text className="interviewWaiting_countStrong">{completedCount}</Text>
          <Text className="interviewWaiting_countText"> / {totalCount} 用户完成</Text>
        </View>
        <View className="interviewWaiting_progressTrack">
          <View
            className="interviewWaiting_progressBar"
            style={{ width: `${normalizedProgressPercent.toFixed(2)}%` }}
          />
        </View>
      </View>

      <View className="interviewWaiting_tip" onClick={handleEnterInterview}>
        <View className="interviewWaiting_stopwatch">
          <View className="interviewWaiting_stopwatchTop" />
        </View>
        <Text className="interviewWaiting_tipText">此等待时间不计入您的断连时间</Text>
      </View>
    </View>
  );
};

export default InterviewWaitingPage;
