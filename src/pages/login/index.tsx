import React from 'react';

import { View, Text, Button } from '@tarojs/components';
import { Input } from '@/components';

import useLogin from './useLogin';
import './index.less';

const Login: React.FC = () => {
  const { account, verificationCode, loading, handleLogin, handelAccount, handelVerificationCode } =
    useLogin();

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
          onChange={event => handelAccount(event.detail.value)}
        />
        <Input
          title="验证码"
          titleGap={12}
          required
          value={verificationCode}
          maxLength={6}
          placeholder="请输入 6 位验证码"
          placeholderClass="login__placeholder"
          onChange={event => handelVerificationCode(event.detail.value)}
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
