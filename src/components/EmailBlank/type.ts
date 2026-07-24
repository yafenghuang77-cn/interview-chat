import type React from 'react';
import type { QUESTION_COMPONENT_TYPE } from '../../common/constants';

/** EmailBlank 对应的题目类型常量。 */
export type EmailBlankType = typeof QUESTION_COMPONENT_TYPE.EMAIL_BLANK;

/** Email Blank 组件 onChange 回调的上下文信息。 */
export interface EmailBlankChangePayload {
  value: string;
  valid: boolean;
  error: string;
}

/** Email Blank 组件提交给业务层的数据结构。 */
export interface EmailBlankSubmitValue {
  questionId: string;
  value: string;
}

/** Email Blank 组件暴露给父级的命令式方法，用于编辑回显和提交取值。 */
export interface EmailBlankRef {
  init: (value?: string) => void;
  getSubmitValue: () => EmailBlankSubmitValue;
}

/** 邮箱填空组件。内置邮箱格式校验，格式不正确时展示错误提示。 */
export interface EmailBlankProps {
  type?: EmailBlankType;
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
  onChange?: (value: string, payload: EmailBlankChangePayload) => void;
}
