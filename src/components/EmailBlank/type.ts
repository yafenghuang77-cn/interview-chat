import type React from 'react';
import type { QUESTION_COMPONENT_TYPE } from '../../common/constants';

export type EmailBlankType = typeof QUESTION_COMPONENT_TYPE.EMAIL_BLANK;

export interface EmailBlankChangePayload {
  value: string;
  valid: boolean;
  error: string;
}

export interface EmailBlankProps {
  type?: EmailBlankType;
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
  onChange?: (value: string, payload: EmailBlankChangePayload) => void;
}
