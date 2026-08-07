import Taro from '@tarojs/taro';

import storageManager from '@/utils/StorageManager';

import {
  REQUEST_BASE_URL,
  REQUEST_DEFAULT_ERROR_MESSAGE,
  REQUEST_ERROR_CODES,
  REQUEST_NETWORK_ERROR_CODE,
  REQUEST_NETWORK_ERROR_MESSAGE,
  REQUEST_PARSE_ERROR_CODE,
  REQUEST_PARSE_ERROR_MESSAGE,
  REQUEST_SUCCESS_CODES,
  REQUEST_SUCCESS_STATUS_CODES,
  REQUEST_TIMEOUT,
  REQUEST_TIMEOUT_ERROR_CODE,
  REQUEST_TIMEOUT_ERROR_MESSAGE,
  REQUEST_TOKEN_EXPIRED_CODES,
  REQUEST_TOKEN_EXPIRED_STATUS_CODES,
  TOKEN_HEADER_NAME,
  TOKEN_HEADER_PREFIX,
  TOKEN_STORAGE_KEY,
} from './constants';
import RequestClient, { RequestError } from './RequestClient';
import type { RequestClientConfig, RequestFunction } from './types';

export type TokenExpiredHandler = (error: RequestError) => void | Promise<void>;

let tokenExpiredHandler: TokenExpiredHandler | null = null;

/** 读取当前 token，不存在时返回 null。 */
export const getToken = (): string | null => {
  const token = storageManager.get<string>(TOKEN_STORAGE_KEY);

  if (token) {
    return token;
  }

  // 兼容请求层接入 StorageManager 前直接写入的无命名空间 token，并在首次读取时完成迁移。
  const legacyToken = Taro.getStorageSync<string>(TOKEN_STORAGE_KEY) || null;

  if (legacyToken) {
    storageManager.set(TOKEN_STORAGE_KEY, legacyToken);
    Taro.removeStorageSync(TOKEN_STORAGE_KEY);
  }

  return legacyToken;
};

/** 登录成功后保存 token。 */
export const setToken = (token: string, expiresIn?: number | string | null): void => {
  storageManager.setStorageSync(TOKEN_STORAGE_KEY, token, expiresIn);
  Taro.removeStorageSync(TOKEN_STORAGE_KEY);
};

/** 退出登录或 token 失效时删除本地 token。 */
export const removeToken = (): void => {
  storageManager.remove(TOKEN_STORAGE_KEY);
  Taro.removeStorageSync(TOKEN_STORAGE_KEY);
};

/** 注册业务侧的 token 过期处理；传 null 可取消注册。 */
export const setTokenExpiredHandler = (handler: TokenExpiredHandler | null): void => {
  tokenExpiredHandler = handler;
};

/** token 失效时先清理本地 token，再执行业务侧回调。 */
export const handleTokenExpired = async (error: RequestError): Promise<void> => {
  removeToken();
  await tokenExpiredHandler?.(error);
};

/** 当前项目的请求客户端配置，code/status/token 均从公共常量读取。 */
export const requestConfig: RequestClientConfig = {
  // 所有相对路径接口都会拼接默认 URL；单次请求可通过 baseUrl 调用其他后端。
  baseUrl: REQUEST_BASE_URL,
  timeout: REQUEST_TIMEOUT,

  // 业务 code 来自响应体。只有 successCodes 中的值会被当作成功；其他值都会抛出 RequestError。
  // errorCodes 用于标记项目已知的失败 code，错误对象的 configuredError 会同步设为 true。
  successCodes: [...REQUEST_SUCCESS_CODES],
  errorCodes: [...REQUEST_ERROR_CODES],

  // tokenExpiredCodes 同样读取响应体，匹配后会进入统一的 token 过期处理流程。
  tokenExpiredCodes: [...REQUEST_TOKEN_EXPIRED_CODES],

  // statusCodes 读取真实 HTTP status，与响应体中的业务 code 分开判断，两者都成功请求才成功。
  // 401/403 等 token 过期 status 会触发 onTokenExpired。
  successStatusCodes: [...REQUEST_SUCCESS_STATUS_CODES],
  tokenExpiredStatusCodes: [...REQUEST_TOKEN_EXPIRED_STATUS_CODES],

  // 网络中断、超时和非法响应没有后端业务 code，由前端生成独立 code，方便上层区分错误类型。
  networkErrorCode: REQUEST_NETWORK_ERROR_CODE,
  timeoutErrorCode: REQUEST_TIMEOUT_ERROR_CODE,
  parseErrorCode: REQUEST_PARSE_ERROR_CODE,

  // 后端未返回有效错误文案时使用以下兜底提示。
  defaultErrorMessage: REQUEST_DEFAULT_ERROR_MESSAGE,
  networkErrorMessage: REQUEST_NETWORK_ERROR_MESSAGE,
  timeoutErrorMessage: REQUEST_TIMEOUT_ERROR_MESSAGE,
  parseErrorMessage: REQUEST_PARSE_ERROR_MESSAGE,

  // 单次请求传入的 header/headers 会与默认请求头合并，并拥有更高优先级。
  defaultHeaders: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    // clientInfo: {
    //   client_key: 'kbaptkJGtByWrQaP',
    //   client_sec: 'jkJrRIacBwcpK68d',
    // },
  },

  // withToken 默认为 true。存在 token 且调用方未手动设置同名请求头时，自动注入：
  // Authorization: Bearer <token>。登录等公开接口应显式传 withToken: false。
  token: {
    getToken,
    headerName: TOKEN_HEADER_NAME,
    prefix: TOKEN_HEADER_PREFIX,
  },

  // token 过期时先由 handleTokenExpired 删除本地 token，再执行 setTokenExpiredHandler 注册的业务回调。
  onTokenExpired: handleTokenExpired,

  // 所有请求错误默认在这里统一展示红色 error Toast；单次请求可用 showError: false 关闭。
  showError: message => {
    void Taro.showToast({
      title: message,
      icon: 'error',
      duration: 2500,
    });
  },
};

export const requestClient = new RequestClient(requestConfig);

/** 运行时覆盖请求客户端配置。 */
export const configureRequest = requestClient.configure.bind(requestClient);

export const getRequestConfig = requestClient.getConfig.bind(requestClient);

/** 项目统一请求函数，类型重载定义在 RequestFunction。 */
export const request = requestClient.request.bind(requestClient) as RequestFunction;

export { RequestClient, RequestError };

export type {
  RequestClientConfig,
  RequestCode,
  RequestErrorOptions,
  RequestErrorType,
  RequestFunction,
  RequestHeaders,
  RequestMethod,
  RequestOptions,
  StandardResponse,
  StandardResponseRequestOptions,
  TokenConfig,
} from './types';

export default request;
