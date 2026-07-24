import React, { useState } from 'react';
import { ScrollView, View } from '@tarojs/components';
import StarIcon from '../StarIcon';
import type {
  MultiRatingColumn,
  MultiRatingProps,
  MultiRatingRef,
  MultiRatingRow,
  MultiRatingValue,
} from './type';
import { getRatingValue, getRecordKey, joinClassNames } from './util';
import './style.less';

/**
 * 多项打分组件。用于多个题项分别打分，每个题项独立保存分值。
 */
const MultiRatingInner = <R extends MultiRatingValue = MultiRatingValue>(
  props: MultiRatingProps<R>,
  ref: React.ForwardedRef<MultiRatingRef<R>>,
): React.ReactElement => {
  const {
    questionId,
    rows,
    columns,
    value,
    defaultValue = {},
    disabled = false,
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

  const handleRate = (row: MultiRatingRow<R>, column: MultiRatingColumn): void => {
    const cellDisabled = disabled || row.disabled || column.disabled;

    if (cellDisabled) {
      return;
    }

    const nextValue = {
      ...currentValue,
      [getRecordKey(row.value)]: column.value,
    };

    if (value === undefined) {
      setInnerValue(nextValue);
    }

    onChange?.(nextValue, {
      row,
      score: column.value,
      value: nextValue,
    });
  };

  return (
    <View className={joinClassNames(['multi-rating', className])}>
      {rows.map(row => {
        const score = getRatingValue(currentValue, row.value);
        const rowDisabled = Boolean(disabled || row.disabled);

        return (
          <View
            key={getRecordKey(row.value)}
            className={joinClassNames([
              'multi-rating__item',
              rowDisabled && 'multi-rating__item--disabled',
            ])}
          >
            <View className="multi-rating__title">
              <View>{row.label}</View>
              {row.description && (
                <View className="multi-rating__description">{row.description}</View>
              )}
            </View>
            <ScrollView className="multi-rating__scroll" scrollX>
              <View className="multi-rating__scale">
                {columns.map(column => {
                  const checked = column.value <= score;
                  const cellDisabled = rowDisabled || column.disabled;

                  return (
                    <View
                      key={column.value}
                      className={joinClassNames([
                        'multi-rating__option',
                        checked && 'multi-rating__option--checked',
                        cellDisabled && 'multi-rating__option--disabled',
                      ])}
                      onClick={() => handleRate(row, column)}
                    >
                      <View className="multi-rating__star">
                        <StarIcon active={checked} disabled={cellDisabled} size={38} />
                      </View>
                      <View className="multi-rating__label">{column.label}</View>
                      {column.description && (
                        <View className="multi-rating__column-tip">{column.description}</View>
                      )}
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        );
      })}
    </View>
  );
};

const MultiRating = React.forwardRef(MultiRatingInner) as <
  R extends MultiRatingValue = MultiRatingValue,
>(
  props: MultiRatingProps<R> & React.RefAttributes<MultiRatingRef<R>>,
) => React.ReactElement;

export default MultiRating;
export type {
  MultiRatingAnswer,
  MultiRatingChangePayload,
  MultiRatingColumn,
  MultiRatingProps,
  MultiRatingRef,
  MultiRatingRow,
  MultiRatingSubmitValue,
  MultiRatingType,
  MultiRatingValue,
} from './type';
