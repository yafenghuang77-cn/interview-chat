import React, { useCallback } from "react";
import { View, Text, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.less";

const InterruptPage: React.FC = () => {
  const handleBackHome = useCallback(() => {
    Taro.reLaunch({
      url: "/pages/Home/index",
    });
  }, []);

  return (
    <View className="interrupt-page">
      <View className="interrupt-main">
        <View className="interrupt-icon" />
        <Text className="interrupt-title">访谈中断</Text>
        <Text className="interrupt-desc">很遗憾，您的访谈已中断。</Text>
        <Text className="interrupt-desc">
          由于网络断线时间过长，您的访谈结果无效。
        </Text>

        <View className="interrupt-badge">
          <Text className="interrupt-badge-text">访谈结果：无效</Text>
        </View>

        <View className="interrupt-card">
          <Text className="interrupt-card-title">💡 温馨提示</Text>
          <Text className="interrupt-card-text">
            建议您检查网络连接后重新参与访谈。 如有疑问，请联系客服。
          </Text>
        </View>

        <Button className="interrupt-button" onClick={handleBackHome}>
          返回首页
        </Button>
      </View>
    </View>
  );
};

export default InterruptPage;
