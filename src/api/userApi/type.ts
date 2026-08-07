export interface LoginParams {
  projectId: number;
  userCode: string;
  verificationCode: string;
}

export interface LoginResult {
  accessToken?: string;
  token?: string;
  expiresIn?: number | string | null;
  [key: string]: unknown;
}

export interface getSessionStatusParams {
  followupCursor: number;
  currentQuestionId?: string;
}

export type ParticipantStatus =
  | 'ACTIVE'
  | 'ANSWER_TIMEOUT'
  | 'FOLLOWUP_WAITING'
  | 'DISCONNECTED_INVALID'
  | 'SCREENED_INVALID'
  | 'COMPLETED';

export type ApiDateValue = string | number;

export interface SessionStatusResult {
  sessionId: number;
  sessionStatus: 'ongoing' | 'completed';
  participantStatus: ParticipantStatus;
  screeningStatus: 0 | 1 | 2;
  currentQuestionIndex: number | null;
  currentQuestionId: string | null;
  questionChanged: boolean;
  questionDeadline: ApiDateValue | null;
  expectedStartTime: ApiDateValue | null;
  guideText: string | null;
  participantCount: number;
  currentQuestionAnsweredCount: number;
  onlineCount: number;
  followupCursor: number;
  hasNewFollowups: boolean;
  serverTime: string;
}
