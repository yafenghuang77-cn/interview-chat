import type { InterviewItem } from '@/pages/Interview/types';

export type InterviewState = {
  // 首页传入的问卷 id，用它隔离不同问卷的本地答题缓存。
  surveyId: string;
  // 页面完整渲染列表：主持人对话和题目都存在这里，持久化也保存整份 list。
  dataList: InterviewItem[];
  // 本轮页面初始化时从缓存恢复出来的 item id；这些主持人对话不再播放打字效果。
  cachedItemIds: number[];
  // 标记是否命中过本地缓存，页面据此一次性恢复历史渲染进度。
  restoredFromCache: boolean;
  // 当前允许编辑/提交的题目 id；为空时才允许继续查询下一条数据。
  currentQuestionId: string | null;
  // 已提交或已超时的题目 id；命中后页面要置为禁用，避免重复编辑/提交。
  submittedQuestionIds: string[];
  // 提交中、结束后或手动暂停时使用，页面轮询 effect 会读取这个字段停掉轮询。
  isPollingPaused: boolean;
  // 提交接口请求状态，用于全局/按钮 loading，并防止重复提交。
  isSubmitting: boolean;
  // 接口返回空数据后认为流程结束，页面不再轮询。
  isFinished: boolean;
};
