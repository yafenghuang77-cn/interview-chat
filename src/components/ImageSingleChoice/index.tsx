import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Image, View } from '@tarojs/components';
import type { ImageSingleChoiceOption, ImageSingleChoiceProps, ImageSingleChoiceRef } from './type';
import { joinClassNames } from './util';
import './style.less';

const ImageSingleChoiceInner = <T extends string | number = string | number>(
  props: ImageSingleChoiceProps<T>,
  ref: React.ForwardedRef<ImageSingleChoiceRef<T>>,
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

  const handleSelect = (option: ImageSingleChoiceOption<T>): void => {
    const optionDisabled = disabled || option.disabled;

    if (optionDisabled) {
      return;
    }

    if (value === undefined) {
      setInnerValue(option.value);
    }

    onChange?.(option.value, {
      option,
      checked: true,
    });
  };

  return (
    <View className={joinClassNames(['image-single-choice', className])}>
      {options.map(option => {
        const checked = selectedValue === option.value;
        const optionDisabled = disabled || option.disabled;

        return (
          <View
            key={option.value}
            className={joinClassNames([
              'image-single-choice__option',
              checked && 'image-single-choice__option--checked',
              optionDisabled && 'image-single-choice__option--disabled',
              optionClassName,
            ])}
            onClick={() => handleSelect(option)}
          >
            <Image
              className="image-single-choice__image"
              src={option.image}
              mode={option.imageMode || 'aspectFill'}
              ariaLabel={option.imageAlt}
            />

            <View className="image-single-choice__footer">
              <View
                className={joinClassNames([
                  'image-single-choice__indicator',
                  checked && 'image-single-choice__indicator--checked',
                ])}
              >
                {checked && <View className="image-single-choice__indicator-dot" />}
              </View>

              <View className="image-single-choice__content">
                <View className="image-single-choice__label">{option.label}</View>
                {option.description && (
                  <View className="image-single-choice__description">{option.description}</View>
                )}
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const ImageSingleChoice = forwardRef(ImageSingleChoiceInner) as <
  T extends string | number = string | number,
>(
  props: ImageSingleChoiceProps<T> & React.RefAttributes<ImageSingleChoiceRef<T>>,
) => React.ReactElement;

export default ImageSingleChoice;
export type {
  ImageSingleChoiceChangePayload,
  ImageSingleChoiceOption,
  ImageSingleChoiceProps,
  ImageSingleChoiceRef,
  ImageSingleChoiceSubmitValue,
  ImageSingleChoiceValue,
} from './type';
