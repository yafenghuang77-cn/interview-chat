import Taro from '@tarojs/taro';

import { getToken, setTokenExpiredHandler } from '@/utils/request';

const LOGIN_ROUTE = '/pages/login/index';

/** 将路由统一成带前导斜杠且不包含参数的格式。 */
const normalizeRoute = (route: string): string => {
  const path = route.split(/[?#]/, 1)[0];

  if (!path) {
    return '';
  }

  return path.startsWith('/') ? path : `/${path}`;
};

/**
 * 统一维护登录态：由生命周期、路由变化和请求 401/403 事件触发，不使用轮询或定时器。
 */
export class AuthManager {
  /** 全局只保留一个实例，避免重复注册监听。 */
  private static instance: AuthManager | null = null;

  /** 防止 React 开发模式或热更新期间重复执行 start。 */
  private started = false;

  /** 多个并发 401/403 共用同一个跳转 Promise，防止重复导航。 */
  private redirectPromise: Promise<void> | null = null;

  /** 避免同一路由在 App 重渲染时重复执行无 token 跳转。 */
  private lastGuardRoute: string | null = null;

  private lastGuardToken: string | null | undefined;

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }

    return AuthManager.instance;
  }

  /** 注册接口失效回调和 H5 的路由监听，不监听聚焦或前后台事件。 */
  start(): void {
    if (this.started) {
      return;
    }

    this.started = true;
    setTokenExpiredHandler(async () => {
      await this.guard();
    });

    if (process.env.TARO_ENV === 'h5' && typeof window !== 'undefined') {
      // H5 浏览器前进、后退及 hash 路由变化时检查。
      window.addEventListener('popstate', this.handleRouteChange);
      window.addEventListener('hashchange', this.handleRouteChange);
    }
  }

  /** 解除监听，主要用于应用卸载和开发环境热更新。 */
  stop(): void {
    if (!this.started) {
      return;
    }

    this.started = false;
    setTokenExpiredHandler(null);

    if (process.env.TARO_ENV === 'h5' && typeof window !== 'undefined') {
      window.removeEventListener('popstate', this.handleRouteChange);
      window.removeEventListener('hashchange', this.handleRouteChange);
    }
  }

  /**
   * 检查当前登录态。这里只判断 token 是否存在，不解析 token 内容；
   * token 失效由请求层根据接口返回的 401/403 统一处理。
   */
  async guard(currentRoute?: string): Promise<boolean> {
    const token = getToken();

    if (token) {
      this.lastGuardRoute = null;
      this.lastGuardToken = token;
      return true;
    }

    // 登录页本身必须允许无 token 访问，否则会形成重复跳转。
    const route = currentRoute ? normalizeRoute(currentRoute) : this.getCurrentRoute();

    if (this.lastGuardRoute === route && this.lastGuardToken === null) {
      return this.isPublicRoute(route);
    }

    this.lastGuardRoute = route;
    this.lastGuardToken = null;

    if (this.isPublicRoute(route)) {
      return true;
    }

    await this.redirectToLogin();
    return false;
  }

  private readonly handleRouteChange = (): void => {
    void this.guard();
  };

  private getCurrentRoute(): string {
    if (process.env.TARO_ENV === 'h5' && typeof window !== 'undefined') {
      // 项目使用 hash 路由，路由变化时浏览器地址比 Taro 页面栈更新得更及时。
      const hashRoute = window.location.hash.replace(/^#/, '');

      if (hashRoute) {
        return normalizeRoute(hashRoute);
      }

      // 兼容没有 hash 的启动瞬间和可能切换为 browser 路由的情况。
      if (window.location.pathname.endsWith(LOGIN_ROUTE)) {
        return LOGIN_ROUTE;
      }
    }

    // 全局管理器中的 Current.router 可能保留上一页，页面栈能更准确地反映当前展示页面。
    const pages = Taro.getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const pageRoute = currentPage?.route || currentPage?.__route__;

    if (pageRoute) {
      return normalizeRoute(pageRoute);
    }

    // H5 启动早期页面栈可能尚未生成，此时再使用当前实例路由兜底。
    return normalizeRoute(Taro.getCurrentInstance().router?.path || '');
  }

  private isPublicRoute(route: string): boolean {
    return route === LOGIN_ROUTE;
  }

  private redirectToLogin(): Promise<void> {
    // 路由事件可能紧邻触发，导航前再次确认，避免在登录页原地 reLaunch 引起抖动。
    if (this.isPublicRoute(this.getCurrentRoute())) {
      return Promise.resolve();
    }

    if (this.redirectPromise) {
      return this.redirectPromise;
    }

    // reLaunch 会清空受保护页面栈，避免用户返回到已经失效的业务页面。
    this.redirectPromise = Taro.reLaunch({ url: LOGIN_ROUTE })
      .then(() => undefined)
      .catch(() => {
        // 导航失败后允许下一次路由或接口事件重新尝试。
        this.lastGuardRoute = null;
        this.lastGuardToken = undefined;
      })
      .finally(() => {
        this.redirectPromise = null;
      });

    return this.redirectPromise;
  }
}

export default AuthManager;
