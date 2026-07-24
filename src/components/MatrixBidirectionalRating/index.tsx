import React, { useState } from 'react';
import { ScrollView, View } from '@tarojs/components';
import StarIcon from '../StarIcon';
import type {
  MatrixBidirectionalRatingProps,
  MatrixBidirectionalRatingRow,
  MatrixBidirectionalRatingSide,
  MatrixBidirectionalRatingValue,
} from './type';
import {
  getActiveScore,
  getBidirectionalRatingValue,
  getNextRatingValue,
  getRecordKey,
  joinClassNames,
} from './util';
import './style.less';

const MatrixBidirectionalRating = <
  R extends MatrixBidirectionalRatingValue = MatrixBidirectionalRatingValue,
>(
  props: MatrixBidirectionalRatingProps<R>,
): React.ReactElement => {
  const {
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
  const ratingColumns = columns;

  const handleRate = (
    row: MatrixBidirectionalRatingRow<R>,
    side: MatrixBidirectionalRatingSide,
    score: number,
  ): void => {
    if (disabled || row.disabled) {
      return;
    }

    const currentRowValue = getBidirectionalRatingValue(currentValue, row.value);
    const nextValue = {
      ...currentValue,
      [getRecordKey(row.value)]: getNextRatingValue(
        currentRowValue,
        side,
        score,
      ),
    };

    if (value === undefined) {
      setInnerValue(nextValue);
    }

    onChange?.(nextValue, {
      row,
      side,
      score,
      value: nextValue,
    });
  };

  const renderStars = (
    row: MatrixBidirectionalRatingRow<R>,
    side: MatrixBidirectionalRatingSide,
    rowDisabled: boolean,
  ) => {
    const rating = getBidirectionalRatingValue(currentValue, row.value);
    const activeScore = getActiveScore(rating, side);

    return (
      <>
        {ratingColumns.map(column => {
          const checked = column.value <= activeScore;
          const cellDisabled = rowDisabled || column.disabled;

          return (
            <View
              key={column.value}
              className={joinClassNames([
                'matrix-bidirectional-rating__cell',
                checked && 'matrix-bidirectional-rating__cell--checked',
                cellDisabled && 'matrix-bidirectional-rating__cell--disabled',
              ])}
              onClick={() => {
                if (!cellDisabled) {
                  handleRate(row, side, column.value);
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
      </>
    );
  };

  return (
    <View className={joinClassNames(['matrix-bidirectional-rating', className])}>
      {rows.map(row => {
        const rowDisabled = Boolean(disabled || row.disabled);

        return (
          <View
            key={getRecordKey(row.value)}
            className={joinClassNames([
              'matrix-bidirectional-rating__row',
              rowDisabled && 'matrix-bidirectional-rating__row--disabled',
            ])}
          >
            <View className="matrix-bidirectional-rating__title">
              <View>{row.label}</View>
              {row.description && (
                <View className="matrix-bidirectional-rating__description">
                  {row.description}
                </View>
              )}
            </View>
            <ScrollView
              className="matrix-bidirectional-rating__scroll"
              scrollX
            >
              <View className="matrix-bidirectional-rating__table">
                <View className="matrix-bidirectional-rating__head">
                  <View className="matrix-bidirectional-rating__head-label" />
                  {ratingColumns.map(column => (
                    <View
                      key={column.value}
                      className="matrix-bidirectional-rating__column"
                    >
                      {column.label}
                      {column.description && (
                        <View className="matrix-bidirectional-rating__column-tip">
                          {column.description}
                        </View>
                      )}
                    </View>
                  ))}
                </View>
                <View className="matrix-bidirectional-rating__score-row">
                  <View className="matrix-bidirectional-rating__label">
                    {row.leftLabel || leftLabel}
                  </View>
                  {renderStars(row, 'left', rowDisabled)}
                </View>
                <View className="matrix-bidirectional-rating__score-row">
                  <View className="matrix-bidirectional-rating__label">
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

export default MatrixBidirectionalRating;
export type {
  MatrixBidirectionalRatingAnswer,
  MatrixBidirectionalRatingChangePayload,
  MatrixBidirectionalRatingColumn,
  MatrixBidirectionalRatingProps,
  MatrixBidirectionalRatingRow,
  MatrixBidirectionalRatingScore,
  MatrixBidirectionalRatingSide,
  MatrixBidirectionalRatingType,
  MatrixBidirectionalRatingValue,
} from './type';
