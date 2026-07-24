import React, { useState } from 'react';
import { Textarea, View } from '@tarojs/components';
import type { TextBlankProps, TextBlankRef } from './type';
import { getInputValue, getTextAreaHeight, joinClassNames } from './util';
import './style.less';

/**
 * 文本填空组件。用于多行文本输入，支持默认行数、自动增高、编辑回显和提交取值。
 */
const TextBlank = React.forwardRef<TextBlankRef, TextBlankProps>((props, ref) => {
  const {
    questionId,
    value,
    defaultValue = '',
    label,
    placeholder = '请输入文本',
    disabled = false,
    maxlength = 140,
    rows = 2,
    autoHeight = false,
    confirmType = 'done',
    className = '',
    inputClassName = '',
    onChange,
  } = props;
  const [innerValue, setInnerValue] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const currentValue = value !== undefined ? value : innerValue;

  React.useImperativeHandle(
    ref,
    () => ({
      init: nextValue => setInnerValue(nextValue || ''),
      getSubmitValue: () => ({
        questionId,
        value: currentValue,
      }),
    }),
    [currentValue, questionId],
  );

  return (
    <View className={joinClassNames(['text-blank', className])}>
      {label && <View className="text-blank__label">{label}</View>}
      <View
        className={joinClassNames([
          'text-blank__field',
          focused && 'text-blank__field--focused',
          disabled && 'text-blank__field--disabled',
        ])}
      >
        <Textarea
          className={joinClassNames(['text-blank__input', inputClassName])}
          style={{ height: `${getTextAreaHeight(rows)}px` }}
          value={currentValue}
          disabled={disabled}
          maxlength={maxlength}
          autoHeight={autoHeight}
          confirmType={confirmType}
          placeholder={placeholder}
          placeholderStyle="color: #b0b0b0;"
          showConfirmBar={false}
          disableDefaultPadding
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onInput={event => {
            const nextValue = getInputValue(event);

            if (value === undefined) {
              setInnerValue(nextValue);
            }

            onChange?.(nextValue, { value: nextValue });
          }}
        />
      </View>
    </View>
  );
});

export default TextBlank;
export type {
  TextBlankChangePayload,
  TextBlankProps,
  TextBlankRef,
  TextBlankSubmitValue,
  TextBlankType,
} from './type';
