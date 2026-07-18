import React, { useCallback } from "react";
import { View, Text, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.less";

const ResultPage: React.FC = () => {
  const handleBackHome = useCallback(() => {
    Taro.reLaunch({
      url: "/pages/Home/index",
    });
  }, []);

  return (
    <View className="result-page">
      <View className="result-main">
        <View className="result-icon" />
        <Text className="result-title">未通过甄别</Text>
        <Text className="result-desc">很遗憾，您未通过本次访谈的甄别环节。</Text>
        <Text className="result-desc">感谢您的参与，期待您下次的参与！</Text>

        <View className="result-badge">
          <Text className="result-badge-text">访谈结果：无效</Text>
        </View>

        <View className="result-card">
          <Text className="result-card-title">📋 甄别说明</Text>
          <Text className="result-card-text">
            本次访谈有特定的人群要求，您的条件与本次访谈的目标人群不完全匹配，因此未能进入正式访谈。
          </Text>
        </View>

        <Button className="result-button" onClick={handleBackHome}>
          返回首页
        </Button>
      </View>
    </View>
  );
};

export default ResultPage;
