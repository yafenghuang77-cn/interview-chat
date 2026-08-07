import { StorageManager } from './StorageManager';

export { StorageManager };

export type {
  PersistMaxAge,
  SetStorageOptions,
  StorageExpireTime,
  StorageManagerOptions,
  StorageUpdater,
  StoredPayload,
} from './types';

/** 项目默认缓存实例，使用 interview-chat 命名空间。 */
export const storageManager = StorageManager.getInstance();

export default storageManager;
