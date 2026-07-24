import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Input, View } from '@tarojs/components';
import type { MultiBlankProps, MultiBlankRef } from './type';
import { createBlankItems, getInputValue, joinClassNames } from './util';
import './style.less';

const MultiBlank = forwardRef<MultiBlankRef, MultiBlankProps>((props, ref) => {
  const {
    questionId,
    items,
    value,
    defaultValue,
    label,
    placeholder = '请输入内容',
    disabled = false,
    maxlength = 140,
    className = '',
    itemClassName = '',
    inputClassName = '',
    onChange,
  } = props;
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [innerValue, setInnerValue] = useState(() => createBlankItems(defaultValue, items.length));
  const currentValue = value !== undefined ? createBlankItems(value, items.length) : innerValue;

  useImperativeHandle(
    ref,
    () => ({
      init: nextValue => setInnerValue(createBlankItems(nextValue, items.length)),
      getSubmitValue: () => ({
        questionId,
        value: currentValue,
      }),
    }),
    [currentValue, items.length, questionId],
  );

  const commitValue = (nextValue: string[], index?: number): void => {
    if (value === undefined) {
      setInnerValue(nextValue);
    }

    onChange?.(nextValue, { value: nextValue, index });
  };

  return (
    <View className={joinClassNames(['multi-blank', className])}>
      {label && <View className="multi-blank__label">{label}</View>}
      <View className="multi-blank__list">
        {items.map((item, index) => {
          const itemDisabled = disabled || item.disabled;

          return (
            <View
              key={`${index}-${item.label}`}
              className={joinClassNames(['multi-blank__item', itemClassName])}
            >
              <View className="multi-blank__item-label">{item.label}</View>
              <View
                className={joinClassNames([
                  'multi-blank__field',
                  focusedIndex === index && 'multi-blank__field--focused',
                  itemDisabled && 'multi-blank__field--disabled',
                ])}
              >
                <Input
                  className={joinClassNames(['multi-blank__input', inputClassName])}
                  value={currentValue[index] || ''}
                  type="text"
                  disabled={itemDisabled}
                  maxlength={maxlength}
                  confirmType="done"
                  cursorColor="#07c160"
                  placeholder={item.placeholder || placeholder}
                  placeholderStyle="color: #b0b0b0;"
                  onFocus={() => setFocusedIndex(index)}
                  onBlur={() => setFocusedIndex(null)}
                  onInput={event => {
                    const nextValue = [...currentValue];

                    nextValue[index] = getInputValue(event);
                    commitValue(nextValue, index);
                  }}
                />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
});

export default MultiBlank;
export type {
  MultiBlankChangePayload,
  MultiBlankItem,
  MultiBlankProps,
  MultiBlankRef,
  MultiBlankSubmitValue,
  MultiBlankType,
} from './type';
