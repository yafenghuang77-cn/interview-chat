import React, { useCallback, useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.less";
import {
  fetchScreeningResultConfig,
  type ScreeningResultConfig,
} from "@/services/screeningServices";

const ScreeningResultPage: React.FC = () => {
  const [config, setConfig] = useState<ScreeningResultConfig | null>(null);

  useEffect(() => {
    let isMounted = true;

    fetchScreeningResultConfig().then((data) => {
      if (!isMounted) {
        return;
      }

      setConfig(data);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleBack = useCallback(() => {
    if (Taro.getCurrentPages().length > 1) {
      Taro.navigateBack();
      return;
    }

    Taro.reLaunch({
      url: "/pages/Login/index",
    });
  }, []);

  const handleConfirm = useCallback(() => {
    Taro.reLaunch({
      url: "/pages/Login/index",
    });
  }, []);

  return (
    <View className="screening-page">
      <View className="screening-nav">
        <View className="screening-back" onClick={handleBack}>
          <Text className="screening-back-arrow">←</Text>
        </View>
        <Text className="screening-nav-title">
          {config?.roomTitle ?? "百人聊天室"}
        </Text>
      </View>

      <View className="screening-content">
        <View className="screening-icon">
          <Text className="screening-icon-mark">✕</Text>
        </View>

        <Text className="screening-title">{config?.title ?? "未通过甄别"}</Text>
        <Text className="screening-subtitle">
          {config?.subtitle ??
            "很遗憾，根据您的回答，您不符合本次访谈的目标人群要求。"}
        </Text>

        <View className="screening-notice">
          <View className="screening-notice-header">
            <Text className="screening-notice-emoji">📋</Text>
            <Text className="screening-notice-title">
              {config?.noticeTitle ?? "甄别说明"}
            </Text>
          </View>
          <Text className="screening-notice-text">
            {config?.noticeText ??
              "本次访谈有特定的人群要求，您的条件与本次访谈的目标人群不完全匹配，因此未能继续参与。"}
          </Text>
        </View>

        <View className="screening-confirm" onClick={handleConfirm}>
          <Text className="screening-confirm-text">
            {config?.confirmText ?? "确认"}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ScreeningResultPage;
