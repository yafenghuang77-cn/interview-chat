import type React from 'react';
import type { QUESTION_COMPONENT_TYPE } from '../../common/constants';

/** MultiBlank 对应的题目类型常量。 */
export type MultiBlankType = typeof QUESTION_COMPONENT_TYPE.MULTI_BLANK;

/** Multi Blank 组件 onChange 回调的上下文信息。 */
export interface MultiBlankChangePayload {
  value: string[];
  index?: number;
}

/** Multi Blank 组件提交给业务层的数据结构。 */
export interface MultiBlankSubmitValue {
  questionId: string;
  value: string[];
}

/** Multi Blank 组件暴露给父级的命令式方法，用于编辑回显和提交取值。 */
export interface MultiBlankRef {
  init: (value?: string[]) => void;
  getSubmitValue: () => MultiBlankSubmitValue;
}

/** 多项填空中单个固定填空项的配置。 */
export interface MultiBlankItem {
  label: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
}

/** 多项填空组件。用于固定文案对应固定输入框的场景，不提供新增/删除项能力。 */
export interface MultiBlankProps {
  type?: MultiBlankType;
  questionId: string;
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
