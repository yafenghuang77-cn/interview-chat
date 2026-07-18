import React, { useCallback, useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.less";
import {
  fetchInterruptConfig,
  type InterruptConfig,
} from "@/services/interruptServices";

const InterruptPage: React.FC = () => {
  const [config, setConfig] = useState<InterruptConfig | null>(null);

  useEffect(() => {
    let isMounted = true;

    fetchInterruptConfig().then((data) => {
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
    "很遗憾，您的访谈已中断。",
    "由于网络断线时间过长，您的访谈结果无效。",
  ];
  const noticeLines = config?.noticeLines ?? [
    "建议您检查网络连接后重新参与访谈。",
    "如有疑问，请联系客服。",
  ];

  return (
    <View className="interrupt-page">
      <View className="interrupt-content">
        <View className="interrupt-icon">
          <Text className="interrupt-icon-mark">✕</Text>
        </View>

        <Text className="interrupt-title">{config?.title ?? "访谈中断"}</Text>

        <View className="interrupt-subtitle">
          {subtitleLines.map((line, index) => (
            <Text className="interrupt-subtitle-line" key={index}>
              {line}
            </Text>
          ))}
        </View>

        <View className="interrupt-result-tag">
          <Text className="interrupt-result-tag-text">
            {config?.resultTagText ?? "访谈结果：无效"}
          </Text>
        </View>

        <View className="interrupt-notice">
          <View className="interrupt-notice-header">
            <Text className="interrupt-notice-emoji">💡</Text>
            <Text className="interrupt-notice-title">
              {config?.noticeTitle ?? "温馨提示"}
            </Text>
          </View>
          {noticeLines.map((line, index) => (
            <Text className="interrupt-notice-text" key={index}>
              {line}
            </Text>
          ))}
        </View>

        <View className="interrupt-button" onClick={handleBackHome}>
          <Text className="interrupt-button-text">
            {config?.buttonText ?? "返回首页"}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default InterruptPage;
