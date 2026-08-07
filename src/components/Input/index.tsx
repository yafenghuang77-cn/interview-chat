import {
  Input as TaroInput,
  Text,
  View,
  type InputProps as TaroInputProps,
} from '@tarojs/components';
import type { ReactNode } from 'react';

import './style.less';

type InputChangeEvent = Parameters<NonNullable<TaroInputProps['onInput']>>[0];

export interface InputProps extends Omit<
  TaroInputProps,
  'className' | 'maxlength' | 'onChange' | 'onInput' | 'title' | 'value'
> {
  /** Custom title rendered above the control. */
  title?: ReactNode;
  /** Backward-compatible alias for title. */
  label?: ReactNode;
  /** Space between the title and control. Defaults to 12px. */
  titleGap?: number | string;
  /** Marks the field as required and displays a required indicator. */
  required?: boolean;
  /** Controlled input value. */
  value?: string;
  /** Ant Design-style change callback. */
  onChange?: (event: InputChangeEvent) => void;
  /** Maximum number of characters accepted by the control. */
  maxLength?: number;
  /** Additional class name applied to the field wrapper. */
  className?: string;
}

const Input = ({
  title,
  label,
  titleGap = 12,
  required = false,
  value = '',
  onChange,
  maxLength,
  disabled = false,
  className = '',
  ...inputProps
}: InputProps) => {
  const titleContent = title ?? label;
  const titleStyle = {
    marginBottom: typeof titleGap === 'number' ? `${titleGap}px` : titleGap,
  };
  const fieldClassName = ['input-field', disabled ? 'input-field--disabled' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <View className={fieldClassName}>
      {titleContent !== undefined && titleContent !== null ? (
        <View className="input-field__title" style={titleStyle}>
          {required ? <Text className="input-field__required">*</Text> : null}
          {typeof titleContent === 'string' || typeof titleContent === 'number' ? (
            <Text>{titleContent}</Text>
          ) : (
            titleContent
          )}
        </View>
      ) : null}
      <TaroInput
        {...inputProps}
        className="input-field__control"
        value={value}
        maxlength={maxLength}
        disabled={disabled}
        onInput={onChange}
      />
    </View>
  );
};

export default Input;
