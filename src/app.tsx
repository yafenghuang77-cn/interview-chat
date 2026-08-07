import { useEffect, type PropsWithChildren } from 'react';

import { environment, environmentConfig, requestBaseUrl } from '@/config';

import './app.less';

function App({ children }: PropsWithChildren<unknown>) {
  useEffect(() => {
    // 启动时输出当前环境，方便确认构建模式和请求地址是否正确。
    // eslint-disable-next-line no-console
    console.info('[App Environment]', {
      environment,
      nodeEnvironment: process.env.NODE_ENV,
      platform: process.env.TARO_ENV,
      domain: environmentConfig.domain,
      url: environmentConfig.url,
      requestBaseUrl,
    });
  }, []);

  // useEffect(() => {
  //   authManager.guard();
  // });

  // useDidShow(() => {
  //   authManager.guard();
  // });

  // children 是将要会渲染的页面
  return children;
  // return <Provider store={store}>{children}</Provider>;
}

export default App;
