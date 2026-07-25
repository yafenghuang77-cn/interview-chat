export {
  default,
  StorageManager,
  storageManager,
  type PersistMaxAge,
  type SetStorageOptions,
  type StorageExpireTime,
  type StorageManagerOptions,
  type StoredPayload,
} from './StorageManager'

export {
  default as authManager,
  AuthManager,
  checkAuth,
  clearAuthToken,
  configureAuth,
  getAuthToken,
  setAuthToken,
  type AuthGuardOptions,
  type AuthManagerOptions,
} from './AuthManager'

export {
  default as request,
  configureRequest,
  del,
  get,
  getRequestConfig,
  patch,
  post,
  put,
  RequestError,
  type RequestCode,
  type RequestClientOptions,
  type RequestErrorOptions,
  type RequestHeader,
  type RequestMethod,
  type RequestOptions,
  type RequestResult,
  type RequestToastOptions,
  type StandardResponse,
} from './request'
