import { setInterviewDraft } from '@/pages/Interview/persistence';
import type {
  AnswerConfig,
  InterviewAnswerSubmitValue,
  InterviewItem,
} from '@/pages/Interview/types';
import type { InterviewState } from './types';

export const initialState: InterviewState = {
  // 初始为空，进入页面后由首页路由参数写入；没有问卷 id 时不做本地持久化。
  surveyId: '',
  // 页面初始没有任何对话/题目；接口每返回一条就在 Redux 里按顺序 push 一条。
  dataList: [],
  // 初始没有缓存 item；只有从本地缓存恢复出来的 item 才会写入这里，用来跳过打字效果。
  cachedItemIds: [],
  // 默认不是缓存恢复；命中缓存后页面会一次性展示历史 list，而不是重新逐条播放。
  restoredFromCache: false,
  // 初始没有正在作答的题目；只有收到未提交题目后才设置，提交/超时后会清空。
  currentQuestionId: null,
  // 初始没有已答题；提交成功或倒计时超时都会写入，历史题据此禁用编辑。
  submittedQuestionIds: [],
  // 默认允许轮询；提交中、流程结束或手动暂停时才改为 true。
  isPollingPaused: false,
  // 默认没有提交请求；提交时用于按钮 loading，并拦截重复提交。
  isSubmitting: false,
  // 默认流程未结束；查询接口返回空数据后置为 true，页面停止轮询。
  isFinished: false,
};

export const getQuestionId = (item?: InterviewItem | null): string | null =>
  item?.config?.questionId || null;

export const writeInterviewDraft = (state: InterviewState): void => {
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

export const fillAnswerIntoDataList = (
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
