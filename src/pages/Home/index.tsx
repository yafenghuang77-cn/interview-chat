import React, { useEffect, useMemo, useState, useCallback } from "react";
import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.less";
import {
  fetchHomeWaitingConfig,
  type HomeWaitingConfig,
} from "@/services/homeServices";

const formatTime = (seconds: number) => {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(
    2,
    "0",
  )}`;
};

const HomePage: React.FC = () => {
  const [config, setConfig] = useState<HomeWaitingConfig | null>(null);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let isMounted = true;

    fetchHomeWaitingConfig().then((data) => {
      if (!isMounted) {
        return;
      }

      setConfig(data);
      setSeconds(data.countdownSeconds);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!config) {
      return;
    }

    const timer = setInterval(() => {
      setSeconds((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [config]);

  const timeText = useMemo(() => formatTime(seconds), [seconds]);
  const onlinePercent = useMemo(() => {
    if (!config || config.onlineTotal <= 0) {
      return 0;
    }

    return Math.max(
      0,
      Math.min(100, Math.round((config.onlineCurrent / config.onlineTotal) * 100)),
    );
  }, [config]);

  const handleBack = useCallback(() => {
    if (Taro.getCurrentPages().length > 1) {
      Taro.navigateBack();
      return;
    }

    Taro.reLaunch({
      url: "/pages/Login/index",
    });
  }, []);

  return (
    <View className="home-page">
      <View className="home-nav">
        <View className="home-back" onClick={handleBack}>
          <Text className="home-back-arrow">←</Text>
        </View>
        <Text className="home-nav-title">
          {config?.roomTitle ?? "百人聊天室"}
        </Text>
      </View>

      <View className="home-content">
        <View className="home-loading">
          <View className="home-dot" />
          <View className="home-dot" />
          <View className="home-dot" />
          <View className="home-dot home-dot-active" />
          <View className="home-dot" />
        </View>

        <Text className="home-status">
          {config?.statusText ?? "访谈即将开始，请稍候..."}
        </Text>

        <View className="home-online-card">
          <Text className="home-online-label">当前在线人数</Text>
          <View className="home-online-row">
            <Text className="home-online-count">
              {config?.onlineCurrent ?? 0}
            </Text>
            <Text className="home-online-total">
              {" "}
              / {config?.onlineTotal ?? 0}人
            </Text>
          </View>
          <View className="home-progress">
            <View
              className="home-progress-bar"
              style={{ width: `${onlinePercent}%` }}
            />
          </View>
        </View>

        <View className="home-countdown-card">
          <Text className="home-countdown-label">距离开始还有</Text>
          <Text className="home-countdown-time">
            {config ? timeText : "--:--"}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default HomePage;
