export type PersistMaxAge = number | null

export type StorageExpireTime = number | string | null

export interface StorageManagerOptions {
  namespace?: string
  defaultMaxAge?: PersistMaxAge
}

export interface SetStorageOptions {
  maxAge?: PersistMaxAge
}

export interface StoredPayload<T> {
  value: T
  createdAt: number
  expiresAt: number | null
}
