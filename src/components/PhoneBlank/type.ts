import type React from 'react';
import type { QUESTION_COMPONENT_TYPE } from '../../common/constants';

export type PhoneBlankType = typeof QUESTION_COMPONENT_TYPE.PHONE_BLANK;

export interface PhoneBlankChangePayload {
  value: string;
  valid: boolean;
  error: string;
}

export interface PhoneBlankSubmitValue {
  questionId: string;
  value: string;
}

export interface PhoneBlankRef {
  init: (value?: string) => void;
  getSubmitValue: () => PhoneBlankSubmitValue;
}

export interface PhoneBlankProps {
  type?: PhoneBlankType;
  questionId: string;
  value?: string;
  defaultValue?: string;
  label?: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  maxlength?: number;
  requiredMessage?: string;
  errorMessage?: string;
  className?: string;
  inputClassName?: string;
  validate?: (value: string) => string;
  onChange?: (value: string, payload: PhoneBlankChangePayload) => void;
}
