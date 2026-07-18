export interface InterviewCompleteConfig {
  title: string;
  subtitleLines: string[];
  resultTagText: string;
  couponTitle: string;
  couponBadge: string;
  couponAmount: string;
  couponUnit: string;
  couponCondition: string;
  couponExpire: string;
  couponCode: string;
  buttonText: string;
}

const mockInterviewCompleteConfig: InterviewCompleteConfig = {
  title: "访谈完成",
  subtitleLines: ["感谢您参与本次访谈！", "您的回答对我们非常重要。"],
  resultTagText: "访谈结果：有效",
  couponTitle: "感谢参与",
  couponBadge: "专属福利",
  couponAmount: "50",
  couponUnit: "元",
  couponCondition: "满200元可用",
  couponExpire: "2024-02-15",
  couponCode: "YMT202401",
  buttonText: "返回首页",
};

export const fetchInterviewCompleteConfig =
  (): Promise<InterviewCompleteConfig> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...mockInterviewCompleteConfig });
      }, 300);
    });
  };
