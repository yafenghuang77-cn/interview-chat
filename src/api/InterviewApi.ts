import mockData from '@/common/mock';
import type { InterviewAnswerSubmitValue, InterviewItem } from '@/pages/Interview/types';

const mockInterviewData = mockData as InterviewItem[];
const MOCK_SUBMIT_DELAY = 500;
const MOCK_WAITING_COMPLETE_DELAY = 3000;

let currentIndex = 0;
let submittedQuestionIds = new Set<string>();
let durationByItemId = new Map<number, InterviewItem['duration']>();
let waitingProgressStartTimeByKey = new Map<string, number>();

const wait = (delay: number): Promise<void> =>
  new Promise(resolve => {
    setTimeout(resolve, delay);
  });

const getRuntimeDuration = (item: InterviewItem): InterviewItem['duration'] => {
  if (!item.duration) {
    return undefined;
  }

  const cachedDuration = durationByItemId.get(item.id);
  if (cachedDuration) {
    return [...cachedDuration];
  }

  const start = Number(item.duration[0]);
  const end = Number(item.duration[1]);
  const durationLength = Number.isFinite(start) && Number.isFinite(end) ? end - start : 0;
  const nextDuration: InterviewItem['duration'] = [Date.now(), Date.now() + durationLength];

  durationByItemId.set(item.id, nextDuration);
  return [...nextDuration];
};

const cloneInterviewItem = (item: InterviewItem): InterviewItem => ({
  ...item,
  duration: getRuntimeDuration(item),
  config: item.config
    ? {
        ...item.config,
        options: item.config.options
          ? item.config.options.map(option => ({ ...option }))
          : undefined,
        rows: Array.isArray(item.config.rows)
          ? item.config.rows.map(row => ({ ...row }))
          : item.config.rows,
        columns: item.config.columns
          ? item.config.columns.map(column => ({ ...column }))
          : undefined,
        images: item.config.images ? item.config.images.map(image => ({ ...image })) : undefined,
        videos: item.config.videos ? item.config.videos.map(video => ({ ...video })) : undefined,
        items: item.config.items
          ? item.config.items.map(inputItem => ({ ...inputItem }))
          : undefined,
      }
    : null,
});

export type CurrentSurveyQuestionResponse = {
  data: InterviewItem | null;
  currentIndex: number;
  hasMore: boolean;
};

export type CurrentSurveyQuestionParams = {
  reset?: boolean;
};

export type SubmitSurveyQuestionParams = InterviewAnswerSubmitValue & {
  submitType?: 'answer' | 'timeout';
};

export type SubmitSurveyQuestionResponse = {
  code: 0 | 1;
  message: string;
};

export type WaitingAnswerProgressParams = {
  surveyId: string;
  questionId?: string;
  sessionId?: string;
  completedAnswerCount?: number;
  totalAnswerCount?: number;
};

export type WaitingAnswerProgressResponse = {
  data: {
    completedAnswerCount: number;
    totalAnswerCount: number;
    progressPercent: number;
    isCompleted: boolean;
  };
};

const resetMockSurveyProgress = (): void => {
  currentIndex = 0;
  submittedQuestionIds = new Set<string>();
  durationByItemId = new Map<number, InterviewItem['duration']>();
  waitingProgressStartTimeByKey = new Map<string, number>();
};

const getQuestionItemIndex = (questionId: string): number =>
  mockInterviewData.findIndex(item => item.config?.questionId === questionId);

const getFiniteCount = (value: unknown, fallback: number): number => {
  const nextValue = Number(value);

  return Number.isFinite(nextValue) ? nextValue : fallback;
};

const getWaitingProgressKey = (params: WaitingAnswerProgressParams): string =>
  [
    params.surveyId,
    params.questionId || 'default-question',
    params.sessionId || 'default-session',
  ].join('_');

export const getCurrentSurveyQuestion = (
  params: CurrentSurveyQuestionParams = {},
): CurrentSurveyQuestionResponse => {
  if (params.reset) {
    resetMockSurveyProgress();
  }

  const currentItem = mockInterviewData[currentIndex] || null;
  const responseData = currentItem ? cloneInterviewItem(currentItem) : null;

  if (currentItem && !currentItem.config) {
    goNextSurveyQuestion();
  }

  return {
    data: responseData,
    currentIndex,
    hasMore: currentIndex < mockInterviewData.length,
  };
};

const goNextSurveyQuestion = (): 0 | 1 => {
  if (currentIndex >= mockInterviewData.length - 1) {
    currentIndex = mockInterviewData.length;
    return 0;
  }

  currentIndex += 1;
  return 1;
};

export const submitSurveyQuestion = async (
  params: SubmitSurveyQuestionParams,
): Promise<SubmitSurveyQuestionResponse> => {
  await wait(MOCK_SUBMIT_DELAY);

  const questionIndex = getQuestionItemIndex(params.questionId);

  if (questionIndex < 0) {
    return {
      code: 0,
      message: '提交题目不存在',
    };
  }

  const currentItem = mockInterviewData[questionIndex];

  if (!currentItem?.config) {
    return {
      code: 0,
      message: '当前没有可提交的题目',
    };
  }

  currentIndex = questionIndex;
  submittedQuestionIds.add(params.questionId);
  goNextSurveyQuestion();

  return {
    code: 1,
    message: '提交成功',
  };
};

export const getWaitingAnswerProgress = (
  params: WaitingAnswerProgressParams,
): WaitingAnswerProgressResponse => {
  const questionConfig = params.questionId
    ? mockInterviewData.find(item => item.config?.questionId === params.questionId)?.config
    : null;
  const initialCompletedCount = getFiniteCount(
    questionConfig?.completedAnswerCount ?? params.completedAnswerCount,
    0,
  );
  const totalAnswerCount = Math.max(
    getFiniteCount(questionConfig?.totalAnswerCount ?? params.totalAnswerCount, 0),
    initialCompletedCount,
  );
  const progressKey = getWaitingProgressKey(params);
  const startTime = waitingProgressStartTimeByKey.get(progressKey) || Date.now();

  waitingProgressStartTimeByKey.set(progressKey, startTime);

  if (totalAnswerCount <= 0) {
    return {
      data: {
        completedAnswerCount: 0,
        totalAnswerCount: 0,
        progressPercent: 100,
        isCompleted: true,
      },
    };
  }

  const elapsedRatio = Math.min((Date.now() - startTime) / MOCK_WAITING_COMPLETE_DELAY, 1);
  const progressValue =
    initialCompletedCount + (totalAnswerCount - initialCompletedCount) * elapsedRatio;
  const isCompleted = elapsedRatio >= 1 || progressValue >= totalAnswerCount;
  const completedAnswerCount = isCompleted
    ? totalAnswerCount
    : Math.min(Math.floor(progressValue), totalAnswerCount - 1);

  return {
    data: {
      completedAnswerCount,
      totalAnswerCount,
      progressPercent: Math.min((progressValue / totalAnswerCount) * 100, 100),
      isCompleted,
    },
  };
};
