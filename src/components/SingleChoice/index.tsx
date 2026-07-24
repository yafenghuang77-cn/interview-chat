/**
 * 单选题
 */

import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import { resolveChoiceLayout } from '../QuestionItem/helpers';
import type { SingleChoiceProps } from './types';
import './index.less';

/**
 * 单选题。
 *
 * - 文字选项（list）：圆形单选标记 + 文字。
 * - 图片选项（grid）：图片卡片，选中态在右上角打勾（图片单选）。
 * 点击某项即选中该项，回填单个 optionId。
 */
const SingleChoice = ({ question, value, onChange, disabled }: SingleChoiceProps) => {
  const options = question.options || [];
  const layout = resolveChoiceLayout(question);

  const handleSelect = (optionId: string) => {
    if (disabled) return;
    onChange(optionId);
  };

  if (layout === 'grid') {
    return (
      <View className="question-item__imageList">
        {options.map(option => {
          const selected = value === option.id;
          return (
            <View
              key={option.id}
              className={`question-item__imageOption ${selected ? 'question-item__imageOption--active' : ''}`}
              onClick={() => handleSelect(option.id)}
            >
              {/* 图片在上 */}
              <Image
                className="question-item__optionImage"
                src={option.image || ''}
                mode="aspectFill"
              />
              {/* 图片下方：圆形单选标记 + 文字 */}
              <View className="question-item__imageOptionBar">
                <View className="question-item__radio" />
                <Text className="question-item__optionLabel">{option.label}</Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  }

  return (
    <View className="question-item__options">
      {options.map(option => {
        const selected = value === option.id;
        return (
          <View
            key={option.id}
            className={`question-item__option ${selected ? 'question-item__option--active' : ''}`}
            onClick={() => handleSelect(option.id)}
          >
            <View className="question-item__radio" />
            <Text className="question-item__optionLabel">{option.label}</Text>
          </View>
        );
      })}
    </View>
  );
};

export default SingleChoice;
