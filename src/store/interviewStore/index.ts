import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { getCurrentSurveyQuestion, submitSurveyQuestion } from '@/api/InterviewApi';
import type { AppDispatch, RootState } from '@/store';
import { getInterviewDraft, setInterviewDraft } from '@/pages/Interview/persistence';
import type {
  AnswerConfig,
  InterviewAnswerSubmitValue,
  InterviewItem,
} from '@/pages/Interview/types';

type InterviewState = {
  surveyId: string;
  dataList: InterviewItem[];
  cachedItemIds: number[];
  restoredFromCache: boolean;
  currentQuestionId: string | null;
  submittedQuestionIds: string[];
  isPollingPaused: boolean;
  isSubmitting: boolean;
  isFinished: boolean;
};

const initialState: InterviewState = {
  surveyId: '',
  dataList: [],
  cachedItemIds: [],
  restoredFromCache: false,
  currentQuestionId: null,
  submittedQuestionIds: [],
  isPollingPaused: false,
  isSubmitting: false,
  isFinished: false,
};

const getQuestionId = (item?: InterviewItem | null): string | null =>
  item?.config?.questionId || null;

const writeInterviewDraft = (state: InterviewState): void => {
  if (!state.surveyId) {
    return;
  }

  setInterviewDraft({
    surveyId: state.surveyId,
    dataList: state.dataList,
    currentQuestionId: state.currentQuestionId,
    submittedQuestionIds: state.submittedQuestionIds,
    isFinished: state.isFinished,
    updatedAt: Date.now(),
  });
};

const fillAnswerIntoDataList = (
  dataList: InterviewItem[],
  answer: InterviewAnswerSubmitValue,
): void => {
  const targetItem = dataList.find(item => item.config?.questionId === answer.questionId);

  if (!targetItem?.config) {
    return;
  }

  targetItem.config.defaultValue = answer.value as AnswerConfig['defaultValue'];
};

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    resetInterviewState(_, action: PayloadAction<string>) {
      const surveyId = action.payload;
      const draft = getInterviewDraft(surveyId);

      return {
        ...initialState,
        surveyId,
        dataList: draft?.dataList || [],
        cachedItemIds: draft?.dataList.map(item => item.id) || [],
        restoredFromCache: Boolean(draft?.dataList.length),
        currentQuestionId: draft?.currentQuestionId || null,
        submittedQuestionIds: draft?.submittedQuestionIds || [],
        isFinished: Boolean(draft?.isFinished),
        isPollingPaused: Boolean(draft?.isFinished),
      };
    },
    receiveCurrentInterviewItem(state, action: PayloadAction<InterviewItem | null>) {
      const nextItem = action.payload;

      if (!nextItem) {
        state.isFinished = true;
        state.isPollingPaused = true;
        state.currentQuestionId = null;
        writeInterviewDraft(state);
        return;
      }

      const nextQuestionId = getQuestionId(nextItem);
      const isSameItem = state.dataList.some(item => item.id === nextItem.id);

      // 轮询每 2 秒会反复返回“当前”一条数据；已经展示过的 id 不再 push，
      // 保证页面 list 只追加新对话/新题目，不会因为轮询频率产生重复卡片。
      if (!isSameItem) {
        state.dataList.push(nextItem);
        writeInterviewDraft(state);
      }

      if (!nextQuestionId) {
        state.currentQuestionId = null;
        writeInterviewDraft(state);
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
        writeInterviewDraft(state);
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
      writeInterviewDraft(state);
    },
    cancelSubmitCurrentQuestion(state) {
      state.isSubmitting = false;
      state.isPollingPaused = false;
    },
    saveInterviewAnswer(state, action: PayloadAction<InterviewAnswerSubmitValue>) {
      const answer = action.payload;

      if (!state.surveyId || !answer.questionId) {
        return;
      }

      fillAnswerIntoDataList(state.dataList, answer);
      writeInterviewDraft(state);
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
      writeInterviewDraft(state);
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
  saveInterviewAnswer,
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
    dispatch(saveInterviewAnswer(answer));
    const response = await submitSurveyQuestion(answer);

    if (response.code === 1) {
      dispatch(finishSubmitCurrentQuestion(answer.questionId));
      dispatch(queryCurrentInterviewQuestion());
      return true;
    }

    dispatch(cancelSubmitCurrentQuestion());
    return false;
  };

export const resetInterviewFlow =
  (surveyId: string) =>
  (dispatch: AppDispatch, getState: () => RootState): void => {
    dispatch(resetInterviewState(surveyId));
    if (getState().interview.dataList.length > 0) {
      return;
    }

    const response = getCurrentSurveyQuestion({ reset: true });
    dispatch(receiveCurrentInterviewItem(response.data));
  };

export const queryCurrentInterviewQuestion =
  () =>
  (dispatch: AppDispatch, getState: () => RootState): void => {
    const { currentQuestionId, isSubmitting } = getState().interview;

    // 页面层每 2 秒触发一次查询，但 Redux 只允许“没有正在作答的题目”时真正请求下一条。
    // 当前题还没提交/超时时继续查询，容易把后续题和当前题抢到同一个渲染队列里，
    // 所以这里把单题作答、顺序追加的约束集中收口。
    if (currentQuestionId || isSubmitting) {
      return;
    }

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
      dispatch(queryCurrentInterviewQuestion());
      return true;
    }

    dispatch(resumeInterviewPolling());
    return false;
  };

export const persistInterviewAnswer =
  (answer: InterviewAnswerSubmitValue) =>
  (dispatch: AppDispatch, getState: () => RootState): boolean => {
    const { currentQuestionId } = getState().interview;

    if (!currentQuestionId || currentQuestionId !== answer.questionId) {
      return false;
    }

    dispatch(saveInterviewAnswer(answer));
    return true;
  };

export type { InterviewItem };
export default interviewSlice.reducer;
