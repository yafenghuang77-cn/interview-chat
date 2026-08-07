import type { EnvironmentConfig } from './types';

/** 项目支持的运行环境。 */
export const APP_ENVIRONMENT = {
  TEST: 'test',
  PRODUCTION: 'production',
} as const;

export type AppEnvironment = (typeof APP_ENVIRONMENT)[keyof typeof APP_ENVIRONMENT];

const getEnvironment = (): AppEnvironment => {
  const environment = process.env.TARO_APP_ENV;

  if (environment === APP_ENVIRONMENT.TEST || environment === APP_ENVIRONMENT.PRODUCTION) {
    return environment;
  }

  return process.env.NODE_ENV === 'development' ? APP_ENVIRONMENT.TEST : APP_ENVIRONMENT.PRODUCTION;
};

const environment = getEnvironment();

const joinUrl = (domain: string, url: string): string => {
  if (!domain) {
    return url;
  }

  return `${domain.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
};

/** 当前 mode 对应的 .env 文件会提供后端域名和接口基础路径。 */
export const environmentConfig: EnvironmentConfig = {
  domain: process.env.TARO_APP_DOMAIN || '',
  url: process.env.TARO_APP_URL || '',
};

/**
 * 开发环境的 H5 请求使用相对路径并由 devServer 代理；其他场景直接使用后端域名。
 */
export const requestBaseUrl =
  process.env.NODE_ENV === 'development' && process.env.TARO_ENV === 'h5'
    ? environmentConfig.url
    : joinUrl(environmentConfig.domain, environmentConfig.url);

export { environment };
export type { EnvironmentConfig } from './types';

export default environmentConfig;
