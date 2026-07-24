import React, { useState } from 'react';
import { ScrollView, View } from '@tarojs/components';
import StarIcon from '../StarIcon';
import type {
  BidirectionalRatingColumn,
  BidirectionalRatingProps,
  BidirectionalRatingRef,
  BidirectionalRatingSide,
} from './type';
import { getActiveScore, getColumnKey, getNextValue, joinClassNames } from './util';
import './style.less';

/**
 * 双向打分组件。用于左右两个方向分别选择打分强度，两个方向可同时保留选择值。
 */
const BidirectionalRating = React.forwardRef<BidirectionalRatingRef, BidirectionalRatingProps>(
  (props, ref) => {
    const {
      questionId,
      columns,
      value,
      defaultValue = null,
      disabled = false,
      leftLabel = '左侧',
      rightLabel = '右侧',
      className = '',
      onChange,
    } = props;
    const [innerValue, setInnerValue] = useState(defaultValue);
    const currentValue = value !== undefined ? value : innerValue;

    React.useImperativeHandle(
      ref,
      () => ({
        init: nextValue => setInnerValue(nextValue || null),
        getSubmitValue: () => ({
          questionId,
          value: currentValue,
        }),
      }),
      [currentValue, questionId],
    );

    const handleRate = (side: BidirectionalRatingSide, column: BidirectionalRatingColumn): void => {
      const cellDisabled = disabled || column.disabled;

      if (cellDisabled) {
        return;
      }

      const nextValue = getNextValue(currentValue, side, column.value);

      if (value === undefined) {
        setInnerValue(nextValue);
      }

      onChange?.(nextValue, {
        side,
        score: column.value,
        value: nextValue,
      });
    };

    const renderStars = (side: BidirectionalRatingSide) => {
      const activeScore = getActiveScore(currentValue, side);

      return (
        <View className="bidirectional-rating__scale">
          {columns.map(column => {
            const checked = column.value <= activeScore;
            const cellDisabled = disabled || column.disabled;

            return (
              <View
                key={getColumnKey(column.value)}
                className={joinClassNames([
                  'bidirectional-rating__option',
                  checked && 'bidirectional-rating__option--checked',
                  cellDisabled && 'bidirectional-rating__option--disabled',
                ])}
                onClick={() => handleRate(side, column)}
              >
                <View className="bidirectional-rating__star">
                  <StarIcon active={checked} disabled={cellDisabled} size={38} />
                </View>
                <View className="bidirectional-rating__option-label">{column.label}</View>
                {column.description && (
                  <View className="bidirectional-rating__option-tip">{column.description}</View>
                )}
              </View>
            );
          })}
        </View>
      );
    };

    return (
      <View className={joinClassNames(['bidirectional-rating', className])}>
        <View className="bidirectional-rating__panel">
          <ScrollView className="bidirectional-rating__scroll" scrollX>
            <View className="bidirectional-rating__content">
              <View className="bidirectional-rating__side">
                <View className="bidirectional-rating__label">{leftLabel}</View>
                {renderStars('left')}
              </View>
              <View className="bidirectional-rating__side">
                <View className="bidirectional-rating__label">{rightLabel}</View>
                {renderStars('right')}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  },
);

export default BidirectionalRating;
export type {
  BidirectionalRatingAnswer,
  BidirectionalRatingChangePayload,
  BidirectionalRatingColumn,
  BidirectionalRatingProps,
  BidirectionalRatingRef,
  BidirectionalRatingSide,
  BidirectionalRatingSubmitValue,
  BidirectionalRatingType,
} from './type';
