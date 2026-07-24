import React, { useState } from 'react';
import { ScrollView, View } from '@tarojs/components';
import StarIcon from '../StarIcon';
import type {
  MatrixRatingProps,
  MatrixRatingRow,
  MatrixRatingValue,
} from './type';
import { getRatingValue, getRecordKey, joinClassNames } from './util';
import './style.less';

const MatrixRating = <
  R extends MatrixRatingValue = MatrixRatingValue,
>(
  props: MatrixRatingProps<R>,
): React.ReactElement => {
  const {
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
  const ratingColumns = columns;

  const handleRate = (row: MatrixRatingRow<R>, score: number): void => {
    if (disabled || row.disabled) {
      return;
    }

    const nextValue = {
      ...currentValue,
      [getRecordKey(row.value)]: score,
    };

    if (value === undefined) {
      setInnerValue(nextValue);
    }

    onChange?.(nextValue, {
      row,
      score,
      value: nextValue,
    });
  };

  return (
    <View className={joinClassNames(['matrix-rating', className])}>
      <ScrollView className="matrix-rating__scroll" scrollX>
        <View className="matrix-rating__table">
          <View className="matrix-rating__row matrix-rating__head">
            <View className="matrix-rating__corner" />
            {ratingColumns.map(column => (
              <View key={column.value} className="matrix-rating__column">
                {column.label}
                {column.description && (
                  <View className="matrix-rating__column-tip">
                    {column.description}
                  </View>
                )}
              </View>
            ))}
          </View>
          {rows.map(row => {
            const score = getRatingValue(currentValue, row.value);
            const rowDisabled = Boolean(disabled || row.disabled);

            return (
              <View
                key={getRecordKey(row.value)}
                className={joinClassNames([
                  'matrix-rating__row',
                  rowDisabled && 'matrix-rating__row--disabled',
                ])}
              >
                <View className="matrix-rating__row-title">
                  <View>{row.label}</View>
                  {row.description && (
                    <View className="matrix-rating__description">
                      {row.description}
                    </View>
                  )}
                </View>
                {ratingColumns.map(column => {
                  const checked = column.value <= score;
                  const cellDisabled = rowDisabled || column.disabled;

                  return (
                    <View
                      key={column.value}
                      className={joinClassNames([
                        'matrix-rating__cell',
                        checked && 'matrix-rating__cell--checked',
                        cellDisabled && 'matrix-rating__cell--disabled',
                      ])}
                      onClick={() => {
                        if (!cellDisabled) {
                          handleRate(row, column.value);
                        }
                      }}
                    >
                      <StarIcon
                        active={checked}
                        disabled={cellDisabled}
                        size={36}
                      />
                    </View>
                  );
                })}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default MatrixRating;
export type {
  MatrixRatingAnswer,
  MatrixRatingChangePayload,
  MatrixRatingColumn,
  MatrixRatingProps,
  MatrixRatingRow,
  MatrixRatingType,
  MatrixRatingValue,
} from './type';
