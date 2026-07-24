import type React from 'react';
import type { QUESTION_COMPONENT_TYPE } from '../../common/constants';

export type DateBlankType = typeof QUESTION_COMPONENT_TYPE.DATE_BLANK;

export interface DateBlankChangePayload {
  value: string;
}

export type DateBlankMode = 'date' | 'datetime';

export interface DateBlankProps {
  type?: DateBlankType;
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
