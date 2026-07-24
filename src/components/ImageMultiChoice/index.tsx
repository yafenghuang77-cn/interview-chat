import React, { useState } from 'react';
import { Image, Text, View } from '@tarojs/components';
import type { ImageMultiChoiceOption, ImageMultiChoiceProps } from './type';
import { joinClassNames } from './util';
import './style.less';

const ImageMultiChoice = <T extends string | number = string | number>(
  props: ImageMultiChoiceProps<T>,
): React.ReactElement => {
  const {
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
                <View className="image-multi-choice__label">
                  {option.label}
                </View>
                {option.description && (
                  <View className="image-multi-choice__description">
                    {option.description}
                  </View>
                )}
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default ImageMultiChoice;
export type {
  ImageMultiChoiceChangePayload,
  ImageMultiChoiceOption,
  ImageMultiChoiceProps,
  ImageMultiChoiceValue,
} from './type';
