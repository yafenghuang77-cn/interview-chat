import React from 'react';
import { Text, View } from '@tarojs/components';
import { SingleChoice, MultiChoice, ImageSingleChoice, ImageMultiChoice } from '@/components';
import './AnswerAreaList.less';

const AnswerAreaList: React.FC = props => {
  const { options } = props;
  console.log(options, 'options');

  const renderItem = (type: string) => {
    switch (type) {
      case 'SingleChoice':
        return (
          <SingleChoice
            options={options.options}
            onChange={value => {
              console.log(value, '单选题');
            }}
          />
        );

      case 'MultiChoice':
        return (
          <MultiChoice
            options={options.options}
            onChange={value => {
              console.log(value, '多选题');
            }}
          />
        );

      case 'single':
        return (
          <ImageSingleChoice
            options={options.options}
            onChange={value => {
              console.log(value, '图片单选题');
            }}
          />
        );

      case 'multiple':
        return (
          <ImageMultiChoice
            options={options.options}
            onChange={value => {
              console.log(value, '图片多选题');
            }}
          />
        );
    }
    return null;
  };

  return (
    <View className="answer-area-list">
      <Text className="answer-area-list__title">答题区</Text>
      {/* <View className="answer-area-list__divider" /> */}
      <Text className="answer-area-list__label">{options.questionText}</Text>
      <View>{renderItem(options.type)}</View>
    </View>
  );
};

export default AnswerAreaList;
