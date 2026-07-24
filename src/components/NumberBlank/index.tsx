import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Input, Text, View } from '@tarojs/components';
import type { NumberBlankProps, NumberBlankRef } from './type';
import { getInputValue, joinClassNames, validateNumberValue } from './util';
import './style.less';

const NumberBlank = forwardRef<NumberBlankRef, NumberBlankProps>((props, ref) => {
  const {
    questionId,
    value,
    defaultValue = '',
    label,
    placeholder = '请输入数值',
    disabled = false,
    required = false,
    maxlength = 40,
    inputType = 'digit',
    min,
    max,
    requiredMessage = '请输入数值',
    errorMessage = '请输入正确的数值',
    minMessage,
    maxMessage,
    className = '',
    inputClassName = '',
    validate,
    onChange,
  } = props;
  const [innerValue, setInnerValue] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState('');
  const currentValue = value !== undefined ? value : innerValue;
  const validateValue = (nextValue: string): string =>
    validate?.(nextValue) ||
    validateNumberValue(
      nextValue,
      required,
      requiredMessage,
      errorMessage,
      min,
      max,
      minMessage,
      maxMessage,
    );

  const emitChange = (nextValue: string, nextError: string): void => {
    onChange?.(nextValue, {
      value: nextValue,
      valid: !nextError,
      error: nextError,
    });
  };

  useImperativeHandle(
    ref,
    () => ({
      init: nextValue => {
        setInnerValue(nextValue || '');
        setError('');
      },
      getSubmitValue: () => ({
        questionId,
        value: currentValue,
      }),
    }),
    [currentValue, questionId],
  );

  return (
    <View className={joinClassNames(['number-blank', className])}>
      {label && <View className="number-blank__label">{label}</View>}
      <View
        className={joinClassNames([
          'number-blank__field',
          focused && 'number-blank__field--focused',
          error && 'number-blank__field--error',
          disabled && 'number-blank__field--disabled',
        ])}
      >
        <Input
          className={joinClassNames(['number-blank__input', inputClassName])}
          value={currentValue}
          type={inputType}
          disabled={disabled}
          maxlength={maxlength}
          confirmType="done"
          cursorColor="#07c160"
          placeholder={placeholder}
          placeholderStyle="color: #b0b0b0;"
          onFocus={() => setFocused(true)}
          onBlur={() => {
            const nextError = validateValue(currentValue);

            setFocused(false);
            setError(nextError);
            emitChange(currentValue, nextError);
          }}
          onInput={event => {
            const nextValue = getInputValue(event);
            const nextError = error ? validateValue(nextValue) : '';

            if (value === undefined) {
              setInnerValue(nextValue);
            }

            setError(nextError);
            emitChange(nextValue, nextError);
          }}
        />
      </View>
      {error && <Text className="number-blank__error">{error}</Text>}
    </View>
  );
});

export default NumberBlank;
export type {
  NumberBlankChangePayload,
  NumberBlankProps,
  NumberBlankRef,
  NumberBlankSubmitValue,
  NumberBlankType,
} from './type';
