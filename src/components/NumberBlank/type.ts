import type { InputProps } from '@tarojs/components';
import type React from 'react';
import type { QUESTION_COMPONENT_TYPE } from '../../common/constants';

export type NumberBlankType = typeof QUESTION_COMPONENT_TYPE.NUMBER_BLANK;

export interface NumberBlankChangePayload {
  value: string;
  valid: boolean;
  error: string;
}

export interface NumberBlankProps {
  type?: NumberBlankType;
  value?: string;
  defaultValue?: string;
  label?: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  maxlength?: number;
  inputType?: Extract<InputProps['type'], 'number' | 'digit'>;
  min?: number;
  max?: number;
  requiredMessage?: string;
  errorMessage?: string;
  minMessage?: string;
  maxMessage?: string;
  className?: string;
  inputClassName?: string;
  validate?: (value: string) => string;
  onChange?: (value: string, payload: NumberBlankChangePayload) => void;
}
