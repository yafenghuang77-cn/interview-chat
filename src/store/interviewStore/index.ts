import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { getCurrentSurveyQuestion, submitSurveyQuestion } from '@/api/InterviewApi';
import type { AppDispatch, RootState } from '@/store';
import type { InterviewAnswerSubmitValue, InterviewItem } from '@/pages/Interview/types';

type InterviewState = {
  dataList: InterviewItem[];
  currentQuestionId: string | null;
  submittedQuestionIds: string[];
  isPollingPaused: boolean;
  isSubmitting: boolean;
  isFinished: boolean;
};

const initialState: InterviewState = {
  dataList: [],
  currentQuestionId: null,
  submittedQuestionIds: [],
  isPollingPaused: false,
  isSubmitting: false,
  isFinished: false,
};

const getQuestionId = (item?: InterviewItem | null): string | null =>
  item?.config?.questionId || null;

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    resetInterviewState() {
      return initialState;
    },
    receiveCurrentInterviewItem(state, action: PayloadAction<InterviewItem | null>) {
      const nextItem = action.payload;

      if (!nextItem) {
        state.isFinished = true;
        state.isPollingPaused = true;
        state.currentQuestionId = null;
        return;
      }

      const nextQuestionId = getQuestionId(nextItem);
      const isSameItem = state.dataList.some(item => item.id === nextItem.id);

      // 轮询每 2 秒会反复返回“当前”一条数据；已经展示过的 id 不再 push，
      // 保证页面 list 只追加新对话/新题目，不会因为轮询频率产生重复卡片。
      if (!isSameItem) {
        state.dataList.push(nextItem);
      }

      if (!nextQuestionId) {
        state.currentQuestionId = null;
        return;
      }

      // 页面设计是一次只回答一道题：只要还有未提交的 currentQuestionId，
      // 新轮询结果即使提前返回下一题，也不能替换当前题；这层校验放在 Redux，
      // 避免页面和 API mock 各自判断导致状态不一致。
      if (state.currentQuestionId && state.currentQuestionId !== nextQuestionId) {
        return;
      }

      if (!state.submittedQuestionIds.includes(nextQuestionId)) {
        state.currentQuestionId = nextQuestionId;
      }
    },
    pauseInterviewPolling(state) {
      state.isPollingPaused = true;
    },
    resumeInterviewPolling(state) {
      if (!state.isFinished) {
        state.isPollingPaused = false;
      }
    },
    startSubmitCurrentQuestion(state) {
      state.isSubmitting = true;
      state.isPollingPaused = true;
    },
    finishSubmitCurrentQuestion(state, action: PayloadAction<string | null>) {
      const questionId = action.payload;

      state.isSubmitting = false;
      if (questionId && !state.submittedQuestionIds.includes(questionId)) {
        state.submittedQuestionIds.push(questionId);
      }

      if (questionId && state.currentQuestionId === questionId) {
        state.currentQuestionId = null;
      }

      state.isPollingPaused = false;
    },
    cancelSubmitCurrentQuestion(state) {
      state.isSubmitting = false;
      state.isPollingPaused = false;
    },
    markCurrentQuestionTimeout(state, action: PayloadAction<string>) {
      const questionId = action.payload;

      // 倒计时结束等同于当前题自动作废并进入下一题；这里也记录 questionId，
      // 防止过期题的倒计时回调或轮询重复触发后又把同一题追加/提交一次。
      if (!state.submittedQuestionIds.includes(questionId)) {
        state.submittedQuestionIds.push(questionId);
      }

      if (state.currentQuestionId === questionId) {
        state.currentQuestionId = null;
      }

      state.isPollingPaused = false;
    },
  },
});

export const {
  cancelSubmitCurrentQuestion,
  finishSubmitCurrentQuestion,
  markCurrentQuestionTimeout,
  pauseInterviewPolling,
  receiveCurrentInterviewItem,
  resetInterviewState,
  resumeInterviewPolling,
  startSubmitCurrentQuestion,
} = interviewSlice.actions;

export const submitCurrentInterviewQuestion =
  (answer: InterviewAnswerSubmitValue) =>
  async (dispatch: AppDispatch, getState: () => RootState): Promise<boolean> => {
    const { currentQuestionId, isSubmitting } = getState().interview;

    if (isSubmitting || !currentQuestionId || currentQuestionId !== answer.questionId) {
      return false;
    }

    dispatch(startSubmitCurrentQuestion());
    const response = await submitSurveyQuestion(answer);

    if (response.code === 1) {
      dispatch(finishSubmitCurrentQuestion(answer.questionId));
      return true;
    }

    dispatch(cancelSubmitCurrentQuestion());
    return false;
  };

export const resetInterviewFlow =
  () =>
  (dispatch: AppDispatch): void => {
    dispatch(resetInterviewState());
    const response = getCurrentSurveyQuestion(true);
    dispatch(receiveCurrentInterviewItem(response.data));
  };

export const queryCurrentInterviewQuestion =
  () =>
  (dispatch: AppDispatch): void => {
    const response = getCurrentSurveyQuestion();

    dispatch(receiveCurrentInterviewItem(response.data));
  };

export const timeoutCurrentInterviewQuestion =
  (questionId: string) =>
  async (dispatch: AppDispatch, getState: () => RootState): Promise<boolean> => {
    const { currentQuestionId, isSubmitting, submittedQuestionIds } = getState().interview;

    if (
      isSubmitting ||
      currentQuestionId !== questionId ||
      submittedQuestionIds.includes(questionId)
    ) {
      return false;
    }

    dispatch(pauseInterviewPolling());
    const response = await submitSurveyQuestion({
      questionId,
      value: null,
      submitType: 'timeout',
    });

    if (response.code === 1) {
      dispatch(markCurrentQuestionTimeout(questionId));
      return true;
    }

    dispatch(resumeInterviewPolling());
    return false;
  };

export type { InterviewItem };
export default interviewSlice.reducer;
