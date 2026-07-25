import { storageManager } from '@/utils';
import type { InterviewItem } from './types';

const INTERVIEW_DRAFT_KEY_PREFIX = 'interview_draft';

export type InterviewDraftState = {
  surveyId: string;
  dataList: InterviewItem[];
  currentQuestionId: string | null;
  submittedQuestionIds: string[];
  isFinished: boolean;
  updatedAt: number;
};

const getInterviewDraftKey = (surveyId: string): string =>
  `${INTERVIEW_DRAFT_KEY_PREFIX}_${surveyId}`;

export const getInterviewDraft = (surveyId: string): InterviewDraftState | null => {
  if (!surveyId) {
    return null;
  }

  return storageManager.get<InterviewDraftState>(getInterviewDraftKey(surveyId));
};

export const setInterviewDraft = (draft: InterviewDraftState): void => {
  if (!draft.surveyId) {
    return;
  }

  storageManager.set(getInterviewDraftKey(draft.surveyId), {
    ...draft,
    updatedAt: Date.now(),
  });
};
