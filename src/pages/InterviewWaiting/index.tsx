import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import './index.less';

const DEFAULT_SURVEY_ID = 'mock-survey-001';
const DEFAULT_COMPLETED_COUNT = 3;
const DEFAULT_TOTAL_COUNT = 8;
const MOCK_WAITING_DELAY = 3000;

const getNumberParam = (value: string | undefined, fallback: number): number => {
  const nextValue = Number(value);

  return Number.isFinite(nextValue) ? nextValue : fallback;
};

const InterviewWaitingPage: React.FC = () => {
  const router = useRouter();
  const surveyId = String(router.params?.surveyId || DEFAULT_SURVEY_ID);
  const totalCount = getNumberParam(router.params?.total, DEFAULT_TOTAL_COUNT);
  const initialCompletedCount = getNumberParam(router.params?.completed, DEFAULT_COMPLETED_COUNT);
  const [completedCount, setCompletedCount] = useState(initialCompletedCount);
  const progressPercent = useMemo(() => {
    if (totalCount <= 0) {
      return 0;
    }

    return Math.min(Math.max((completedCount / totalCount) * 100, 0), 100);
  }, [completedCount, totalCount]);

  const handleEnterInterview = useCallback(() => {
    Taro.redirectTo({
      url: `/pages/Interview/index?surveyId=${encodeURIComponent(surveyId)}`,
    });
  }, [surveyId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCompletedCount(totalCount);
      handleEnterInterview();
    }, MOCK_WAITING_DELAY);

    return () => clearTimeout(timer);
  }, [handleEnterInterview, totalCount]);

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
            style={{ width: `${progressPercent}%` }}
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
