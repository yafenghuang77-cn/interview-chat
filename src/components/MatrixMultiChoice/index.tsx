import React, { useState } from 'react';
import { ScrollView, Text, View } from '@tarojs/components';
import type {
  MatrixMultiChoiceColumn,
  MatrixMultiChoiceProps,
  MatrixMultiChoiceRow,
  MatrixMultiChoiceValue,
} from './type';
import {
  getMultiAnswerValue,
  getRecordKey,
  joinClassNames,
  toggleMatrixValue,
} from './util';
import './style.less';

const MatrixMultiChoice = <
  R extends MatrixMultiChoiceValue = MatrixMultiChoiceValue,
  C extends MatrixMultiChoiceValue = MatrixMultiChoiceValue,
>(
  props: MatrixMultiChoiceProps<R, C>,
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

  const handleToggle = (
    row: MatrixMultiChoiceRow<R>,
    column: MatrixMultiChoiceColumn<C>,
  ): void => {
    if (disabled || row.disabled || column.disabled) {
      return;
    }

    const { nextValue, checked } = toggleMatrixValue(
      currentValue,
      row.value,
      column.value,
    );

    if (value === undefined) {
      setInnerValue(nextValue);
    }

    onChange?.(nextValue, {
      row,
      column,
      checked,
      value: nextValue,
    });
  };

  return (
    <View className={joinClassNames(['matrix-multi-choice', className])}>
      <ScrollView className="matrix-multi-choice__scroll" scrollX>
        <View className="matrix-multi-choice__table">
          <View className="matrix-multi-choice__row matrix-multi-choice__head">
            <View className="matrix-multi-choice__corner" />
            {columns.map(column => (
              <View
                key={getRecordKey(column.value)}
                className="matrix-multi-choice__column"
              >
                {column.label}
              </View>
            ))}
          </View>
          {rows.map(row => (
            <View
              key={getRecordKey(row.value)}
              className={joinClassNames([
                'matrix-multi-choice__row',
                row.disabled && 'matrix-multi-choice__row--disabled',
              ])}
            >
              <View className="matrix-multi-choice__row-title">
                <View>{row.label}</View>
                {row.description && (
                  <View className="matrix-multi-choice__description">
                    {row.description}
                  </View>
                )}
              </View>
              {columns.map(column => {
                const selectedValues = getMultiAnswerValue(
                  currentValue,
                  row.value,
                );
                const checked = selectedValues.includes(column.value);
                const cellDisabled = disabled || row.disabled || column.disabled;

                return (
                  <View
                    key={getRecordKey(column.value)}
                    className={joinClassNames([
                      'matrix-multi-choice__cell',
                      checked && 'matrix-multi-choice__cell--checked',
                      cellDisabled && 'matrix-multi-choice__cell--disabled',
                    ])}
                    onClick={() => handleToggle(row, column)}
                  >
                    <View
                      className={joinClassNames([
                        'matrix-multi-choice__checkbox',
                        checked && 'matrix-multi-choice__checkbox--checked',
                      ])}
                    >
                      {checked && (
                        <Text className="matrix-multi-choice__check">✓</Text>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default MatrixMultiChoice;
export type {
  MatrixMultiChoiceAnswer,
  MatrixMultiChoiceChangePayload,
  MatrixMultiChoiceColumn,
  MatrixMultiChoiceProps,
  MatrixMultiChoiceRow,
  MatrixMultiChoiceType,
  MatrixMultiChoiceValue,
} from './type';
