import { View, Text, Button } from '@tarojs/components';
import Taro, { useLoad } from '@tarojs/taro';
import './index.less';

export default function Index() {
  useLoad(() => {
    console.log('Page loaded.');
  });

  return (
    <View className="index">
      <Text>Hello world!</Text>
      <Button
        type="primary"
        onClick={() => {
          Taro.navigateTo({
            url: '/pages/Interview/index',
          });
        }}
      >
        去答题
      </Button>
    </View>
  );
}
