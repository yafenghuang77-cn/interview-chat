import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { View } from '@tarojs/components';
import type { SingleChoiceOption, SingleChoiceProps, SingleChoiceRef } from './type';
import { joinClassNames } from './util';
import './style.less';

const SingleChoiceInner = <T extends string | number = string | number>(
  props: SingleChoiceProps<T>,
  ref: React.ForwardedRef<SingleChoiceRef<T>>,
): React.ReactElement => {
  const {
    questionId,
    options,
    value,
    defaultValue = null,
    disabled = false,
    className = '',
    optionClassName = '',
    onChange,
  } = props;
  const [innerValue, setInnerValue] = useState<T | null>(defaultValue);
  const selectedValue = value !== undefined ? value : innerValue;

  useImperativeHandle(
    ref,
    () => ({
      init: nextValue => setInnerValue(nextValue ?? null),
      getSubmitValue: () => ({
        questionId,
        value: selectedValue,
      }),
    }),
    [questionId, selectedValue],
  );

  const handleSelect = (option: SingleChoiceOption<T>): void => {
    const optionDisabled = disabled || option.disabled;

    if (optionDisabled) {
      return;
    }

    if (value === undefined) {
      setInnerValue(option.value);
    }

    onChange?.(option.value);
  };

  return (
    <View className={joinClassNames(['single-choice', className])}>
      {options.map(option => {
        const checked = selectedValue === option.value;
        const optionDisabled = disabled || option.disabled;

        return (
          <View
            key={option.value}
            className={joinClassNames([
              'single-choice__option',
              checked && 'single-choice__option--checked',
              optionDisabled && 'single-choice__option--disabled',
              optionClassName,
            ])}
            onClick={() => handleSelect(option)}
          >
            <View
              className={joinClassNames([
                'single-choice__indicator',
                checked && 'single-choice__indicator--checked',
              ])}
            >
              {checked && <View className="single-choice__indicator-dot" />}
            </View>

            <View className="single-choice__content">
              <View className="single-choice__label">{option.label}</View>
              {option.description && (
                <View className="single-choice__description">{option.description}</View>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};

const SingleChoice = forwardRef(SingleChoiceInner) as <T extends string | number = string | number>(
  props: SingleChoiceProps<T> & React.RefAttributes<SingleChoiceRef<T>>,
) => React.ReactElement;

export default SingleChoice;
export type {
  SingleChoiceChangePayload,
  SingleChoiceOption,
  SingleChoiceProps,
  SingleChoiceRef,
  SingleChoiceSubmitValue,
  SingleChoiceValue,
} from './type';
