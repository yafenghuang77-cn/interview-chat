import mockData from '@/common/mock';
import type { InterviewAnswerSubmitValue, InterviewItem } from '@/pages/Interview/types';

const mockInterviewData = mockData as InterviewItem[];
const MOCK_SUBMIT_DELAY = 500;

let currentIndex = 0;
let submittedQuestionIds = new Set<string>();
let durationByItemId = new Map<number, InterviewItem['duration']>();

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

export type SubmitSurveyQuestionParams = InterviewAnswerSubmitValue & {
  submitType?: 'answer' | 'timeout';
};

export type SubmitSurveyQuestionResponse = {
  code: 0 | 1;
  message: string;
};

const resetMockSurveyProgress = (): void => {
  currentIndex = 0;
  submittedQuestionIds = new Set<string>();
  durationByItemId = new Map<number, InterviewItem['duration']>();
};

export const getCurrentSurveyQuestion = (reset = false): CurrentSurveyQuestionResponse => {
  if (reset) {
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

  const currentItem = mockInterviewData[currentIndex];

  if (!currentItem?.config) {
    return {
      code: 0,
      message: '当前没有可提交的题目',
    };
  }

  if (currentItem.config.questionId !== params.questionId) {
    return {
      code: 0,
      message: '提交题目与当前题目不一致',
    };
  }

  submittedQuestionIds.add(params.questionId);
  goNextSurveyQuestion();

  return {
    code: 1,
    message: '提交成功',
  };
};
