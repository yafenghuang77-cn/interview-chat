import type Taro from '@tarojs/taro';

export type RequestCode = string | number;

export type RequestMethod = NonNullable<Taro.request.Option['method']>;

export type RequestHeader = Record<string, string | number | boolean>;

export type StandardResponse<T = unknown> = {
  code: RequestCode;
  data: T;
  message: string;
};

export type RequestErrorType = 'business' | 'http' | 'network' | 'timeout' | 'token';

export type RequestToastOptions = {
  title: string;
  icon?: 'success' | 'error' | 'loading' | 'none';
  duration?: number;
};

export type RequestErrorOptions<T = unknown> = {
  type: RequestErrorType;
  message: string;
  code?: RequestCode;
  response?: StandardResponse<T>;
  statusCode?: number;
  originalError?: unknown;
};

export type RequestAuthExpiredError<T = unknown> = RequestErrorOptions<T> & {
  name: string;
  message: string;
};

export type RequestClientOptions = {
  baseUrl?: string;
  timeout: number;
  successCodes: RequestCode[];
  errorCodes: RequestCode[];
  authExpiredCodes: RequestCode[];
  tokenHeaderKey: string;
  tokenPrefix?: string;
  showError: boolean;
  showErrorToast?: boolean;
  errorMessage: string;
  timeoutMessage: string;
  getToken?: () => string | null | undefined;
  onAuthExpired?: (error: RequestAuthExpiredError) => void;
  onTokenInvalid?: (error: RequestAuthExpiredError) => void;
  showToast: (options: RequestToastOptions) => void;
};

export type RequestOptions<
  TResponseData = unknown,
  TRequestData extends string | TaroGeneral.IAnyObject | ArrayBuffer =
    | string
    | TaroGeneral.IAnyObject
    | ArrayBuffer,
  TReturnStandard extends boolean = false,
> = Omit<
  Taro.request.Option<StandardResponse<TResponseData>, TRequestData>,
  'success' | 'fail' | 'complete' | 'timeout' | 'header'
> & {
  header?: RequestHeader;
  timeout?: number;
  returnStandard?: TReturnStandard;
  showError?: boolean;
  showErrorToast?: boolean;
  successCodes?: RequestCode[];
  errorCodes?: RequestCode[];
  authExpiredCodes?: RequestCode[];
  skipToken?: boolean;
  token?: string;
};

export type RequestResult<TResponseData, TReturnStandard extends boolean> =
  TReturnStandard extends true ? StandardResponse<TResponseData> : TResponseData;
