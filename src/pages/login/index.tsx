import React, { useMemo, useState } from 'react';
import { Button, Input, Text, View } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { login } from '@/api/userApi';
import { authManager } from '@/utils/AuthManager';
import './index.less';

const DEFAULT_REDIRECT_URL = '/pages/index/index';

type LoginField = 'account' | 'password';

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
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [focusedField, setFocusedField] = useState<LoginField | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const submitDisabled = submitting || account.trim().length === 0 || password.length === 0;

  const getFieldClassName = (field: LoginField, filled: boolean): string => {
    return [
      'login-page__field',
      focusedField === field ? 'login-page__field--focus' : '',
      filled ? 'login-page__field--filled' : '',
    ]
      .filter(Boolean)
      .join(' ');
  };

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
        <View className={getFieldClassName('account', account.trim().length > 0)}>
          <View className="login-page__field-icon">
            <View className="login-page__field-symbol login-page__field-symbol--user" />
          </View>
          <View className="login-page__field-body">
            <Text className="login-page__label">账号</Text>
            <Input
              className="login-page__input"
              value={account}
              placeholder="请输入账号"
              placeholderStyle="color: #a8abb2;"
              cursorColor="#07c160"
              confirmType="next"
              onFocus={() => setFocusedField('account')}
              onBlur={() => setFocusedField(null)}
              onInput={event => setAccount(getInputValue(event))}
            />
          </View>
          <View
            className={`login-page__field-action ${
              account ? '' : 'login-page__field-action--hidden'
            }`}
            hoverClass="login-page__field-action--hover"
            onClick={() => setAccount('')}
          >
            <View className="login-page__clear-icon" />
          </View>
        </View>

        <View className={getFieldClassName('password', password.length > 0)}>
          <View className="login-page__field-icon">
            <View className="login-page__field-symbol login-page__field-symbol--lock" />
          </View>
          <View className="login-page__field-body">
            <Text className="login-page__label">密码</Text>
            <Input
              className="login-page__input"
              value={password}
              password={!passwordVisible}
              placeholder="请输入密码"
              placeholderStyle="color: #a8abb2;"
              cursorColor="#07c160"
              confirmType="done"
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              onInput={event => setPassword(getInputValue(event))}
              onConfirm={handleLogin}
            />
          </View>
          <View
            className="login-page__field-action"
            hoverClass="login-page__field-action--hover"
            onClick={() => setPasswordVisible(visible => !visible)}
          >
            <View
              className={`login-page__eye-icon ${
                passwordVisible ? 'login-page__eye-icon--open' : ''
              }`}
            />
          </View>
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
