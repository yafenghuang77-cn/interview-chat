import AuthManager from './AuthManager';

export { AuthManager } from './AuthManager';

/** 项目级鉴权管理器单例。 */
export const authManager = AuthManager.getInstance();

export default authManager;
