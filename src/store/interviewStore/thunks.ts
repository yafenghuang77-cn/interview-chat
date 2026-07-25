import { getCurrentSurveyQuestion, submitSurveyQuestion } from '@/api/InterviewApi';
import type { InterviewAnswerSubmitValue } from '@/pages/Interview/types';
import type { AppDispatch, RootState } from '@/store';
import {
  cancelSubmitCurrentQuestion,
  finishSubmitCurrentQuestion,
  markCurrentQuestionTimeout,
  pauseInterviewPolling,
  receiveCurrentInterviewItem,
  resetInterviewState,
  resumeInterviewPolling,
  saveInterviewAnswer,
  startSubmitCurrentQuestion,
} from './slice';

export const resetInterviewFlow =
  (surveyId: string) =>
  (dispatch: AppDispatch, getState: () => RootState): void => {
    dispatch(resetInterviewState(surveyId));

    // 有缓存说明 Redux 已经恢复出完整页面 list，首页再次进入时不用再调 mock 重置流程。
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

export const submitCurrentInterviewQuestion =
  (answer: InterviewAnswerSubmitValue) =>
  async (dispatch: AppDispatch, getState: () => RootState): Promise<boolean> => {
    const { currentQuestionId, isSubmitting } = getState().interview;

    if (isSubmitting || !currentQuestionId || currentQuestionId !== answer.questionId) {
      return false;
    }

    // 正常提交只调用提交接口一次；先把答案写入缓存，再等待接口成功后推进到下一条。
    dispatch(startSubmitCurrentQuestion());
    dispatch(saveInterviewAnswer(answer));
    const response = await submitSurveyQuestion(answer);

    if (response.code === 1) {
      dispatch(finishSubmitCurrentQuestion(answer.questionId));
      // 提交完成立即补拉下一条，减少“提交成功但还没轮询到下一题”时用户切走导致的空窗。
      dispatch(queryCurrentInterviewQuestion());
      return true;
    }

    dispatch(cancelSubmitCurrentQuestion());
    return false;
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

    // 超时和手动提交走同一个提交接口，只是 submitType 标记为 timeout。
    // 成功后把题目加入 submittedQuestionIds，页面会按已答/超时状态禁用历史题。
    dispatch(pauseInterviewPolling());
    const response = await submitSurveyQuestion({
      questionId,
      value: null,
      submitType: 'timeout',
    });

    if (response.code === 1) {
      dispatch(markCurrentQuestionTimeout(questionId));
      // 超时后立即进入下一题，不等待下一次 2 秒轮询。
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

    // 只允许持久化当前题答案，历史题或提前渲染出的非当前题不能改写缓存。
    dispatch(saveInterviewAnswer(answer));
    return true;
  };
