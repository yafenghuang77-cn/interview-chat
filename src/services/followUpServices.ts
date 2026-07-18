export interface FollowUpWaitingConfig {
  roomTitle: string;
  title: string;
  subtitle: string;
  progressLabel: string;
  completedCount: number;
  totalCount: number;
  completedUnit: string;
  noticeText: string;
}

const mockFollowUpWaitingConfig: FollowUpWaitingConfig = {
  roomTitle: "百人聊天室",
  title: "请稍候",
  subtitle: "主持人正在准备问题，请稍后",
  progressLabel: "追问进度",
  completedCount: 3,
  totalCount: 8,
  completedUnit: "用户完成",
  noticeText: "此等待时间不计入您的断连时间",
};

export const fetchFollowUpWaitingConfig = (): Promise<FollowUpWaitingConfig> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ...mockFollowUpWaitingConfig });
    }, 300);
  });
};
