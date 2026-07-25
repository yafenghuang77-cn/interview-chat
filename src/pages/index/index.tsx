import { useState } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro, { useLoad } from '@tarojs/taro';
import { getCurrentUserInfo, type UserInfo } from '@/api/userApi';
import { authManager } from '@/utils/AuthManager';
import './index.less';

const getUserDisplayName = (userInfo: UserInfo | null): string => {
  return userInfo?.nickname || userInfo?.username || '用户';
};

export default function Index() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [userLoading, setUserLoading] = useState(false);

  useLoad(() => {
    if (!authManager.guard({ redirect: false })) {
      return;
    }

    setUserLoading(true);
    getCurrentUserInfo()
      .then(info => {
        setUserInfo(info);
      })
      .catch(() => {
        setUserInfo(null);
      })
      .finally(() => {
        setUserLoading(false);
      });
  });

  return (
    <View className="index">
      <Text>{userLoading ? '正在获取用户信息' : `你好，${getUserDisplayName(userInfo)}`}</Text>
      <Button
        type="primary"
        onClick={() => {
          Taro.navigateTo({
            url: '/pages/Interview/index?surveyId=mock-survey-001',
          });
        }}
      >
        去答题
      </Button>
    </View>
  );
}
