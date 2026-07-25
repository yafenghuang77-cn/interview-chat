import React, { useMemo, useState } from 'react';
import { Button, Input, Text, View } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { login } from '@/api/userApi';
import { authManager } from '@/utils/AuthManager';
import './index.less';

const DEFAULT_REDIRECT_URL = '/pages/index/index';

const getInputValue = (event: { detail: { value?: string } }): string => {
  return event.detail.value || '';
};

const LoginPage: React.FC = () => {
  const router = useRouter();
  const redirectUrl = useMemo(() => {
    const redirect = router.params?.redirect
      ? decodeURIComponent(String(router.params.redirect))
      : '';

    return redirect || DEFAULT_REDIRECT_URL;
  }, [router.params?.redirect]);
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const submitDisabled = submitting || account.trim().length === 0 || password.length === 0;

  const handleLogin = async () => {
    if (submitDisabled) {
      return;
    }

    setSubmitting(true);

    try {
      const loginResult = await login({
        username: account.trim(),
        password,
      });
      const token = loginResult.accessToken || loginResult.token;

      if (!token) {
        await Taro.showToast({
          title: '登录成功但未返回 token',
          icon: 'none',
          duration: 2000,
        });
        return;
      }

      authManager.setToken(token);
      await Taro.showToast({
        title: '登录成功',
        icon: 'success',
        duration: 1200,
      });
      Taro.reLaunch({
        url: redirectUrl,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="login-page">
      <View className="login-page__header">
        <Text className="login-page__title">欢迎回来</Text>
        <Text className="login-page__subtitle">登录后继续参与访谈</Text>
      </View>

      <View className="login-page__form">
        <View className="login-page__field">
          <Text className="login-page__label">账号</Text>
          <Input
            className="login-page__input"
            value={account}
            placeholder="请输入账号"
            placeholderStyle="color: #a8abb2;"
            cursorColor="#07c160"
            confirmType="next"
            onInput={event => setAccount(getInputValue(event))}
          />
        </View>

        <View className="login-page__field">
          <Text className="login-page__label">密码</Text>
          <Input
            className="login-page__input"
            value={password}
            password
            placeholder="请输入密码"
            placeholderStyle="color: #a8abb2;"
            cursorColor="#07c160"
            confirmType="done"
            onInput={event => setPassword(getInputValue(event))}
            onConfirm={handleLogin}
          />
        </View>

        <Button
          className={`login-page__submit ${
            submitDisabled ? 'login-page__submit--disabled' : 'login-page__submit--active'
          }`}
          loading={submitting}
          disabled={submitDisabled}
          hoverClass="login-page__submit--hover"
          onClick={handleLogin}
        >
          {submitting ? '登录中' : '登录'}
        </Button>
      </View>
    </View>
  );
};

export default LoginPage;
