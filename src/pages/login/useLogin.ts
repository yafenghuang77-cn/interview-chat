import { useState } from 'react';
import Taro, { useRouter } from '@tarojs/taro';
import { setToken } from '@/utils/request';

import { login } from '../../api/userApi';

const DEFAULT_PROJECT_ID = 104;

const getProjectId = (value: unknown): number => {
  const projectId = Number(Array.isArray(value) ? value[0] : value);
  return Number.isSafeInteger(projectId) && projectId > 0 ? projectId : DEFAULT_PROJECT_ID;
};

const useLogin = () => {
  const router = useRouter();
  const params = (router.params || {}) as Record<string, unknown>;
  const projectId = getProjectId(params.projectId);
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const handelAccount = (payload: string) => {
    setAccount(payload);
  };

  const handelVerificationCode = (payload: string) => {
    setVerificationCode(payload);
  };

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

    try {
      setLoading(true);
      const result = await login({
        projectId,
        userCode: 'A00003472',
        verificationCode: '7ECEC0',
        // userCode: account.trim(),
        // verificationCode: verificationCode.trim(),
      });

      const token = result.token || result.accessToken;

      if (token) {
        setToken(token, result.expiresIn);
        Taro.navigateTo({
          url: `/pages/index/index?projectId=${projectId}`,
        });
      }
    } catch {
      return;
    } finally {
      setLoading(false);
    }
  };

  return { account, verificationCode, loading, handleLogin, handelAccount, handelVerificationCode };
};

export default useLogin;
