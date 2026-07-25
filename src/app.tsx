import { useEffect, type PropsWithChildren } from 'react';
import { useDidShow } from '@tarojs/taro';
import { Provider } from 'react-redux';
import { authManager } from '@/utils/AuthManager';

import { store } from './store';

import './app.less';

function App({ children }: PropsWithChildren<unknown>) {
  useEffect(() => {
    authManager.guard();
  });

  useDidShow(() => {
    authManager.guard();
  });

  // children 是将要会渲染的页面
  return <Provider store={store}>{children}</Provider>;
}

export default App;
