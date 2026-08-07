/** 缓存有效期，单位毫秒；null 表示永久有效。 */
export type PersistMaxAge = number | null;

/** 兼容 setStorageSync 的秒级有效期入参。 */
export type StorageExpireTime = number | string | null;

/** StorageManager 的全局配置。 */
export interface StorageManagerOptions {
  namespace?: string;
  defaultMaxAge?: PersistMaxAge;
}

/** 单条缓存的写入配置。 */
export interface SetStorageOptions {
  maxAge?: PersistMaxAge;
}

/** update 方法支持直接传新值，也支持根据旧值计算新值。 */
export type StorageUpdater<T> = T | ((currentValue: T) => T);

/** 实际写入 Taro Storage 的数据结构。 */
export interface StoredPayload<T> {
  value: T;
  createdAt: number;
  updatedAt: number;
  expiresAt: number | null;
}
