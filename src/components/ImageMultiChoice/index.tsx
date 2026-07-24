import React, { useState } from 'react';
import { Image, Text, View } from '@tarojs/components';
import type { ImageMultiChoiceOption, ImageMultiChoiceProps, ImageMultiChoiceRef } from './type';
import { joinClassNames } from './util';
import './style.less';

/**
 * 图片多选组件。每个选项垂直排列，上方展示左对齐正方形图片，下方展示选项内容。
 */
const ImageMultiChoiceInner = <T extends string | number = string | number>(
  props: ImageMultiChoiceProps<T>,
  ref: React.ForwardedRef<ImageMultiChoiceRef<T>>,
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

  const handleToggle = (option: ImageMultiChoiceOption<T>): void => {
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

    onChange?.(nextValue, {
      option,
      checked: !checked,
    });
  };

  return (
    <View className={joinClassNames(['image-multi-choice', className])}>
      {options.map(option => {
        const checked = selectedValue.includes(option.value);
        const optionDisabled = disabled || option.disabled;

        return (
          <View
            key={option.value}
            className={joinClassNames([
              'image-multi-choice__option',
              checked && 'image-multi-choice__option--checked',
              optionDisabled && 'image-multi-choice__option--disabled',
              optionClassName,
            ])}
            onClick={() => handleToggle(option)}
          >
            <Image
              className="image-multi-choice__image"
              src={option.image}
              mode={option.imageMode || 'aspectFill'}
              ariaLabel={option.imageAlt}
            />

            <View className="image-multi-choice__footer">
              <View
                className={joinClassNames([
                  'image-multi-choice__indicator',
                  checked && 'image-multi-choice__indicator--checked',
                ])}
              >
                {checked && <Text className="image-multi-choice__check">✓</Text>}
              </View>

              <View className="image-multi-choice__content">
                <View className="image-multi-choice__label">{option.label}</View>
                {option.description && (
                  <View className="image-multi-choice__description">{option.description}</View>
                )}
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const ImageMultiChoice = React.forwardRef(ImageMultiChoiceInner) as <
  T extends string | number = string | number,
>(
  props: ImageMultiChoiceProps<T> & React.RefAttributes<ImageMultiChoiceRef<T>>,
) => React.ReactElement;

export default ImageMultiChoice;
export type {
  ImageMultiChoiceChangePayload,
  ImageMultiChoiceOption,
  ImageMultiChoiceProps,
  ImageMultiChoiceRef,
  ImageMultiChoiceSubmitValue,
  ImageMultiChoiceValue,
} from './type';
