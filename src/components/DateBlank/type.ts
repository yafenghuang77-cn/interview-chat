import type React from 'react';
import type { QUESTION_COMPONENT_TYPE } from '../../common/constants';

/** DateBlank 对应的题目类型常量。 */
export type DateBlankType = typeof QUESTION_COMPONENT_TYPE.DATE_BLANK;

/** Date Blank 组件 onChange 回调的上下文信息。 */
export interface DateBlankChangePayload {
  value: string;
}

/** Date Blank 组件提交给业务层的数据结构。 */
export interface DateBlankSubmitValue {
  questionId: string;
  value: string | null;
}

/** Date Blank 组件暴露给父级的命令式方法，用于编辑回显和提交取值。 */
export interface DateBlankRef {
  init: (value?: string | null) => void;
  getSubmitValue: () => DateBlankSubmitValue;
}

export type DateBlankMode = 'date' | 'datetime';

/** 日期时间填空组件。支持日期模式和年月日时分秒选择回显。 */
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
