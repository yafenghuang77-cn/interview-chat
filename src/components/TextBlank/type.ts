import type { TextareaProps } from '@tarojs/components';
import type React from 'react';
import type { QUESTION_COMPONENT_TYPE } from '../../common/constants';

export type TextBlankType = typeof QUESTION_COMPONENT_TYPE.TEXT_BLANK;

export interface TextBlankChangePayload {
  value: string;
}

export interface TextBlankProps {
  type?: TextBlankType;
  value?: string;
  defaultValue?: string;
  label?: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  maxlength?: number;
  rows?: number;
  autoHeight?: boolean;
  confirmType?: TextareaProps['confirmType'];
  className?: string;
  inputClassName?: string;
  onChange?: (value: string, payload: TextBlankChangePayload) => void;
}
