import { useEffect, type PropsWithChildren } from 'react';

import { environment, environmentConfig, requestBaseUrl } from '@/config';
import authManager from '@/utils/AuthManager';

import './app.less';

function App({ children }: PropsWithChildren<unknown>) {
  useEffect(() => {
    authManager.start();

    return () => authManager.stop();
  }, []);

  // Taro 没有公开的全局页面切换事件；children 变化只在当前页面发生切换时检查。
  useEffect(() => {
    void authManager.guard();
  }, [children]);

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

  // children 是将要会渲染的页面
  return children;
  // return <Provider store={store}>{children}</Provider>;
}

export default App;
