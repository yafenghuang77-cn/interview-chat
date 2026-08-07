import Taro from '@tarojs/taro';

import { DEFAULT_NAMESPACE, STORAGE_PREFIX_SEPARATOR } from './constants';
import type {
  PersistMaxAge,
  SetStorageOptions,
  StorageExpireTime,
  StorageManagerOptions,
  StorageUpdater,
  StoredPayload,
} from './types';

/** 判断缓存是否由当前 StorageManager 按标准结构写入。 */
const isStoredPayload = <T>(payload: unknown): payload is StoredPayload<T> => {
  if (!payload || typeof payload !== 'object') {
    return false;
  }

  const record = payload as Partial<StoredPayload<T>>;
  const hasCreatedAt = typeof record.createdAt === 'number';
  const hasUpdatedAt = typeof record.updatedAt === 'number';
  const hasExpiresAt = record.expiresAt === null || typeof record.expiresAt === 'number';

  return 'value' in record && hasCreatedAt && hasUpdatedAt && hasExpiresAt;
};

/**
 * 项目统一的同步缓存管理器。
 * 数据通过命名空间隔离，并在读取时自动清理过期或损坏的缓存。
 */
export class StorageManager {
  private static instance: StorageManager | null = null;

  private namespace: string;

  private defaultMaxAge: PersistMaxAge;

