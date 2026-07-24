import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { ScrollView, View } from '@tarojs/components';
import StarIcon from '../StarIcon';
import type { RatingOption, RatingProps, RatingRef } from './type';
import { getOptionKey, getRatingValue, joinClassNames } from './util';
import './style.less';

const Rating = forwardRef<RatingRef, RatingProps>((props, ref) => {
  const {
    questionId,
    options,
    value,
    defaultValue = null,
    disabled = false,
    className = '',
    onChange,
  } = props;
  const [innerValue, setInnerValue] = useState(defaultValue);
  const currentValue = value !== undefined ? value : innerValue;
  const selectedScore = getRatingValue(currentValue);

  useImperativeHandle(
    ref,
    () => ({
      init: nextValue => setInnerValue(nextValue ?? null),
      getSubmitValue: () => ({
        questionId,
        value: currentValue,
      }),
    }),
    [currentValue, questionId],
  );

  const handleSelect = (option: RatingOption): void => {
    const optionDisabled = disabled || option.disabled;

    if (optionDisabled) {
      return;
    }

    if (value === undefined) {
      setInnerValue(option.value);
    }

    onChange?.(option.value, {
      option,
      value: option.value,
    });
  };

  return (
    <View className={joinClassNames(['rating', className])}>
      <View className="rating__panel">
        <ScrollView className="rating__scroll" scrollX>
          <View className="rating__scale">
            {options.map(option => {
              const checked = option.value <= selectedScore;
              const optionDisabled = disabled || option.disabled;

              return (
                <View
                  key={getOptionKey(option.value)}
                  className={joinClassNames([
                    'rating__option',
                    checked && 'rating__option--checked',
                    optionDisabled && 'rating__option--disabled',
                  ])}
                  onClick={() => handleSelect(option)}
                >
                  <View className="rating__star">
                    <StarIcon active={checked} disabled={optionDisabled} size={38} />
                  </View>
                  <View className="rating__label">{option.label}</View>
                  {option.description && (
                    <View className="rating__description">{option.description}</View>
                  )}
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
});

export default Rating;
export type {
  RatingAnswer,
  RatingChangePayload,
  RatingOption,
  RatingProps,
  RatingRef,
  RatingSubmitValue,
  RatingType,
} from './type';
