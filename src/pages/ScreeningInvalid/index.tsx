import React, { useCallback, useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.less";
import {
  fetchScreeningInvalidConfig,
  type ScreeningInvalidConfig,
} from "@/services/screeningInvalidServices";

const ScreeningInvalidPage: React.FC = () => {
  const [config, setConfig] = useState<ScreeningInvalidConfig | null>(null);

  useEffect(() => {
    let isMounted = true;

    fetchScreeningInvalidConfig().then((data) => {
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
    "很遗憾，您未通过本次访谈的甄别环节。",
    "感谢您的参与，期待您下次的参与！",
  ];

  return (
    <View className="invalid-page">
      <View className="invalid-content">
        <View className="invalid-icon">
          <Text className="invalid-icon-mark">✕</Text>
        </View>

        <Text className="invalid-title">{config?.title ?? "未通过甄别"}</Text>

        <View className="invalid-subtitle">
          {subtitleLines.map((line, index) => (
            <Text className="invalid-subtitle-line" key={index}>
              {line}
            </Text>
          ))}
        </View>

        <View className="invalid-result-tag">
          <Text className="invalid-result-tag-text">
            {config?.resultTagText ?? "访谈结果：无效"}
          </Text>
        </View>

        <View className="invalid-notice">
          <View className="invalid-notice-header">
            <Text className="invalid-notice-emoji">📋</Text>
            <Text className="invalid-notice-title">
              {config?.noticeTitle ?? "甄别说明"}
            </Text>
          </View>
          <Text className="invalid-notice-text">
            {config?.noticeText ??
              "本次访谈有特定的人群要求，您的条件与本次访谈的目标人群不完全匹配，因此未能进入正式访谈。"}
          </Text>
        </View>

        <View className="invalid-button" onClick={handleBackHome}>
          <Text className="invalid-button-text">
            {config?.buttonText ?? "返回首页"}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ScreeningInvalidPage;
