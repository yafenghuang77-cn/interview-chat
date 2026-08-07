import type { EnvironmentConfig } from './types';

/** 生产环境配置；发布前将 domain 替换为实际域名。 */
const productionConfig = {
  domain: '',
  url: '/api',
} satisfies EnvironmentConfig;

export default productionConfig;
