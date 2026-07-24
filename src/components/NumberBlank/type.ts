import type { InputProps } from '@tarojs/components';
import type React from 'react';
import type { QUESTION_COMPONENT_TYPE } from '../../common/constants';

/** NumberBlank 对应的题目类型常量。 */
export type NumberBlankType = typeof QUESTION_COMPONENT_TYPE.NUMBER_BLANK;

/** Number Blank 组件 onChange 回调的上下文信息。 */
export interface NumberBlankChangePayload {
  value: string;
  valid: boolean;
  error: string;
}

/** Number Blank 组件提交给业务层的数据结构。 */
export interface NumberBlankSubmitValue {
  questionId: string;
  value: string;
}

/** Number Blank 组件暴露给父级的命令式方法，用于编辑回显和提交取值。 */
export interface NumberBlankRef {
  init: (value?: string) => void;
  getSubmitValue: () => NumberBlankSubmitValue;
}

/** 数值填空组件。内置数字格式、最小值和最大值校验。 */
export interface NumberBlankProps {
  type?: NumberBlankType;
  questionId: string;
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
