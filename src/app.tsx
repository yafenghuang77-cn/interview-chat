import type { PropsWithChildren } from 'react';

import './app.less';

function App({ children }: PropsWithChildren<unknown>) {
  // useEffect(() => {
  //   authManager.guard();
  // });

  // useDidShow(() => {
  //   authManager.guard();
  // });

  // children 是将要会渲染的页面
  return { children };
  // return <Provider store={store}>{children}</Provider>;
}

export default App;
