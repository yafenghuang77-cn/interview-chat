import React from 'react';
import { Text, View } from '@tarojs/components';
import type { StarIconProps } from './type';
import { joinClassNames } from './util';
import './style.less';

const StarIcon: React.FC<StarIconProps> = props => {
  const {
    active = false,
    disabled = false,
    size = 40,
    activeColor = '#f5c84b',
    inactiveColor = '#d9d9d9',
    className = '',
  } = props;
  const color = active ? activeColor : inactiveColor;

  return (
    <View
      className={joinClassNames([
        'star-icon',
        active && 'star-icon--active',
        disabled && 'star-icon--disabled',
        className,
      ])}
      style={{ width: `${size}px`, height: `${size}px`, color }}
    >
      <Text className="star-icon__mark">★</Text>
    </View>
  );
};

export default StarIcon;
export type { StarIconProps } from './type';
