import type { UserConfigExport } from '@tarojs/cli';

import testConfig from '../src/config/test';

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
          context: [testConfig.url],
          target: testConfig.domain,
          changeOrigin: true,
          secure: false,
          pathRewrite: {
            [`^${testConfig.url}`]: '',
          },
        },
      ],
    },
  },
} satisfies UserConfigExport<'webpack5'>;
