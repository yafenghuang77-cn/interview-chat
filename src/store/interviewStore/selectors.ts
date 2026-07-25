import type { AnswerConfig, InterviewItem } from '@/pages/Interview/types';
import type { RootState } from '@/store';
import type { InterviewState } from './types';

export const selectInterviewState = (state: RootState): InterviewState => state.interview;

export const selectInterviewDataList = (state: RootState): InterviewItem[] =>
  selectInterviewState(state).dataList;

export const selectInterviewCurrentQuestionId = (state: RootState): string | null =>
  selectInterviewState(state).currentQuestionId;

export const selectInterviewIsPollingPaused = (state: RootState): boolean =>
  selectInterviewState(state).isPollingPaused;

export const selectInterviewIsSubmitting = (state: RootState): boolean =>
  selectInterviewState(state).isSubmitting;

export const selectInterviewIsFinished = (state: RootState): boolean =>
  selectInterviewState(state).isFinished;

export const selectInterviewRestoredFromCache = (state: RootState): boolean =>
  selectInterviewState(state).restoredFromCache;

export const selectInterviewCachedItemIds = (state: RootState): number[] =>
  selectInterviewState(state).cachedItemIds;

export const selectInterviewSubmittedQuestionIds = (state: RootState): string[] =>
  selectInterviewState(state).submittedQuestionIds;

export const selectInterviewQuestionConfigById = (
  state: RootState,
  questionId: string,
): AnswerConfig | null =>
  selectInterviewDataList(state).find(item => item.config?.questionId === questionId)?.config ||
  null;
