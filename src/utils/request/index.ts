import Taro from '@tarojs/taro';
import { authManager } from '@/utils/AuthManager';
import { RequestClient, RequestError } from './RequestClient';
import {
  DEFAULT_AUTH_EXPIRED_CODES,
  DEFAULT_ERROR_CODES,
  DEFAULT_ERROR_MESSAGE,
  DEFAULT_REQUEST_TIMEOUT,
  DEFAULT_SUCCESS_CODES,
  DEFAULT_TIMEOUT_MESSAGE,
  DEFAULT_TOKEN_HEADER_KEY,
  DEFAULT_TOKEN_PREFIX,
} from './constants';

const request = new RequestClient({
  baseUrl: process.env.TARO_APP_API_BASE_URL || '/api',
  timeout: DEFAULT_REQUEST_TIMEOUT,
  successCodes: DEFAULT_SUCCESS_CODES,
  errorCodes: DEFAULT_ERROR_CODES,
  showError: true,
  getToken: () => authManager.getToken(),
  authExpiredCodes: DEFAULT_AUTH_EXPIRED_CODES,
  tokenHeaderKey: DEFAULT_TOKEN_HEADER_KEY,
  tokenPrefix: DEFAULT_TOKEN_PREFIX,
  showToast: options => {
    void Taro.showToast({
      icon: options.icon || 'none',
      title: options.title,
      duration: options.duration || 2000,
    });
  },
  onAuthExpired: () => authManager.handleAuthExpired(),
  errorMessage: DEFAULT_ERROR_MESSAGE,
  timeoutMessage: DEFAULT_TIMEOUT_MESSAGE,
});

export const configureRequest = request.configure.bind(request);

export const getRequestConfig = request.getConfig.bind(request);

export const get = request.get.bind(request);

export const post = request.post.bind(request);

export const put = request.put.bind(request);

export const patch = request.patch.bind(request);

export const del = request.del.bind(request);

export { RequestClient, RequestError };

export type {
  RequestAuthExpiredError,
  RequestClientOptions,
  RequestCode,
  RequestErrorOptions,
  RequestHeader,
  RequestMethod,
  RequestOptions,
  RequestResult,
  RequestToastOptions,
  StandardResponse,
} from './types';

export default request;
