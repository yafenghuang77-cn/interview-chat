export interface HomeWaitingConfig {
  roomTitle: string;
  statusText: string;
  onlineCurrent: number;
  onlineTotal: number;
  countdownSeconds: number;
}

const mockHomeWaitingConfig: HomeWaitingConfig = {
  roomTitle: "百人聊天室",
  statusText: "访谈即将开始，请稍候...",
  onlineCurrent: 20,
  onlineTotal: 100,
  countdownSeconds: 5 * 60 + 32,
};

export const fetchHomeWaitingConfig = (): Promise<HomeWaitingConfig> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ...mockHomeWaitingConfig });
    }, 300);
  });
};
