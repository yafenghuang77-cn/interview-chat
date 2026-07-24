import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Picker, Text, View, type CommonEvent } from '@tarojs/components';
import type { DateBlankProps, DateBlankRef } from './type';
import {
  createDatetimeRange,
  formatDatetimeValue,
  getDateText,
  getDatetimeIndexes,
  getDatetimeText,
  getDefaultYearRange,
  joinClassNames,
} from './util';
import './style.less';

type DateChangeEvent = CommonEvent<{ value: string }>;
type DatetimeChangeEvent = CommonEvent<{ value: number[] }>;

const DateBlank = forwardRef<DateBlankRef, DateBlankProps>((props, ref) => {
  const {
    questionId,
    mode = 'datetime',
    value,
    defaultValue = null,
    label,
    placeholder = mode === 'datetime' ? '请选择日期时间' : '请选择日期',
    disabled = false,
    start,
    end,
    fields = 'day',
    yearRange = getDefaultYearRange(),
    className = '',
    fieldClassName = '',
    onChange,
  } = props;
  const [innerValue, setInnerValue] = useState<string | null>(defaultValue);
  const currentValue = value !== undefined ? value : innerValue;
  const hasValue = Boolean(currentValue);

  useImperativeHandle(
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

  const handleChange = (event: DateChangeEvent): void => {
    const nextValue = event.detail.value;

    if (value === undefined) {
      setInnerValue(nextValue);
    }

    onChange?.(nextValue, { value: nextValue });
  };

  const datetimeRange = createDatetimeRange(yearRange);
  const datetimeIndexes = getDatetimeIndexes(currentValue, datetimeRange);

  const handleDatetimeChange = (event: DatetimeChangeEvent): void => {
    const nextValue = formatDatetimeValue(event.detail.value, datetimeRange);

    if (value === undefined) {
      setInnerValue(nextValue);
    }

    onChange?.(nextValue, { value: nextValue });
  };

  const renderField = (text: string) => (
    <View
      className={joinClassNames([
        'date-blank__field',
        hasValue && 'date-blank__field--active',
        disabled && 'date-blank__field--disabled',
        fieldClassName,
      ])}
    >
      <Text
        className={joinClassNames([
          'date-blank__text',
          !hasValue && 'date-blank__text--placeholder',
        ])}
      >
        {text}
      </Text>
      {/* <Text className="date-blank__arrow">&gt;</Text> */}
    </View>
  );

  const renderPicker = () => {
    if (mode === 'date') {
      return (
        <Picker
          mode="date"
          value={currentValue || ''}
          start={start}
          end={end}
          fields={fields}
          disabled={disabled}
          onChange={handleChange}
        >
          {renderField(getDateText(currentValue, placeholder))}
        </Picker>
      );
    }

    return (
      <Picker
        mode="multiSelector"
        range={datetimeRange}
        value={datetimeIndexes}
        disabled={disabled}
        onChange={handleDatetimeChange}
      >
        {renderField(getDatetimeText(currentValue, placeholder))}
      </Picker>
    );
  };

  return (
    <View className={joinClassNames(['date-blank', className])}>
      {label && <View className="date-blank__label">{label}</View>}
      {renderPicker()}
    </View>
  );
});

export default DateBlank;
export type {
  DateBlankChangePayload,
  DateBlankMode,
  DateBlankProps,
  DateBlankRef,
  DateBlankSubmitValue,
  DateBlankType,
} from './type';
