import Taro from '@tarojs/taro';

import type {
  RequestClientConfig,
  RequestCode,
  RequestErrorOptions,
  RequestHeaders,
  RequestOptions,
  StandardResponse,
} from './types';

type UnknownRecord = Record<string, unknown>;

/** 请求失败时抛出的统一错误，可根据 type/code/statusCode 做定向处理。 */
export class RequestError<T = unknown> extends Error {
  type: RequestErrorOptions<T>['type'];

  code: RequestCode;

  statusCode: number;

  response?: StandardResponse<T>;

  configuredError: boolean;

  originalError?: unknown;

  constructor(message: string, options: RequestErrorOptions<T>) {
    super(message);
    this.name = 'RequestError';
    this.type = options.type;
    this.code = options.code;
    this.statusCode = options.statusCode || 0;
    this.response = options.response;
    this.configuredError = Boolean(options.configuredError);
    this.originalError = options.originalError;
    Object.setPrototypeOf(this, RequestError.prototype);
  }
}

const isRecord = (value: unknown): value is UnknownRecord => {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
};

const includesCode = (codes: RequestCode[], code: RequestCode): boolean => {
  return codes.some(item => String(item) === String(code));
};

const joinUrl = (baseUrl: string, url: string): string => {
  if (/^https?:\/\//i.test(url) || !baseUrl) {
    return url;
  }

  return `${baseUrl.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
};

const getResponseMessage = (payload: UnknownRecord, fallback: string): string => {
  const message = payload.message || payload.msg || payload.messsage;

  return typeof message === 'string' && message.trim() ? message : fallback;
};

export class RequestClient {
  private config: RequestClientConfig;

  constructor(config: RequestClientConfig) {
    this.config = this.cloneConfig(config);
  }

  /** 更新全局配置，适合运行时切换 baseUrl 或业务 code。 */
  configure(config: Partial<RequestClientConfig>): RequestClientConfig {
    this.config = this.cloneConfig({ ...this.config, ...config });

    return this.getConfig();
  }

  /** 返回配置副本，避免调用方直接修改客户端内部状态。 */
  getConfig(): RequestClientConfig {
    return this.cloneConfig(this.config);
  }

  /**
   * 发起请求并统一处理响应、业务 code、token 过期和错误提示。
   * 默认只返回 data，returnStandardResponse 为 true 时返回完整标准响应。
   */
  async request<T = unknown>(options: RequestOptions): Promise<T | StandardResponse<T>> {
    const withToken = options.withToken !== false;

    try {
      const response = await Taro.request<unknown>({
        url: joinUrl(this.getBaseUrl(options), options.url),
        method: options.method || 'GET',
        data: options.data as TaroGeneral.IAnyObject,
        header: await this.getHeaders(options, withToken),
        timeout: options.timeout ?? this.config.timeout,
      });
      const payload = this.parseResponseData(response.data, response.statusCode);
      const standardResponse = this.normalizeResponse<T>(payload, response.statusCode);

      // 单次请求配置优先于全局配置，便于兼容少量特殊接口。
      const successCodes = options.successCodes || this.config.successCodes;
      const errorCodes = options.errorCodes || this.config.errorCodes;
      const successStatusCodes = options.successStatusCodes || this.config.successStatusCodes;
      const isStatusSuccess = successStatusCodes.includes(response.statusCode);
      const isBusinessSuccess = includesCode(successCodes, standardResponse.code);

      if (!isStatusSuccess || !isBusinessSuccess) {
        const errorMessage = standardResponse.message || this.config.defaultErrorMessage;

        standardResponse.message = errorMessage;
        throw new RequestError<T>(errorMessage, {
          type: isStatusSuccess ? 'business' : 'http',
          code: standardResponse.code,
          statusCode: response.statusCode,
          response: standardResponse,
          configuredError: includesCode(errorCodes, standardResponse.code),
        });
      }

      standardResponse.success = true;

      return options.returnStandardResponse ? standardResponse : standardResponse.data;
    } catch (error) {
      const requestError = this.toRequestError(error);

      // token 过期处理只对需要登录态的请求生效。
      if (this.isTokenExpired(requestError, options, withToken)) {
        await this.config.onTokenExpired?.(requestError);
      }

      if (options.showError !== false) {
        await this.config.showError?.(requestError.message, requestError);
      }

      throw requestError;
    }
  }

  /** 单次请求可覆盖全局基础 URL，适用于调用其他后端。 */
  private getBaseUrl(options: RequestOptions): string {
    if (options.baseUrl !== undefined) {
      return options.baseUrl;
    }

    return typeof this.config.baseUrl === 'function'
      ? this.config.baseUrl()
      : this.config.baseUrl || '';
  }

  /** 合并默认头和请求头，并在未手动设置时自动注入 token。 */
  private async getHeaders(options: RequestOptions, withToken: boolean): Promise<RequestHeaders> {
    const headers: RequestHeaders = {
      ...(this.config.defaultHeaders || {}),
      ...(options.headers || {}),
      ...(options.header || {}),
    };

    if (!withToken || !this.config.token) {
      return headers;
    }

    const token = await this.config.token.getToken();

    if (!token) {
      return headers;
    }

    const { headerName, prefix } = this.config.token;
    const alreadyConfigured = Object.keys(headers).some(
      key => key.toLowerCase() === headerName.toLowerCase(),
    );

    if (!alreadyConfigured) {
      headers[headerName] = prefix?.trim() ? `${prefix.trim()} ${token}` : token;
    }

    return headers;
  }

  /** 兼容 H5 返回字符串 JSON 的情况，并将解析失败转成统一错误。 */
  private parseResponseData(data: unknown, statusCode: number): unknown {
    if (typeof data !== 'string') {
      return data;
    }

    if (!data.trim()) {
      return null;
    }

    try {
      return JSON.parse(data) as unknown;
    } catch (error) {
      throw new RequestError(this.config.parseErrorMessage, {
        type: 'parse',
        code: this.config.parseErrorCode,
        statusCode,
        originalError: error,
      });
    }
  }

  /**
   * 将标准后端响应和直接返回数据的接口统一为 StandardResponse。
   * 非标准响应使用 HTTP status 作为业务 code。
   */
  private normalizeResponse<T>(payload: unknown, statusCode: number): StandardResponse<T> {
    if (!isRecord(payload)) {
      return {
        statusCode,
        success: false,
        code: statusCode,
        message: '',
        data: payload as T,
      };
    }

    const hasStandardFields = 'code' in payload || 'data' in payload;
    const code = ('code' in payload ? payload.code : statusCode) as RequestCode;
    const data = (hasStandardFields && 'data' in payload ? payload.data : payload) as T;

    return {
      statusCode,
      success: false,
      code,
      message: getResponseMessage(payload, ''),
      data,
    };
  }

  /** 将 Taro 网络错误和超时错误转换为 RequestError。 */
  private toRequestError(error: unknown): RequestError {
    if (error instanceof RequestError) {
      return error;
    }

    const errorRecord = isRecord(error) ? error : {};
    const errorMessage = typeof errorRecord.errMsg === 'string' ? errorRecord.errMsg : '';
    const timeout = /timeout/i.test(errorMessage);

    return new RequestError(
      timeout ? this.config.timeoutErrorMessage : this.config.networkErrorMessage,
      {
        type: timeout ? 'timeout' : 'network',
        code: timeout ? this.config.timeoutErrorCode : this.config.networkErrorCode,
        originalError: error,
      },
    );
  }

  /** 同时检查业务 code 与 HTTP status 是否表示 token 失效。 */
  private isTokenExpired(
    error: RequestError,
    options: RequestOptions,
    withToken: boolean,
  ): boolean {
    if (!withToken) {
      return false;
    }

    const tokenExpiredCodes = options.tokenExpiredCodes || this.config.tokenExpiredCodes;
    const tokenExpiredStatusCodes =
      options.tokenExpiredStatusCodes || this.config.tokenExpiredStatusCodes;

    return (
      includesCode(tokenExpiredCodes, error.code) ||
      tokenExpiredStatusCodes.includes(error.statusCode)
    );
  }

  /** 深拷贝可变配置，防止外部数组或对象影响客户端内部状态。 */
  private cloneConfig(config: RequestClientConfig): RequestClientConfig {
    return {
      ...config,
      successCodes: [...config.successCodes],
      errorCodes: [...config.errorCodes],
      tokenExpiredCodes: [...config.tokenExpiredCodes],
      successStatusCodes: [...config.successStatusCodes],
      tokenExpiredStatusCodes: [...config.tokenExpiredStatusCodes],
      defaultHeaders: { ...(config.defaultHeaders || {}) },
      token: config.token ? { ...config.token } : undefined,
    };
  }
}

export default RequestClient;
