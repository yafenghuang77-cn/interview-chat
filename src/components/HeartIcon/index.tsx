import React from 'react';
import { Text, View } from '@tarojs/components';
import type { HeartIconProps } from './type';
import { joinClassNames } from './util';
import './style.less';

const HeartIcon: React.FC<HeartIconProps> = props => {
  const {
    active = false,
    disabled = false,
    size = 40,
    activeColor = '#ef5b70',
    inactiveColor = '#d9d9d9',
    className = '',
  } = props;
  const color = active ? activeColor : inactiveColor;

  return (
    <View
      className={joinClassNames([
        'heart-icon',
        active && 'heart-icon--active',
        disabled && 'heart-icon--disabled',
        className,
      ])}
      style={{ width: `${size}px`, height: `${size}px`, color }}
    >
      <Text className="heart-icon__mark">♥</Text>
    </View>
  );
};

export default HeartIcon;
export type { HeartIconProps } from './type';
