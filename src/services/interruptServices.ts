export interface InterruptConfig {
  title: string;
  subtitleLines: string[];
  resultTagText: string;
  noticeTitle: string;
  noticeLines: string[];
  buttonText: string;
}

const mockInterruptConfig: InterruptConfig = {
  title: "访谈中断",
  subtitleLines: [
    "很遗憾，您的访谈已中断。",
    "由于网络断线时间过长，您的访谈结果无效。",
  ],
  resultTagText: "访谈结果：无效",
  noticeTitle: "温馨提示",
  noticeLines: ["建议您检查网络连接后重新参与访谈。", "如有疑问，请联系客服。"],
  buttonText: "返回首页",
};

export const fetchInterruptConfig = (): Promise<InterruptConfig> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ...mockInterruptConfig });
    }, 300);
  });
};
