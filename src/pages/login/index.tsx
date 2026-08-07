import React, { useState } from 'react';
import Taro, { useRouter } from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';
import { Input } from '@/components';
import { setToken } from '@/utils/request';
import { login } from '../../api/userApi';
import './index.less';

const DEFAULT_PROJECT_ID = 101;
const getProjectId = (value: unknown): number => {
  const projectId = Number(Array.isArray(value) ? value[0] : value);
  return Number.isSafeInteger(projectId) && projectId > 0 ? projectId : DEFAULT_PROJECT_ID;
};

const Login: React.FC = () => {
  const router = useRouter();
  const params = (router.params || {}) as Record<string, unknown>;
  const projectId = getProjectId(params.projectId);
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const handleLogin = async () => {
    if (loading) return;

    if (!account.trim()) {
      Taro.showToast({ title: '请输入账号', icon: 'none' });
      return;
    }
    if (!verificationCode.trim()) {
      Taro.showToast({ title: '请输入验证码', icon: 'none' });
      return;
    }
    if (verificationCode.trim().length !== 6) {
      Taro.showToast({ title: '验证码应为 6 位', icon: 'none' });
      return;
    }

    try {
      setLoading(true);
      const result = await login({
        projectId,
        userCode: account.trim(),
        verificationCode: verificationCode.trim(),
      });

      const token = result.token || result.accessToken;

      if (token) {
        setToken(token);
      }
    } catch {
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="login">
      <View className="login__header">
        <View className="login__logo">
          <View className="login__logoBubble" />
        </View>
        <Text className="login__title">百人聊天室访谈系统</Text>
        <Text className="login__subtitle">登录参与访谈</Text>
      </View>

      <View className="login__form">
        <Input
          title="账号"
          titleGap={12}
          required
          value={account}
          placeholder="请输入账号"
          placeholderClass="login__placeholder"
          onChange={event => setAccount(event.detail.value)}
        />
        <Input
          title="验证码"
          titleGap={12}
          required
          value={verificationCode}
          maxLength={6}
          placeholder="请输入 6 位验证码"
          placeholderClass="login__placeholder"
          onChange={event => setVerificationCode(event.detail.value)}
        />

        <Button
          className="login__submit"
          loading={loading}
          hoverClass="login__submit--hover"
          onClick={handleLogin}
        >
          登录
        </Button>
      </View>
    </View>
  );
};

export default Login;
