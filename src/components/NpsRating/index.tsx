import React, { useState } from 'react';
import { ScrollView, View } from '@tarojs/components';
import HeartIcon from '../HeartIcon';
import type { NpsRatingOption, NpsRatingProps, NpsRatingRef } from './type';
import { getOptionKey, isHeartActive, joinClassNames } from './util';
import './style.less';

/**
 * NPS 推荐度组件。使用爱心展示分值，选中后按分值点亮对应数量的爱心。
 */
const NpsRating = React.forwardRef<NpsRatingRef, NpsRatingProps>((props, ref) => {
  const {
    questionId,
    options,
    value,
    defaultValue = null,
    disabled = false,
    lowLabel,
    highLabel,
    className = '',
    onChange,
  } = props;
  const [innerValue, setInnerValue] = useState(defaultValue);
  const currentValue = value !== undefined ? value : innerValue;

  React.useImperativeHandle(
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

  const handleSelect = (option: NpsRatingOption): void => {
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
    <View className={joinClassNames(['nps-rating', className])}>
      <View className="nps-rating__panel">
        <ScrollView className="nps-rating__scroll" scrollX>
          <View className="nps-rating__scale">
            {options.map(option => {
              const checked = isHeartActive(currentValue, option.value);
              const optionDisabled = disabled || option.disabled;

              return (
                <View
                  key={getOptionKey(option.value)}
                  className={joinClassNames([
                    'nps-rating__option',
                    checked && 'nps-rating__option--checked',
                    optionDisabled && 'nps-rating__option--disabled',
                  ])}
                  onClick={() => handleSelect(option)}
                >
                  <View className="nps-rating__heart">
                    <HeartIcon active={checked} disabled={optionDisabled} size={36} />
                  </View>
                  <View className="nps-rating__value">{option.label}</View>
                  {option.description && (
                    <View className="nps-rating__description">{option.description}</View>
                  )}
                </View>
              );
            })}
          </View>
        </ScrollView>
        {(lowLabel || highLabel) && (
          <View className="nps-rating__labels">
            <View className="nps-rating__label">{lowLabel}</View>
            <View className="nps-rating__label nps-rating__label--right">{highLabel}</View>
          </View>
        )}
      </View>
    </View>
  );
});

export default NpsRating;
export type {
  NpsRatingAnswer,
  NpsRatingChangePayload,
  NpsRatingOption,
  NpsRatingProps,
  NpsRatingRef,
  NpsRatingSubmitValue,
  NpsRatingType,
} from './type';
