/** 单个环境的后端配置。 */
export interface EnvironmentConfig {
  /** 后端域名，例如 https://api.example.com。 */
  domain: string;
  /** 接口基础路径，例如 /api。 */
  url: string;
}
