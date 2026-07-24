import React, { useState } from 'react';
import { ScrollView, View } from '@tarojs/components';
import StarIcon from '../StarIcon';
import type {
  MultiBidirectionalRatingColumn,
  MultiBidirectionalRatingProps,
  MultiBidirectionalRatingRef,
  MultiBidirectionalRatingRow,
  MultiBidirectionalRatingSide,
  MultiBidirectionalRatingValue,
} from './type';
import {
  getActiveScore,
  getBidirectionalRatingValue,
  getNextRatingValue,
  getRecordKey,
  joinClassNames,
} from './util';
import './style.less';

/**
 * 多项双向打分组件。用于多个题项分别在左右两个方向上打分。
 */
const MultiBidirectionalRatingInner = <
  R extends MultiBidirectionalRatingValue = MultiBidirectionalRatingValue,
>(
  props: MultiBidirectionalRatingProps<R>,
  ref: React.ForwardedRef<MultiBidirectionalRatingRef<R>>,
): React.ReactElement => {
  const {
    questionId,
    rows,
    columns,
    value,
    defaultValue = {},
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
      init: nextValue => setInnerValue(nextValue || {}),
      getSubmitValue: () => ({
        questionId,
        value: currentValue,
      }),
    }),
    [currentValue, questionId],
  );

  const handleRate = (
    row: MultiBidirectionalRatingRow<R>,
    side: MultiBidirectionalRatingSide,
    column: MultiBidirectionalRatingColumn,
  ): void => {
    const cellDisabled = disabled || row.disabled || column.disabled;

    if (cellDisabled) {
      return;
    }

    const currentRowValue = getBidirectionalRatingValue(currentValue, row.value);
    const nextValue = {
      ...currentValue,
      [getRecordKey(row.value)]: getNextRatingValue(currentRowValue, side, column.value),
    };

    if (value === undefined) {
      setInnerValue(nextValue);
    }

    onChange?.(nextValue, {
      row,
      side,
      score: column.value,
      value: nextValue,
    });
  };

  const renderStars = (
    row: MultiBidirectionalRatingRow<R>,
    side: MultiBidirectionalRatingSide,
    rowDisabled: boolean,
  ) => {
    const rating = getBidirectionalRatingValue(currentValue, row.value);
    const activeScore = getActiveScore(rating, side);

    return (
      <View className="multi-bidirectional-rating__scale">
        {columns.map(column => {
          const checked = column.value <= activeScore;
          const cellDisabled = rowDisabled || column.disabled;

          return (
            <View
              key={column.value}
              className={joinClassNames([
                'multi-bidirectional-rating__option',
                checked && 'multi-bidirectional-rating__option--checked',
                cellDisabled && 'multi-bidirectional-rating__option--disabled',
              ])}
              onClick={() => handleRate(row, side, column)}
            >
              <View className="multi-bidirectional-rating__star">
                <StarIcon active={checked} disabled={cellDisabled} size={38} />
              </View>
              <View className="multi-bidirectional-rating__option-label">{column.label}</View>
              {column.description && (
                <View className="multi-bidirectional-rating__option-tip">{column.description}</View>
              )}
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View className={joinClassNames(['multi-bidirectional-rating', className])}>
      {rows.map(row => {
        const rowDisabled = Boolean(disabled || row.disabled);

        return (
          <View
            key={getRecordKey(row.value)}
            className={joinClassNames([
              'multi-bidirectional-rating__item',
              rowDisabled && 'multi-bidirectional-rating__item--disabled',
            ])}
          >
            <View className="multi-bidirectional-rating__title">
              <View>{row.label}</View>
              {row.description && (
                <View className="multi-bidirectional-rating__description">{row.description}</View>
              )}
            </View>
            <ScrollView className="multi-bidirectional-rating__scroll" scrollX>
              <View className="multi-bidirectional-rating__content">
                <View className="multi-bidirectional-rating__side">
                  <View className="multi-bidirectional-rating__label">
                    {row.leftLabel || leftLabel}
                  </View>
                  {renderStars(row, 'left', rowDisabled)}
                </View>
                <View className="multi-bidirectional-rating__side">
                  <View className="multi-bidirectional-rating__label">
                    {row.rightLabel || rightLabel}
                  </View>
                  {renderStars(row, 'right', rowDisabled)}
                </View>
              </View>
            </ScrollView>
          </View>
        );
      })}
    </View>
  );
};

const MultiBidirectionalRating = React.forwardRef(MultiBidirectionalRatingInner) as <
  R extends MultiBidirectionalRatingValue = MultiBidirectionalRatingValue,
>(
  props: MultiBidirectionalRatingProps<R> & React.RefAttributes<MultiBidirectionalRatingRef<R>>,
) => React.ReactElement;

export default MultiBidirectionalRating;
export type {
  MultiBidirectionalRatingAnswer,
  MultiBidirectionalRatingChangePayload,
  MultiBidirectionalRatingColumn,
  MultiBidirectionalRatingProps,
  MultiBidirectionalRatingRef,
  MultiBidirectionalRatingRow,
  MultiBidirectionalRatingScore,
  MultiBidirectionalRatingSide,
  MultiBidirectionalRatingSubmitValue,
  MultiBidirectionalRatingType,
  MultiBidirectionalRatingValue,
} from './type';
