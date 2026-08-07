import type { EnvironmentConfig } from './types';

/** 测试环境配置，也是本地默认启动使用的配置。 */
const testConfig = {
  domain: 'http://localhost:9090',
  url: '/api',
} satisfies EnvironmentConfig;

export default testConfig;
