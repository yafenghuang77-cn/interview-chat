import React, { useState } from 'react';
import { Textarea, View } from '@tarojs/components';
import type { TextBlankProps } from './type';
import { getInputValue, getTextAreaHeight, joinClassNames } from './util';
import './style.less';

const TextBlank: React.FC<TextBlankProps> = props => {
  const {
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
};

export default TextBlank;
export type {
  TextBlankChangePayload,
  TextBlankProps,
  TextBlankType,
} from './type';
