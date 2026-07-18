import React, { useCallback, useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.less";
import {
  fetchInterviewCompleteConfig,
  type InterviewCompleteConfig,
} from "@/services/interviewCompleteServices";

const InterviewCompletePage: React.FC = () => {
  const [config, setConfig] = useState<InterviewCompleteConfig | null>(null);

  useEffect(() => {
    let isMounted = true;

    fetchInterviewCompleteConfig().then((data) => {
      if (!isMounted) {
        return;
      }

      setConfig(data);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleBackHome = useCallback(() => {
    Taro.reLaunch({
      url: "/pages/Home/index",
    });
  }, []);

  const subtitleLines = config?.subtitleLines ?? [
    "感谢您参与本次访谈！",
    "您的回答对我们非常重要。",
  ];

  return (
    <View className="complete-page">
      <View className="complete-content">
        <View className="complete-icon">
          <Text className="complete-icon-mark">✓</Text>
        </View>

        <Text className="complete-title">{config?.title ?? "访谈完成"}</Text>

        <View className="complete-subtitle">
          {subtitleLines.map((line, index) => (
            <Text className="complete-subtitle-line" key={index}>
              {line}
            </Text>
          ))}
        </View>

        <View className="complete-result-tag">
          <Text className="complete-result-tag-text">
            {config?.resultTagText ?? "访谈结果：有效"}
          </Text>
        </View>

        <View className="complete-coupon">
          <View className="complete-coupon-notch complete-coupon-notch-left" />
          <View className="complete-coupon-notch complete-coupon-notch-right" />

          <View className="complete-coupon-header">
            <Text className="complete-coupon-title">
              🎁 {config?.couponTitle ?? "感谢参与"}
            </Text>
            <View className="complete-coupon-badge">
              <Text className="complete-coupon-badge-text">
                {config?.couponBadge ?? "专属福利"}
              </Text>
            </View>
          </View>

          <View className="complete-coupon-amount">
            <Text className="complete-coupon-amount-num">
              {config?.couponAmount ?? "50"}
            </Text>
            <Text className="complete-coupon-amount-unit">
              {" "}
              {config?.couponUnit ?? "元"}
            </Text>
          </View>

          <Text className="complete-coupon-condition">
            {config?.couponCondition ?? "满200元可用"}
          </Text>

          <View className="complete-coupon-footer">
            <Text className="complete-coupon-footer-text">
              有效期至 {config?.couponExpire ?? "2024-02-15"}
            </Text>
            <Text className="complete-coupon-footer-text">
              券码：{config?.couponCode ?? "YMT202401"}
            </Text>
          </View>
        </View>

        <View className="complete-button" onClick={handleBackHome}>
          <Text className="complete-button-text">
            {config?.buttonText ?? "返回首页"}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default InterviewCompletePage;
