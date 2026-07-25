import type { UserConfigExport } from '@tarojs/cli';

const proxyTarget = process.env.TARO_APP_PROXY_TARGET || 'http://localhost:3000';

export default {
  logger: {
    quiet: false,
    stats: true,
  },
  mini: {},
  h5: {
    devServer: {
      proxy: [
        {
          context: ['/api'],
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
          pathRewrite: {
            '^/api': '',
          },
        },
      ],
    },
  },
} satisfies UserConfigExport<'webpack5'>;
