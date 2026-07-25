import Taro from '@tarojs/taro';
import { storageManager } from '@/utils/StorageManager';
import { DEFAULT_LOGIN_URL, DEFAULT_TOKEN_KEY } from '@/utils/request/constants';
import { AuthManager } from './AuthManager';

const getCurrentUrl = (): string => {
  const pages = Taro.getCurrentPages();
  const currentPage = pages[pages.length - 1];

  if (!currentPage) {
    return '';
  }

  const route = currentPage.route || '';
  const options = (currentPage as { options?: Record<string, string | undefined> }).options || {};
  const query = Object.entries(options)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join('&');
  const pathname = route.startsWith('/') ? route : `/${route}`;

  return query ? `${pathname}?${query}` : pathname;
};

export const authManager = AuthManager.getInstance({
  loginUrl: DEFAULT_LOGIN_URL,
  publicPages: [DEFAULT_LOGIN_URL],
  getToken: () => storageManager.get<string>(DEFAULT_TOKEN_KEY),
  setToken: token => storageManager.set(DEFAULT_TOKEN_KEY, token),
  clearToken: () => storageManager.remove(DEFAULT_TOKEN_KEY),
  getCurrentUrl,
  redirectToLogin: url => {
    void Taro.reLaunch({
      url,
    });
  },
});

export const configureAuth = authManager.configure.bind(authManager);

export const checkAuth = authManager.guard.bind(authManager);

export const getAuthToken = authManager.getToken.bind(authManager);

export const setAuthToken = authManager.setToken.bind(authManager);

export const clearAuthToken = authManager.clearToken.bind(authManager);

export { AuthManager };

export type { AuthGuardOptions, AuthManagerOptions } from './AuthManager';

export default authManager;
