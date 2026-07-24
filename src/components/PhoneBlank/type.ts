import type React from 'react';
import type { QUESTION_COMPONENT_TYPE } from '../../common/constants';

/** PhoneBlank 对应的题目类型常量。 */
export type PhoneBlankType = typeof QUESTION_COMPONENT_TYPE.PHONE_BLANK;

/** Phone Blank 组件 onChange 回调的上下文信息。 */
export interface PhoneBlankChangePayload {
  value: string;
  valid: boolean;
  error: string;
}

/** Phone Blank 组件提交给业务层的数据结构。 */
export interface PhoneBlankSubmitValue {
  questionId: string;
  value: string;
}

/** Phone Blank 组件暴露给父级的命令式方法，用于编辑回显和提交取值。 */
export interface PhoneBlankRef {
  init: (value?: string) => void;
  getSubmitValue: () => PhoneBlankSubmitValue;
}

/** 手机号填空组件。内置中国大陆 11 位手机号校验，格式不正确时展示错误提示。 */
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
