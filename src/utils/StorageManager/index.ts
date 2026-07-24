import { StorageManager } from './StorageManager'

export { StorageManager }
export type {
  PersistMaxAge,
  SetStorageOptions,
  StorageExpireTime,
  StorageManagerOptions,
  StoredPayload,
} from './types'

export const storageManager = StorageManager.getInstance()

export default storageManager
