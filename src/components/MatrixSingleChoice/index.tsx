import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { ScrollView, View } from '@tarojs/components';
import type {
  MatrixSingleChoiceColumn,
  MatrixSingleChoiceProps,
  MatrixSingleChoiceRef,
  MatrixSingleChoiceRow,
  MatrixSingleChoiceValue,
} from './type';
import { getRecordKey, getSingleAnswerValue, joinClassNames } from './util';
import './style.less';

const MatrixSingleChoiceInner = <
  R extends MatrixSingleChoiceValue = MatrixSingleChoiceValue,
  C extends MatrixSingleChoiceValue = MatrixSingleChoiceValue,
>(
  props: MatrixSingleChoiceProps<R, C>,
  ref: React.ForwardedRef<MatrixSingleChoiceRef<R, C>>,
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

  useImperativeHandle(
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

  const handleSelect = (
    row: MatrixSingleChoiceRow<R>,
    column: MatrixSingleChoiceColumn<C>,
  ): void => {
    if (disabled || row.disabled || column.disabled) {
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
      column,
      value: nextValue,
    });
  };

  return (
    <View className={joinClassNames(['matrix-single-choice', className])}>
      <ScrollView className="matrix-single-choice__scroll" scrollX>
        <View className="matrix-single-choice__table">
          <View className="matrix-single-choice__row matrix-single-choice__head">
            <View className="matrix-single-choice__corner" />
            {columns.map(column => (
              <View key={getRecordKey(column.value)} className="matrix-single-choice__column">
                {column.label}
              </View>
            ))}
          </View>
          {rows.map(row => (
            <View
              key={getRecordKey(row.value)}
              className={joinClassNames([
                'matrix-single-choice__row',
                row.disabled && 'matrix-single-choice__row--disabled',
              ])}
            >
              <View className="matrix-single-choice__row-title">
                <View>{row.label}</View>
                {row.description && (
                  <View className="matrix-single-choice__description">{row.description}</View>
                )}
              </View>
              {columns.map(column => {
                const checked = getSingleAnswerValue(currentValue, row.value) === column.value;
                const cellDisabled = disabled || row.disabled || column.disabled;

                return (
                  <View
                    key={getRecordKey(column.value)}
                    className={joinClassNames([
                      'matrix-single-choice__cell',
                      checked && 'matrix-single-choice__cell--checked',
                      cellDisabled && 'matrix-single-choice__cell--disabled',
                    ])}
                    onClick={() => handleSelect(row, column)}
                  >
                    <View
                      className={joinClassNames([
                        'matrix-single-choice__radio',
                        checked && 'matrix-single-choice__radio--checked',
                      ])}
                    >
                      {checked && <View className="matrix-single-choice__radio-dot" />}
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

const MatrixSingleChoice = forwardRef(MatrixSingleChoiceInner) as <
  R extends MatrixSingleChoiceValue = MatrixSingleChoiceValue,
  C extends MatrixSingleChoiceValue = MatrixSingleChoiceValue,
>(
  props: MatrixSingleChoiceProps<R, C> & React.RefAttributes<MatrixSingleChoiceRef<R, C>>,
) => React.ReactElement;

export default MatrixSingleChoice;
export type {
  MatrixSingleChoiceAnswer,
  MatrixSingleChoiceChangePayload,
  MatrixSingleChoiceColumn,
  MatrixSingleChoiceProps,
  MatrixSingleChoiceRef,
  MatrixSingleChoiceRow,
  MatrixSingleChoiceSubmitValue,
  MatrixSingleChoiceType,
  MatrixSingleChoiceValue,
} from './type';
