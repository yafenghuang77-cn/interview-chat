export interface ScreeningResultConfig {
  roomTitle: string;
  passed: boolean;
  title: string;
  subtitle: string;
  noticeTitle: string;
  noticeText: string;
  confirmText: string;
}

const mockScreeningResultConfig: ScreeningResultConfig = {
  roomTitle: "百人聊天室",
  passed: false,
  title: "未通过甄别",
  subtitle: "很遗憾，根据您的回答，您不符合本次访谈的目标人群要求。",
  noticeTitle: "甄别说明",
  noticeText:
    "本次访谈有特定的人群要求，您的条件与本次访谈的目标人群不完全匹配，因此未能继续参与。",
  confirmText: "确认",
};

export const fetchScreeningResultConfig = (): Promise<ScreeningResultConfig> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ...mockScreeningResultConfig });
    }, 300);
  });
};
