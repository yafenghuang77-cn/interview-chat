import React, { useState } from 'react';
import { Input, Text, View } from '@tarojs/components';
import type { PhoneBlankProps, PhoneBlankRef } from './type';
import { getInputValue, joinClassNames, normalizePhoneValue, validatePhoneValue } from './util';
import './style.less';

/**
 * 手机号填空组件。内置中国大陆 11 位手机号校验，格式不正确时展示错误提示。
 */
const PhoneBlank = React.forwardRef<PhoneBlankRef, PhoneBlankProps>((props, ref) => {
  const {
    questionId,
    value,
    defaultValue = '',
    label,
    placeholder = '请输入手机号',
    disabled = false,
    required = false,
    maxlength = 11,
    requiredMessage = '请输入手机号',
    errorMessage = '请输入正确的手机号',
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
    validate?.(nextValue) || validatePhoneValue(nextValue, required, requiredMessage, errorMessage);

  const emitChange = (nextValue: string, nextError: string): void => {
    onChange?.(nextValue, {
      value: nextValue,
      valid: !nextError,
      error: nextError,
    });
  };

  React.useImperativeHandle(
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
    <View className={joinClassNames(['phone-blank', className])}>
      {label && <View className="phone-blank__label">{label}</View>}
      <View
        className={joinClassNames([
          'phone-blank__field',
          focused && 'phone-blank__field--focused',
          error && 'phone-blank__field--error',
          disabled && 'phone-blank__field--disabled',
        ])}
      >
        <Input
          className={joinClassNames(['phone-blank__input', inputClassName])}
          value={currentValue}
          type="number"
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
            const nextValue = normalizePhoneValue(getInputValue(event));
            const nextError = error ? validateValue(nextValue) : '';

            if (value === undefined) {
              setInnerValue(nextValue);
            }

            setError(nextError);
            emitChange(nextValue, nextError);
          }}
        />
      </View>
      {error && <Text className="phone-blank__error">{error}</Text>}
    </View>
  );
});

export default PhoneBlank;
export type {
  PhoneBlankChangePayload,
  PhoneBlankProps,
  PhoneBlankRef,
  PhoneBlankSubmitValue,
  PhoneBlankType,
} from './type';
