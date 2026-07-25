import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { getInterviewDraft, setInterviewDraft } from '@/pages/Interview/persistence';
import type {
  AnswerConfig,
  InterviewAnswerSubmitValue,
  InterviewItem,
} from '@/pages/Interview/types';
import { initialInterviewState, INTERVIEW_SLICE_NAME } from './constants';
import type { InterviewState } from './types';

const getQuestionId = (item?: InterviewItem | null): string | null =>
  item?.config?.questionId || null;

const writeInterviewDraft = (state: InterviewState): void => {
  if (!state.surveyId) {
    return;
  }

  // 持久化只在 Redux 收口：API mock 不接收缓存参数，后续接后端也只需要替换接口层。
  // 这里保存整份 dataList，是为了用户切出去再回来时能恢复完整页面、已填答案和禁用状态。
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

  // 答案直接回填到题目 config.defaultValue，页面恢复时各题型组件可以按默认值还原。
  targetItem.config.defaultValue = answer.value as AnswerConfig['defaultValue'];
};

const interviewSlice = createSlice({
  name: INTERVIEW_SLICE_NAME,
  initialState: initialInterviewState,
  reducers: {
    resetInterviewState(_, action: PayloadAction<string>) {
      const surveyId = action.payload;
      const draft = getInterviewDraft(surveyId);

      // 进入答题页先尝试按 surveyId 恢复整页 list；命中缓存时不重置 mock 查询接口，
      // 避免把用户已经看到/填写过的内容重新拉一遍。
      return {
        // 先铺默认状态，保证不同问卷之间不会继承上一份问卷的临时提交/轮询状态。
        ...initialInterviewState,
        // 当前问卷 id 是缓存 key 的一部分，也是后续写缓存时必须带上的业务 id。
        surveyId,
        // 缓存中保存的是完整页面 list，恢复后页面可以直接重建历史主持人对话和题目。
        dataList: draft?.dataList || [],
        // 只记录本次从缓存带出来的 id，页面用它判断哪些主持人对话不需要打字效果。
        cachedItemIds: draft?.dataList.map(item => item.id) || [],
        // 标记是否走了缓存恢复；页面初始化渲染进度时只用它触发一次。
        restoredFromCache: Boolean(draft?.dataList.length),
        // 恢复正在作答的题目，保证用户切回来后还能继续编辑当前题。
        currentQuestionId: draft?.currentQuestionId || null,
        // 恢复已提交/已超时的题目，页面据此把历史题置灰并禁止再次编辑。
        submittedQuestionIds: draft?.submittedQuestionIds || [],
        // 恢复已结束状态；结束后不再触发轮询。
        isFinished: Boolean(draft?.isFinished),
        // 如果流程已经结束，初始化时直接暂停轮询；未结束则保持默认允许轮询。
        isPollingPaused: Boolean(draft?.isFinished),
      };
    },
    receiveCurrentInterviewItem(state, action: PayloadAction<InterviewItem | null>) {
      const nextItem = action.payload;

      if (!nextItem) {
        // 查询接口返回空数据表示没有下一条内容了，直接结束流程并把结束状态写入缓存。
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
        // 没有 questionId 的数据是纯主持人对话，不占用当前题；写入后继续等下一次查询。
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
        // 只有未提交/未超时的题目才能成为当前题；历史题即使命中轮询也不会重新激活。
        state.currentQuestionId = nextQuestionId;
        writeInterviewDraft(state);
      }
    },
    pauseInterviewPolling(state) {
      // 手动暂停轮询，主要用于倒计时超时提交这类异步流程开始前。
      state.isPollingPaused = true;
    },
    resumeInterviewPolling(state) {
      // 已结束的流程不能恢复轮询，避免页面结束后又继续请求。
      if (!state.isFinished) {
        state.isPollingPaused = false;
      }
    },
    startSubmitCurrentQuestion(state) {
      // 提交期间暂停轮询，避免接口提交还没返回时又查询到下一条造成渲染竞态。
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

      // 当前题提交成功后清空 currentQuestionId；轮询恢复后只会继续拉下一题/下一段对话。
      state.isPollingPaused = false;
      writeInterviewDraft(state);
    },
    cancelSubmitCurrentQuestion(state) {
      // 提交失败或接口拒绝时恢复页面交互，让用户可以再次点击提交。
      state.isSubmitting = false;
      state.isPollingPaused = false;
    },
    saveInterviewAnswer(state, action: PayloadAction<InterviewAnswerSubmitValue>) {
      const answer = action.payload;

      if (!state.surveyId || !answer.questionId) {
        return;
      }

      // 用户边填写边持久化，切出页面再回来时不会丢当前题已经输入/选择的内容。
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

export default interviewSlice.reducer;
