import React from 'react';
import { Text, View } from '@tarojs/components';
import './AnswerAreaList.less';

const AnswerAreaList: React.FC = () => {
  return (
    <View className="answer-area-list">
      <Text className="answer-area-list__title">答题区</Text>
      <View className="answer-area-list__divider" />
      <Text className="answer-area-list__label">请输入</Text>
      <View></View>
    </View>
  );
};

export default AnswerAreaList;
