import productionConfig from './production';
import testConfig from './test';
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

/** 所有环境配置集中映射，新增环境时需要同步补充对应配置文件。 */
const environmentConfigs: Record<AppEnvironment, EnvironmentConfig> = {
  [APP_ENVIRONMENT.TEST]: testConfig,
  [APP_ENVIRONMENT.PRODUCTION]: productionConfig,
};

/** 当前构建环境对应的后端配置。 */
export const environmentConfig = environmentConfigs[environment];

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
