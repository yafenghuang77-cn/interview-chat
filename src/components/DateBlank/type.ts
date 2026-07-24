import type React from 'react';
import type { QUESTION_COMPONENT_TYPE } from '../../common/constants';

export type DateBlankType = typeof QUESTION_COMPONENT_TYPE.DATE_BLANK;

export interface DateBlankChangePayload {
  value: string;
}

export interface DateBlankSubmitValue {
  questionId: string;
  value: string | null;
}

export interface DateBlankRef {
  init: (value?: string | null) => void;
  getSubmitValue: () => DateBlankSubmitValue;
}

export type DateBlankMode = 'date' | 'datetime';

export interface DateBlankProps {
  type?: DateBlankType;
  questionId: string;
  mode?: DateBlankMode;
  value?: string | null;
  defaultValue?: string | null;
  label?: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  start?: string;
  end?: string;
  fields?: 'year' | 'month' | 'day';
  yearRange?: number[];
  className?: string;
  fieldClassName?: string;
  onChange?: (value: string, payload: DateBlankChangePayload) => void;
}
