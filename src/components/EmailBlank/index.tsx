import React, { useState } from 'react';
import { Input, Text, View } from '@tarojs/components';
import type { EmailBlankProps, EmailBlankRef } from './type';
import { getInputValue, joinClassNames, validateEmailValue } from './util';
import './style.less';

/**
 * 邮箱填空组件。内置邮箱格式校验，格式不正确时展示错误提示。
 */
const EmailBlank = React.forwardRef<EmailBlankRef, EmailBlankProps>((props, ref) => {
  const {
    questionId,
    value,
    defaultValue = '',
    label,
    placeholder = '请输入邮箱',
    disabled = false,
    required = false,
    maxlength = 120,
    requiredMessage = '请输入邮箱',
    errorMessage = '请输入正确的邮箱',
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
    validate?.(nextValue) || validateEmailValue(nextValue, required, requiredMessage, errorMessage);

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
    <View className={joinClassNames(['email-blank', className])}>
      {label && <View className="email-blank__label">{label}</View>}
      <View
        className={joinClassNames([
          'email-blank__field',
          focused && 'email-blank__field--focused',
          error && 'email-blank__field--error',
          disabled && 'email-blank__field--disabled',
        ])}
      >
        <Input
          className={joinClassNames(['email-blank__input', inputClassName])}
          value={currentValue}
          type="text"
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
      {error && <Text className="email-blank__error">{error}</Text>}
    </View>
  );
});

export default EmailBlank;
export type {
  EmailBlankChangePayload,
  EmailBlankProps,
  EmailBlankRef,
  EmailBlankSubmitValue,
  EmailBlankType,
} from './type';
