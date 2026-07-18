export interface ScreeningInvalidConfig {
  title: string;
  subtitleLines: string[];
  resultTagText: string;
  noticeTitle: string;
  noticeText: string;
  buttonText: string;
}

const mockScreeningInvalidConfig: ScreeningInvalidConfig = {
  title: "未通过甄别",
  subtitleLines: [
    "很遗憾，您未通过本次访谈的甄别环节。",
    "感谢您的参与，期待您下次的参与！",
  ],
  resultTagText: "访谈结果：无效",
  noticeTitle: "甄别说明",
  noticeText:
    "本次访谈有特定的人群要求，您的条件与本次访谈的目标人群不完全匹配，因此未能进入正式访谈。",
  buttonText: "返回首页",
};

export const fetchScreeningInvalidConfig =
  (): Promise<ScreeningInvalidConfig> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...mockScreeningInvalidConfig });
      }, 300);
    });
  };
