/** 接口基础地址，H5 开发环境默认通过 /api 代理转发。 */
export const REQUEST_BASE_URL = process.env.TARO_APP_API_BASE_URL || '/api';

/** 全局请求超时时间，单位毫秒。 */
export const REQUEST_TIMEOUT = 5000;

/** 后端业务响应中代表成功的 code。 */
export const REQUEST_SUCCESS_CODES = [0, 200, 201, 202, 204] as const;

/** 已知的后端业务失败 code，其他非成功 code 同样会按失败处理。 */
export const REQUEST_ERROR_CODES = [400, 500, 9000] as const;

/** 后端业务响应中代表 token 失效的 code。 */
export const REQUEST_TOKEN_EXPIRED_CODES = [401, 403] as const;

/** 允许作为请求成功处理的 HTTP status。 */
export const REQUEST_SUCCESS_STATUS_CODES = [200, 201, 202, 204] as const;

/** 代表 token 失效的 HTTP status。 */
export const REQUEST_TOKEN_EXPIRED_STATUS_CODES = [401, 403] as const;

/** 前端生成的错误 code，避免与后端业务 code 混淆。 */
export const REQUEST_NETWORK_ERROR_CODE = -101;

export const REQUEST_TIMEOUT_ERROR_CODE = -102;

export const REQUEST_PARSE_ERROR_CODE = -103;

export const REQUEST_DEFAULT_ERROR_MESSAGE = '请求失败，请稍后重试';

export const REQUEST_NETWORK_ERROR_MESSAGE = '网络异常，请检查网络后重试';

export const REQUEST_TIMEOUT_ERROR_MESSAGE = '请求超时，请稍后重试';

export const REQUEST_PARSE_ERROR_MESSAGE = '响应数据格式异常，请稍后重试';

/** token 的本地缓存键和请求头配置。 */
export const TOKEN_STORAGE_KEY = 'token';

export const TOKEN_HEADER_NAME = 'Authorization';

export const TOKEN_HEADER_PREFIX = 'Bearer';
