import type React from 'react';

export type MultiChoiceValue = string | number;

/** Multi Choice 组件的选项配置。 */
export interface MultiChoiceOption<T extends MultiChoiceValue = MultiChoiceValue> {
  label: React.ReactNode;
  value: T;
  description?: React.ReactNode;
  disabled?: boolean;
}

/** Multi Choice 组件 onChange 回调的上下文信息。 */
export interface MultiChoiceChangePayload<T extends MultiChoiceValue = MultiChoiceValue> {
  option: MultiChoiceOption<T>;
  checked: boolean;
}

/** Multi Choice 组件提交给业务层的数据结构。 */
export interface MultiChoiceSubmitValue<T extends MultiChoiceValue = MultiChoiceValue> {
  questionId: string;
  value: T[];
}

/** Multi Choice 组件暴露给父级的命令式方法，用于编辑回显和提交取值。 */
export interface MultiChoiceRef<T extends MultiChoiceValue = MultiChoiceValue> {
  init: (value?: T[]) => void;
  getSubmitValue: () => MultiChoiceSubmitValue<T>;
}

/** 文字多选组件。用于在一组选项中选择多个答案，支持受控、非受控、编辑回显和提交取值。 */
export interface MultiChoiceProps<T extends MultiChoiceValue = MultiChoiceValue> {
  questionId: string;
  options: Array<MultiChoiceOption<T>>;
  value?: T[];
  defaultValue?: T[];
  disabled?: boolean;
  className?: string;
  optionClassName?: string;
  onChange?: (value: T[]) => void;
}
