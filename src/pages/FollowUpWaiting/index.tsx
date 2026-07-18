import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.less";
import {
  fetchFollowUpWaitingConfig,
  type FollowUpWaitingConfig,
} from "@/services/followUpServices";

const FollowUpWaitingPage: React.FC = () => {
  const [config, setConfig] = useState<FollowUpWaitingConfig | null>(null);

  useEffect(() => {
    let isMounted = true;

    fetchFollowUpWaitingConfig().then((data) => {
      if (!isMounted) {
        return;
      }

      setConfig(data);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const progressPercent = useMemo(() => {
    if (!config || config.totalCount <= 0) {
      return 0;
    }

    return Math.max(
      0,
      Math.min(100, Math.round((config.completedCount / config.totalCount) * 100)),
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
    <View className="follow-page">
      <View className="follow-nav">
        <View className="follow-back" onClick={handleBack}>
          <Text className="follow-back-arrow">←</Text>
        </View>
        <Text className="follow-nav-title">
          {config?.roomTitle ?? "百人聊天室"}
        </Text>
      </View>

      <View className="follow-content">
        <View className="follow-spinner">
          <View className="follow-spinner-ring" />
        </View>

        <Text className="follow-title">{config?.title ?? "请稍候"}</Text>
        <Text className="follow-subtitle">
          {config?.subtitle ?? "主持人正在准备问题，请稍后"}
        </Text>

        <View className="follow-progress-card">
          <Text className="follow-progress-label">
            {config?.progressLabel ?? "追问进度"}
          </Text>
          <View className="follow-progress-row">
            <Text className="follow-progress-count">
              {config?.completedCount ?? 0}
            </Text>
            <Text className="follow-progress-total">
              {" "}
              / {config?.totalCount ?? 0} {config?.completedUnit ?? "用户完成"}
            </Text>
          </View>
          <View className="follow-progress-track">
            <View
              className="follow-progress-bar"
              style={{ width: `${progressPercent}%` }}
            />
          </View>
        </View>

        <View className="follow-notice">
          <Text className="follow-notice-emoji">⏱</Text>
          <Text className="follow-notice-text">
            {config?.noticeText ?? "此等待时间不计入您的断连时间"}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default FollowUpWaitingPage;
