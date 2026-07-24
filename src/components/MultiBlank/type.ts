import type React from 'react';
import type { QUESTION_COMPONENT_TYPE } from '../../common/constants';

export type MultiBlankType = typeof QUESTION_COMPONENT_TYPE.MULTI_BLANK;

export interface MultiBlankChangePayload {
  value: string[];
  index?: number;
}

export interface MultiBlankItem {
  label: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
}

export interface MultiBlankProps {
  type?: MultiBlankType;
  items: MultiBlankItem[];
  value?: string[];
  defaultValue?: string[];
  label?: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  maxlength?: number;
  className?: string;
  itemClassName?: string;
  inputClassName?: string;
  onChange?: (value: string[], payload: MultiBlankChangePayload) => void;
}
