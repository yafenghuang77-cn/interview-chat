export type AuthManagerOptions = {
  loginUrl: string;
  publicPages?: string[];
  getToken: () => string | null | undefined;
  setToken?: (token: string) => void;
  clearToken?: () => void;
  getCurrentUrl?: () => string;
  redirectToLogin: (url: string) => void;
};

export type AuthGuardOptions = {
  currentUrl?: string;
  redirect?: boolean;
};

export class AuthManager {
  private static instance: AuthManager | null = null;

  private config: AuthManagerOptions;

  private redirecting = false;

  static getInstance(options?: AuthManagerOptions): AuthManager {
    if (!AuthManager.instance) {
      if (!options) {
        throw new Error('AuthManager options are required when creating the singleton.');
      }

      AuthManager.instance = new AuthManager(options);
    } else if (options) {
      AuthManager.instance.configure(options);
    }

    return AuthManager.instance;
  }

  constructor(options: AuthManagerOptions) {
    this.config = this.cloneConfig(options);
  }

  configure(options: Partial<AuthManagerOptions>): AuthManagerOptions {
    this.config = this.cloneConfig({
      ...this.config,
      ...options,
    });

    return this.getConfig();
  }

  getConfig(): AuthManagerOptions {
    return this.cloneConfig(this.config);
  }

  getToken(): string | null {
    return this.config.getToken() || null;
  }

  setToken(token: string): void {
    this.config.setToken?.(token);
    this.redirecting = false;
  }

  clearToken(): void {
    this.config.clearToken?.();
    this.redirecting = false;
  }

  hasToken(): boolean {
    return Boolean(this.getToken());
  }

  isPublicPage(url = this.getCurrentUrl()): boolean {
    const currentPath = this.getPathname(url);

    return this.config.publicPages?.some(page => this.getPathname(page) === currentPath) ?? false;
  }

  guard(options: AuthGuardOptions = {}): boolean {
    if (this.hasToken()) {
      this.redirecting = false;
      return true;
    }

    const currentUrl = options.currentUrl ?? this.getCurrentUrl();

    if (this.isPublicPage(currentUrl)) {
      this.redirecting = false;
      return true;
    }

    if (options.redirect ?? true) {
      this.redirectToLogin(currentUrl);
    }

    return false;
  }

  handleAuthExpired(): void {
    this.clearToken();
    this.redirectToLogin(this.getCurrentUrl());
  }

  redirectToLogin(currentUrl = this.getCurrentUrl()): void {
    if (this.redirecting || this.isPublicPage(currentUrl)) {
      return;
    }

    this.redirecting = true;
    this.config.redirectToLogin(this.buildLoginUrl(currentUrl));
  }

  private getCurrentUrl(): string {
    return this.config.getCurrentUrl?.() || '';
  }

  private buildLoginUrl(currentUrl: string): string {
    if (!currentUrl) {
      return this.config.loginUrl;
    }

    const separator = this.config.loginUrl.includes('?') ? '&' : '?';

    return `${this.config.loginUrl}${separator}redirect=${encodeURIComponent(currentUrl)}`;
  }

  private getPathname(url: string): string {
    const pathname = url.split('?')[0] || '';

    return pathname.startsWith('/') ? pathname : `/${pathname}`;
  }

  private cloneConfig(config: AuthManagerOptions): AuthManagerOptions {
    return {
      ...config,
      publicPages: [...(config.publicPages || [])],
    };
  }
}

export default AuthManager;
