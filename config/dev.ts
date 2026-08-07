import type { UserConfigExport } from '@tarojs/cli';

const proxyUrl = process.env.TARO_APP_URL;
const proxyTarget = process.env.TARO_APP_DOMAIN;

if (!proxyUrl || !proxyTarget) {
  throw new Error('测试环境缺少 TARO_APP_URL 或 TARO_APP_DOMAIN 配置');
}

export default {
  logger: {
    quiet: false,
    stats: true,
  },
  mini: {},
  h5: {
    router: {
      mode: 'hash',
      basename: '/interview-chat',
      customRoutes: { 'interview-chat/Index/index': 'index' },
    },
    devServer: {
      proxy: [
        {
          context: [proxyUrl],
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
          pathRewrite: {
            [`^${proxyUrl}`]: '',
          },
        },
      ],
    },
  },
} satisfies UserConfigExport<'webpack5'>;
