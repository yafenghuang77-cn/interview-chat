import Taro from '@tarojs/taro';
import type {
  RequestAuthExpiredError,
  RequestClientOptions,
  RequestCode,
  RequestErrorOptions,
  RequestHeader,
  RequestOptions,
  RequestResult,
  StandardResponse,
} from './types';

export class RequestError<T = unknown> extends Error {
  type: RequestErrorOptions<T>['type'];

  code?: RequestCode;

  response?: StandardResponse<T>;

  statusCode?: number;

  originalError?: unknown;

  constructor(options: RequestErrorOptions<T>) {
    super(options.message);
    this.name = 'RequestError';
    this.type = options.type;
    this.code = options.code;
    this.response = options.response;
    this.statusCode = options.statusCode;
    this.originalError = options.originalError;
  }
}

const isCodeIncluded = (code: RequestCode, codes: RequestCode[]): boolean => {
  return codes.some(item => String(item) === String(code));
};

const joinUrl = (baseUrl: string, url: string): string => {
  if (/^https?:\/\//i.test(url) || !baseUrl) {
    return url;
  }

  return `${baseUrl.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
};

const isTimeoutError = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const errMsg = 'errMsg' in error ? String((error as { errMsg?: unknown }).errMsg) : '';

  return /timeout/i.test(errMsg);
};

const createRequestError = <T>(options: RequestErrorOptions<T>): RequestError<T> => {
  return new RequestError<T>(options);
};

const isStandardResponse = <T>(response: unknown): response is StandardResponse<T> => {
  return Boolean(
    response &&
      typeof response === 'object' &&
      'code' in response &&
      'data' in response &&
      'message' in response,
  );
};

export class RequestClient {
  private config: RequestClientOptions;

  constructor(config: RequestClientOptions) {
    this.config = this.cloneConfig(config);
  }

  configure(config: Partial<RequestClientOptions>): RequestClientOptions {
    this.config = this.cloneConfig({
      ...this.config,
      ...config,
    });

    return this.getConfig();
  }

  getConfig(): RequestClientOptions {
    return this.cloneConfig(this.config);
  }

  async request<
    TResponseData = unknown,
    TRequestData extends string | TaroGeneral.IAnyObject | ArrayBuffer =
      | string
      | TaroGeneral.IAnyObject
      | ArrayBuffer,
    TReturnStandard extends boolean = false,
  >(
    options: RequestOptions<TResponseData, TRequestData, TReturnStandard>,
  ): Promise<RequestResult<TResponseData, TReturnStandard>> {
    const { returnStandard, showError, showErrorToast, url } = options;
    const toastEnabled = this.shouldShowToast(showError, showErrorToast);
    const successCodes = this.getSuccessCodes(options);
    const errorCodes = this.getErrorCodes(options);
    const authExpiredCodes = this.getAuthExpiredCodes(options);

    try {
      const result = await Taro.request<StandardResponse<TResponseData>, TRequestData>({
        ...this.stripRequestOptions(options),
        url: joinUrl(this.config.baseUrl || '', url),
        timeout: options.timeout ?? this.config.timeout,
        header: this.buildHeader(options),
      });
      const response = result.data;

      if (isCodeIncluded(result.statusCode, authExpiredCodes)) {
        this.handleAuthExpired(response, result.statusCode, toastEnabled);
      }

      if (result.statusCode < 200 || result.statusCode >= 300) {
        const errorMessage = isStandardResponse<TResponseData>(response)
          ? response.message
          : `请求失败：${result.statusCode}`;

        this.showErrorToast(errorMessage, toastEnabled);
        throw createRequestError<TResponseData>({
          type: 'http',
          message: errorMessage,
          response: isStandardResponse<TResponseData>(response) ? response : undefined,
          statusCode: result.statusCode,
        });
      }

      if (!isStandardResponse<TResponseData>(response)) {
        this.showErrorToast(this.getDefaultErrorMessage(), toastEnabled);
        throw createRequestError<TResponseData>({
          type: 'business',
          message: this.getDefaultErrorMessage(),
          statusCode: result.statusCode,
        });
      }

      if (isCodeIncluded(response.code, successCodes)) {
        return (returnStandard ? response : response.data) as RequestResult<
          TResponseData,
          TReturnStandard
        >;
      }

      if (isCodeIncluded(response.code, authExpiredCodes)) {
        this.handleAuthExpired(response, result.statusCode, toastEnabled);
      }

      const errorMessage = response.message || this.getDefaultErrorMessage();

      this.showErrorToast(errorMessage, toastEnabled || isCodeIncluded(response.code, errorCodes));
      throw createRequestError<TResponseData>({
        type: 'business',
        message: errorMessage,
        code: response.code,
        response,
        statusCode: result.statusCode,
      });
    } catch (error) {
      if (error instanceof RequestError) {
        throw error;
      }

      const timeout = isTimeoutError(error);
      const errorMessage = timeout ? this.config.timeoutMessage : this.config.errorMessage;

      this.showErrorToast(errorMessage, toastEnabled);
      throw createRequestError({
        type: timeout ? 'timeout' : 'network',
        message: errorMessage,
        originalError: error,
      });
    }
  }

  get<
    TResponseData = unknown,
    TRequestData extends string | TaroGeneral.IAnyObject | ArrayBuffer =
      | string
      | TaroGeneral.IAnyObject
      | ArrayBuffer,
    TReturnStandard extends boolean = false,
  >(
    options: RequestOptions<TResponseData, TRequestData, TReturnStandard>,
  ): Promise<RequestResult<TResponseData, TReturnStandard>> {
    return this.request<TResponseData, TRequestData, TReturnStandard>({
      ...options,
      method: 'GET',
    });
  }

  post<
    TResponseData = unknown,
    TRequestData extends string | TaroGeneral.IAnyObject | ArrayBuffer =
      | string
      | TaroGeneral.IAnyObject
      | ArrayBuffer,
    TReturnStandard extends boolean = false,
  >(
    options: RequestOptions<TResponseData, TRequestData, TReturnStandard>,
  ): Promise<RequestResult<TResponseData, TReturnStandard>> {
    return this.request<TResponseData, TRequestData, TReturnStandard>({
      ...options,
      method: 'POST',
    });
  }

  put<
    TResponseData = unknown,
    TRequestData extends string | TaroGeneral.IAnyObject | ArrayBuffer =
      | string
      | TaroGeneral.IAnyObject
      | ArrayBuffer,
    TReturnStandard extends boolean = false,
  >(
    options: RequestOptions<TResponseData, TRequestData, TReturnStandard>,
  ): Promise<RequestResult<TResponseData, TReturnStandard>> {
    return this.request<TResponseData, TRequestData, TReturnStandard>({
      ...options,
      method: 'PUT',
    });
  }

  patch<
    TResponseData = unknown,
    TRequestData extends string | TaroGeneral.IAnyObject | ArrayBuffer =
      | string
      | TaroGeneral.IAnyObject
      | ArrayBuffer,
    TReturnStandard extends boolean = false,
  >(
    options: RequestOptions<TResponseData, TRequestData, TReturnStandard>,
  ): Promise<RequestResult<TResponseData, TReturnStandard>> {
    return this.request<TResponseData, TRequestData, TReturnStandard>({
      ...options,
      method: 'PATCH',
    });
  }

  del<
    TResponseData = unknown,
    TRequestData extends string | TaroGeneral.IAnyObject | ArrayBuffer =
      | string
      | TaroGeneral.IAnyObject
      | ArrayBuffer,
    TReturnStandard extends boolean = false,
  >(
    options: RequestOptions<TResponseData, TRequestData, TReturnStandard>,
  ): Promise<RequestResult<TResponseData, TReturnStandard>> {
    return this.request<TResponseData, TRequestData, TReturnStandard>({
      ...options,
      method: 'DELETE',
    });
  }

  private getSuccessCodes<
    TResponseData,
    TRequestData extends string | TaroGeneral.IAnyObject | ArrayBuffer,
    TReturnStandard extends boolean,
  >(options: RequestOptions<TResponseData, TRequestData, TReturnStandard>): RequestCode[] {
    return options.successCodes ?? this.config.successCodes;
  }

  private getErrorCodes<
    TResponseData,
    TRequestData extends string | TaroGeneral.IAnyObject | ArrayBuffer,
    TReturnStandard extends boolean,
  >(options: RequestOptions<TResponseData, TRequestData, TReturnStandard>): RequestCode[] {
    return options.errorCodes ?? this.config.errorCodes;
  }

  private getAuthExpiredCodes<
    TResponseData,
    TRequestData extends string | TaroGeneral.IAnyObject | ArrayBuffer,
    TReturnStandard extends boolean,
  >(options: RequestOptions<TResponseData, TRequestData, TReturnStandard>): RequestCode[] {
    return options.authExpiredCodes ?? this.config.authExpiredCodes;
  }

  private shouldShowToast(showError?: boolean, showErrorToast?: boolean): boolean {
    return showError ?? showErrorToast ?? this.config.showError ?? this.config.showErrorToast;
  }

  private getDefaultErrorMessage(): string {
    return this.config.errorMessage;
  }

  private showErrorToast(message: string, enabled: boolean): void {
    if (!enabled) {
      return;
    }

    this.config.showToast({
      title: message,
      icon: 'none',
    });
  }

  private handleAuthExpired<T>(
    response: StandardResponse<T> | unknown,
    statusCode: number,
    toastEnabled: boolean,
  ): never {
    const standardResponse = isStandardResponse<T>(response) ? response : undefined;
    const error = createRequestError<T>({
      type: 'token',
      message: standardResponse?.message || this.getDefaultErrorMessage(),
      code: standardResponse?.code,
      response: standardResponse,
      statusCode,
    });
    const authExpiredError = error as RequestAuthExpiredError<T>;

    this.showErrorToast(error.message, toastEnabled);
    this.config.onAuthExpired?.(authExpiredError);
    this.config.onTokenInvalid?.(authExpiredError);
    throw error;
  }

  private getToken<
    TResponseData,
    TRequestData extends string | TaroGeneral.IAnyObject | ArrayBuffer,
    TReturnStandard extends boolean,
  >(options: RequestOptions<TResponseData, TRequestData, TReturnStandard>): string | null {
    if (options.skipToken) {
      return null;
    }

    return options.token || this.config.getToken?.() || null;
  }

  private getAuthorizationValue(token: string): string {
    if (!this.config.tokenPrefix) {
      return token;
    }

    return `${this.config.tokenPrefix} ${token}`;
  }

  private buildHeader<
    TResponseData,
    TRequestData extends string | TaroGeneral.IAnyObject | ArrayBuffer,
    TReturnStandard extends boolean,
  >(options: RequestOptions<TResponseData, TRequestData, TReturnStandard>): RequestHeader {
    const token = this.getToken(options);
    const header: RequestHeader = {
      ...(options.header || {}),
    };
    const { tokenHeaderKey } = this.config;

    if (token && !header[tokenHeaderKey]) {
      header[tokenHeaderKey] = this.getAuthorizationValue(token);
    }

    return header;
  }

  private stripRequestOptions<
    TResponseData,
    TRequestData extends string | TaroGeneral.IAnyObject | ArrayBuffer,
    TReturnStandard extends boolean,
  >(
    options: RequestOptions<TResponseData, TRequestData, TReturnStandard>,
  ): Taro.request.Option<StandardResponse<TResponseData>, TRequestData> {
    const taroOptions = {
      ...options,
    };

    delete taroOptions.returnStandard;
    delete taroOptions.showError;
    delete taroOptions.showErrorToast;
    delete taroOptions.successCodes;
    delete taroOptions.errorCodes;
    delete taroOptions.authExpiredCodes;
    delete taroOptions.skipToken;
    delete taroOptions.token;

    return taroOptions;
  }

  private cloneConfig(config: RequestClientOptions): RequestClientOptions {
    return {
      ...config,
      successCodes: [...config.successCodes],
      errorCodes: [...config.errorCodes],
      authExpiredCodes: [...config.authExpiredCodes],
    };
  }
}

export default RequestClient;
