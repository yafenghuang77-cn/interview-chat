import React, { useState } from 'react';
import { Text, View } from '@tarojs/components';
import type { MultiChoiceOption, MultiChoiceProps, MultiChoiceRef } from './type';
import { joinClassNames } from './util';
import './style.less';

/**
 * 文字多选组件。用于在一组选项中选择多个答案，支持受控、非受控、编辑回显和提交取值。
 */
const MultiChoiceInner = <T extends string | number = string | number>(
  props: MultiChoiceProps<T>,
  ref: React.ForwardedRef<MultiChoiceRef<T>>,
): React.ReactElement => {
  const {
    questionId,
    options,
    value,
    defaultValue = [],
    disabled = false,
    className = '',
    optionClassName = '',
    onChange,
  } = props;
  const [innerValue, setInnerValue] = useState<T[]>(defaultValue);
  const selectedValue = value !== undefined ? value : innerValue;

  React.useImperativeHandle(
    ref,
    () => ({
      init: nextValue => setInnerValue(nextValue || []),
      getSubmitValue: () => ({
        questionId,
        value: selectedValue,
      }),
    }),
    [questionId, selectedValue],
  );

  const handleToggle = (option: MultiChoiceOption<T>): void => {
    const optionDisabled = disabled || option.disabled;

    if (optionDisabled) {
      return;
    }

    const checked = selectedValue.includes(option.value);
    const nextValue = checked
      ? selectedValue.filter(item => item !== option.value)
      : [...selectedValue, option.value];

    if (value === undefined) {
      setInnerValue(nextValue);
    }

    onChange?.(nextValue);
  };

  return (
    <View className={joinClassNames(['multi-choice', className])}>
      {options.map(option => {
        const checked = selectedValue.includes(option.value);
        const optionDisabled = disabled || option.disabled;

        return (
          <View
            key={option.value}
            className={joinClassNames([
              'multi-choice__option',
              checked && 'multi-choice__option--checked',
              optionDisabled && 'multi-choice__option--disabled',
              optionClassName,
            ])}
            onClick={() => handleToggle(option)}
          >
            <View
              className={joinClassNames([
                'multi-choice__indicator',
                checked && 'multi-choice__indicator--checked',
              ])}
            >
              {checked && <Text className="multi-choice__check">✓</Text>}
            </View>

            <View className="multi-choice__content">
              <View className="multi-choice__label">{option.label}</View>
              {option.description && (
                <View className="multi-choice__description">{option.description}</View>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};

const MultiChoice = React.forwardRef(MultiChoiceInner) as <
  T extends string | number = string | number,
>(
  props: MultiChoiceProps<T> & React.RefAttributes<MultiChoiceRef<T>>,
) => React.ReactElement;

export default MultiChoice;
export type {
  MultiChoiceChangePayload,
  MultiChoiceOption,
  MultiChoiceProps,
  MultiChoiceRef,
  MultiChoiceSubmitValue,
  MultiChoiceValue,
} from './type';
