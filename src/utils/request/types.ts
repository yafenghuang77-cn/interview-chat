import type { RequestError } from './RequestClient';

/** 后端业务 code 兼容数字和字符串两种形式。 */
export type RequestCode = string | number;

export type RequestMethod = NonNullable<Taro.request.Option['method']>;

export type RequestHeaders = Record<string, string | number | boolean>;

/** 所有接口统一转换成的前端响应格式。 */
export interface StandardResponse<T = unknown> {
  /** 实际 HTTP status。 */
  statusCode: number;
  /** HTTP status 和业务 code 均成功时为 true。 */
  success: boolean;
  /** 后端业务 code；非标准响应使用 HTTP status 兜底。 */
  code: RequestCode;
  message: string;
  data: T;
}

/** 用于区分业务、HTTP、网络、解析和超时错误。 */
export type RequestErrorType = 'business' | 'http' | 'network' | 'parse' | 'timeout';

export interface RequestErrorOptions<T = unknown> {
  type: RequestErrorType;
  code: RequestCode;
  statusCode?: number;
  response?: StandardResponse<T>;
  configuredError?: boolean;
  originalError?: unknown;
}

/** 自动携带 token 时使用的读取方式和请求头格式。 */
export interface TokenConfig {
  getToken: () => string | null | undefined | Promise<string | null | undefined>;
  headerName: string;
  prefix?: string;
}

/** 创建 RequestClient 时传入的全局配置。 */
export interface RequestClientConfig {
  baseUrl?: string | (() => string);
  timeout: number;
  /** 业务成功、失败和 token 过期 code，均支持配置多个值。 */
  successCodes: RequestCode[];
  errorCodes: RequestCode[];
  tokenExpiredCodes: RequestCode[];
  /** HTTP 成功和 token 过期 status，均支持配置多个值。 */
  successStatusCodes: number[];
  tokenExpiredStatusCodes: number[];
  networkErrorCode: RequestCode;
  timeoutErrorCode: RequestCode;
  parseErrorCode: RequestCode;
  defaultErrorMessage: string;
  networkErrorMessage: string;
  timeoutErrorMessage: string;
  parseErrorMessage: string;
  defaultHeaders?: RequestHeaders;
  token?: TokenConfig;
  /** token 失效时触发，通常用于清理登录态并跳转登录页。 */
  onTokenExpired?: (error: RequestError) => void | Promise<void>;
  /** 统一错误展示入口。 */
  showError?: (message: string, error: RequestError) => void | Promise<void>;
}

/** 单次请求配置；传入的 code/status 数组会覆盖全局配置。 */
export interface RequestOptions {
  url: string;
  method?: RequestMethod;
  data?: unknown;
  header?: RequestHeaders;
  headers?: RequestHeaders;
  timeout?: number;
  /** false 时不读取和携带 token，适用于登录等公开接口。 */
  withToken?: boolean;
  /** false 时关闭本次请求的自动错误 Toast。 */
  showError?: boolean;
  /** true 返回 StandardResponse，默认仅返回 data。 */
  returnStandardResponse?: boolean;
  successCodes?: RequestCode[];
  errorCodes?: RequestCode[];
  tokenExpiredCodes?: RequestCode[];
  successStatusCodes?: number[];
  tokenExpiredStatusCodes?: number[];
}

export interface StandardResponseRequestOptions extends RequestOptions {
  returnStandardResponse: true;
}

/** 通过重载让 returnStandardResponse: true 获得准确的返回类型。 */
export interface RequestFunction {
  <T = unknown>(options: StandardResponseRequestOptions): Promise<StandardResponse<T>>;
  <T = unknown>(options: RequestOptions): Promise<T>;
}
