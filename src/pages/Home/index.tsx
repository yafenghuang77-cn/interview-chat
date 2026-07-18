import React, { useEffect, useState, useCallback } from "react";
import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.less";

const INITIAL_SECONDS = 5 * 60 + 32;

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
  const [seconds, setSeconds] = useState(INITIAL_SECONDS);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeText = formatTime(seconds);
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
        <Text className="home-nav-title">百人聊天室</Text>
      </View>

      <View className="home-content">
        <View className="home-loading">
          <View className="home-dot" />
          <View className="home-dot" />
          <View className="home-dot" />
          <View className="home-dot home-dot-active" />
          <View className="home-dot" />
        </View>

        <Text className="home-status">访谈即将开始，请稍候...</Text>

        <View className="home-online-card">
          <Text className="home-online-label">当前在线人数</Text>
          <View className="home-online-row">
            <Text className="home-online-count">100</Text>
            <Text className="home-online-total"> / 100人</Text>
          </View>
          <View className="home-progress">
            <View className="home-progress-bar" />
          </View>
        </View>

        <View className="home-countdown-card">
          <Text className="home-countdown-label">距离开始还有</Text>
          <Text className="home-countdown-time">{timeText}</Text>
        </View>
      </View>
    </View>
  );
};

export default HomePage;
