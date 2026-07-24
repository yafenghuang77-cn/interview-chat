import Taro from '@tarojs/taro'
import { DEFAULT_NAMESPACE, STORAGE_PREFIX_SEPARATOR } from './constants'
import type {
  PersistMaxAge,
  SetStorageOptions,
  StorageExpireTime,
  StorageManagerOptions,
  StoredPayload,
} from './types'

function isStoredPayload<T>(payload: unknown): payload is StoredPayload<T> {
  if (!payload || typeof payload !== 'object') {
    return false
  }

  const record = payload as Partial<StoredPayload<T>>
  const hasCreatedAt = typeof record.createdAt === 'number'
  const hasExpiresAt =
    record.expiresAt === null || typeof record.expiresAt === 'number'

  return 'value' in record && hasCreatedAt && hasExpiresAt
}

export class StorageManager {
  private static instance: StorageManager | null = null

  private namespace: string

  private defaultMaxAge: PersistMaxAge

  static getInstance(options?: StorageManagerOptions): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager(options)
    } else if (options) {
      StorageManager.instance.configure(options)
    }

    return StorageManager.instance
  }

  constructor(options: StorageManagerOptions = {}) {
    this.namespace = options.namespace || DEFAULT_NAMESPACE
    this.defaultMaxAge = options.defaultMaxAge ?? null
  }

  configure(options: StorageManagerOptions): void {
    if (options.namespace) {
      this.namespace = options.namespace
    }

    if ('defaultMaxAge' in options) {
      this.defaultMaxAge = options.defaultMaxAge ?? null
    }
  }

  set<T>(key: string, value: T, options: SetStorageOptions = {}): void {
    const now = Date.now()
    const maxAge = options.maxAge ?? this.defaultMaxAge
    const payload: StoredPayload<T> = {
      value,
      createdAt: now,
      expiresAt: this.getExpiresAt(now, maxAge),
    }

    Taro.setStorageSync(this.getStorageKey(key), payload)
  }

  /**
   * 存缓存，time 单位为秒；不传、传空值或非正数则永久缓存。
   */
  setStorageSync<T>(
    key: string,
    value: T,
    time?: StorageExpireTime,
  ): void {
    this.set(key, value, {
      maxAge: this.getMaxAgeBySeconds(time),
    })
  }

  get<T>(key: string): T | null
  get<T>(key: string, fallback: T): T
  get<T>(key: string, fallback?: T): T | null {
    const storageKey = this.getStorageKey(key)
    const payload = Taro.getStorageSync<StoredPayload<T> | undefined>(storageKey)

    if (!isStoredPayload<T>(payload)) {
      return fallback ?? null
    }

    if (this.isExpired(payload)) {
      Taro.removeStorageSync(storageKey)
      return fallback ?? null
    }

    return payload.value
  }

  /**
   * 取缓存，不存在或已过期时返回 undefined。
   */
  getStorageSync<T>(key: string): T | undefined {
    return this.getRaw<T>(key)?.value
  }

  getRaw<T>(key: string): StoredPayload<T> | null {
    const storageKey = this.getStorageKey(key)
    const payload = Taro.getStorageSync<StoredPayload<T> | undefined>(storageKey)

    if (!isStoredPayload<T>(payload)) {
      return null
    }

    if (this.isExpired(payload)) {
      Taro.removeStorageSync(storageKey)
      return null
    }

    return payload
  }

  has(key: string): boolean {
    return this.getRaw(key) !== null
  }

  remove(key: string): void {
    Taro.removeStorageSync(this.getStorageKey(key))
  }

  removeStorageSync(key: string): void {
    this.remove(key)
  }

  clear(): void {
    const { keys } = Taro.getStorageInfoSync()

    keys
      .filter((key) => key.startsWith(this.getNamespacePrefix()))
      .forEach((key) => Taro.removeStorageSync(key))
  }

  clearStorageSync(): void {
    this.clear()
  }

  private getMaxAgeBySeconds(time?: StorageExpireTime): PersistMaxAge {
    if (time === undefined || time === null || time === '') {
      return null
    }

    const seconds = Number.parseInt(String(time), 10)

    if (!Number.isFinite(seconds) || seconds <= 0) {
      return null
    }

    return seconds * 1000
  }

  private getExpiresAt(baseTime: number, maxAge: PersistMaxAge): number | null {
    if (maxAge === null) {
      return null
    }

    return baseTime + Math.max(maxAge, 0)
  }

  private isExpired(payload: StoredPayload<unknown>): boolean {
    return payload.expiresAt !== null && payload.expiresAt <= Date.now()
  }

  private getStorageKey(key: string): string {
    return `${this.getNamespacePrefix()}${key}`
  }

  private getNamespacePrefix(): string {
    return `${this.namespace}${STORAGE_PREFIX_SEPARATOR}`
  }
}