  /** 获取项目级单例；再次传入配置时会更新现有实例。 */
  static getInstance(options?: StorageManagerOptions): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager(options);
    } else if (options) {
      StorageManager.instance.configure(options);
    }

    return StorageManager.instance;
  }

  constructor(options: StorageManagerOptions = {}) {
    this.namespace = options.namespace?.trim() || DEFAULT_NAMESPACE;
    this.defaultMaxAge = options.defaultMaxAge ?? null;
  }

  /** 更新命名空间或默认有效期。 */
  configure(options: StorageManagerOptions): StorageManagerOptions {
    if (options.namespace?.trim()) {
      this.namespace = options.namespace.trim();
    }

    if ('defaultMaxAge' in options) {
      this.defaultMaxAge = options.defaultMaxAge ?? null;
    }

    return this.getConfig();
  }

  /** 返回当前配置副本。 */
  getConfig(): StorageManagerOptions {
    return {
      namespace: this.namespace,
      defaultMaxAge: this.defaultMaxAge,
    };
  }

  /**
   * 新增或覆盖缓存。
   * maxAge 单位为毫秒；null 表示永久缓存；不传时使用全局 defaultMaxAge。
   */
  set<T>(key: string, value: T, options: SetStorageOptions = {}): void {
    const now = Date.now();
    const maxAge = 'maxAge' in options ? (options.maxAge ?? null) : this.defaultMaxAge;

    this.writePayload(key, {
      value,
      createdAt: now,
      updatedAt: now,
      expiresAt: this.getExpiresAt(now, maxAge),
    });
  }

  /** 仅在 key 不存在时新增；已存在时返回 false。 */
  create<T>(key: string, value: T, options: SetStorageOptions = {}): boolean {
    if (this.has(key)) {
      return false;
    }

    this.set(key, value, options);
    return true;
  }

  /**
   * 读取缓存，不存在、已过期或数据损坏时返回 null。
   * 传入 fallback 后返回值不会包含 null。
   */
  get<T>(key: string): T | null;
  get<T>(key: string, fallback: T): T;
  get<T>(key: string, fallback?: T): T | null {
    const payload = this.getRaw<T>(key);

    return payload ? payload.value : (fallback ?? null);
  }

  /** 获取包含创建时间、更新时间和过期时间的完整缓存结构。 */
  getRaw<T>(key: string): StoredPayload<T> | null {
    const storageKey = this.getStorageKey(key);
    const payload = Taro.getStorageSync<unknown>(storageKey);

    if (payload === undefined || payload === null || payload === '') {
      return null;
    }

    if (!isStoredPayload<T>(payload)) {
      Taro.removeStorageSync(storageKey);
      return null;
    }

    if (this.isExpired(payload)) {
      Taro.removeStorageSync(storageKey);
      return null;
    }

    return payload;
  }

  /**
   * 修改已存在的缓存；key 不存在时返回 false。
   * 不传 maxAge 时保留原过期时间，传入后从本次更新时间重新计算。
   */
  update<T>(key: string, updater: StorageUpdater<T>, options: SetStorageOptions = {}): boolean {
    const current = this.getRaw<T>(key);

    if (!current) {
      return false;
    }

    const now = Date.now();
    const value =
      typeof updater === 'function' ? (updater as (currentValue: T) => T)(current.value) : updater;
    const expiresAt =
      options.maxAge === undefined ? current.expiresAt : this.getExpiresAt(now, options.maxAge);

    this.writePayload(key, {
      value,
      createdAt: current.createdAt,
      updatedAt: now,
      expiresAt,
    });

    return true;
  }

  /** 判断缓存是否存在且仍在有效期内。 */
  has(key: string): boolean {
    return this.getRaw(key) !== null;
  }

  /** 删除单条缓存；删除成功返回 true，不存在时返回 false。 */
  remove(key: string): boolean {
    const storageKey = this.getStorageKey(key);

    if (!this.has(key)) {
      return false;
    }

    Taro.removeStorageSync(storageKey);
    return true;
  }

  /** 返回当前命名空间下所有仍然有效的业务 key。 */
  keys(): string[] {
    const prefix = this.getNamespacePrefix();

    return Taro.getStorageInfoSync()
      .keys.filter(key => key.startsWith(prefix))
      .map(key => key.slice(prefix.length))
      .filter(key => this.has(key));
  }

  /** 返回当前命名空间下有效缓存数量。 */
  size(): number {
    return this.keys().length;
  }

  /** 清理当前命名空间下的所有缓存，不影响其他模块的数据。 */
  clear(): number {
    const prefix = this.getNamespacePrefix();
    const storageKeys = Taro.getStorageInfoSync().keys.filter(key => key.startsWith(prefix));

    storageKeys.forEach(key => Taro.removeStorageSync(key));
    return storageKeys.length;
  }

  /** 清理当前命名空间下已过期或损坏的缓存。 */
  clearExpired(): number {
    const prefix = this.getNamespacePrefix();
    const storageKeys = Taro.getStorageInfoSync().keys.filter(key => key.startsWith(prefix));
    let removedCount = 0;

    storageKeys.forEach(storageKey => {
      const payload = Taro.getStorageSync<unknown>(storageKey);

      if (!isStoredPayload(payload) || this.isExpired(payload)) {
        Taro.removeStorageSync(storageKey);
        removedCount += 1;
      }
    });

    return removedCount;
  }

  /**
   * Taro 风格的兼容写法。time 单位为秒；不传、空值或非正数表示永久缓存。
   */
  setStorageSync<T>(key: string, value: T, time?: StorageExpireTime): void {
    this.set(key, value, { maxAge: this.getMaxAgeBySeconds(time) });
  }

  /** Taro 风格的兼容写法；不存在时返回 undefined。 */
  getStorageSync<T>(key: string): T | undefined {
    return this.getRaw<T>(key)?.value;
  }

  /** Taro 风格的兼容写法。 */
  removeStorageSync(key: string): boolean {
    return this.remove(key);
  }

  /** Taro 风格的兼容写法，只清理当前项目命名空间。 */
  clearStorageSync(): number {
    return this.clear();
  }

  private writePayload<T>(key: string, payload: StoredPayload<T>): void {
    Taro.setStorageSync(this.getStorageKey(key), payload);
  }

  private getMaxAgeBySeconds(time?: StorageExpireTime): PersistMaxAge {
    if (time === undefined || time === null || time === '') {
      return null;
    }

    const seconds = Number(time);

    return Number.isFinite(seconds) && seconds > 0 ? seconds * 1000 : null;
  }

  private getExpiresAt(baseTime: number, maxAge: PersistMaxAge): number | null {
    if (maxAge === null) {
      return null;
    }

    return baseTime + Math.max(0, maxAge);
  }

  private isExpired(payload: StoredPayload<unknown>): boolean {
    return payload.expiresAt !== null && payload.expiresAt <= Date.now();
  }

  private getStorageKey(key: string): string {
    this.assertKey(key);
    return `${this.getNamespacePrefix()}${key}`;
  }

  private getNamespacePrefix(): string {
    return `${this.namespace}${STORAGE_PREFIX_SEPARATOR}`;
  }

  private assertKey(key: string): void {
    if (!key.trim()) {
      throw new Error('Storage key 不能为空');
    }
  }
}

export default StorageManager;
