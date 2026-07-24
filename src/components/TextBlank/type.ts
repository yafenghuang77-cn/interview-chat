import type { TextareaProps } from '@tarojs/components';
import type React from 'react';
import type { QUESTION_COMPONENT_TYPE } from '../../common/constants';

/** TextBlank 对应的题目类型常量。 */
export type TextBlankType = typeof QUESTION_COMPONENT_TYPE.TEXT_BLANK;

/** Text Blank 组件 onChange 回调的上下文信息。 */
export interface TextBlankChangePayload {
  value: string;
}

/** Text Blank 组件提交给业务层的数据结构。 */
export interface TextBlankSubmitValue {
  questionId: string;
  value: string;
}

/** Text Blank 组件暴露给父级的命令式方法，用于编辑回显和提交取值。 */
export interface TextBlankRef {
  init: (value?: string) => void;
  getSubmitValue: () => TextBlankSubmitValue;
}

/** 文本填空组件。用于多行文本输入，支持默认行数、自动增高、编辑回显和提交取值。 */
export interface TextBlankProps {
  type?: TextBlankType;
  questionId: string;
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
