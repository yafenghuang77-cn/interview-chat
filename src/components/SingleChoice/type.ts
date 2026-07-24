import type React from 'react';

export type SingleChoiceValue = string | number;

/** Single Choice 组件的选项配置。 */
export interface SingleChoiceOption<T extends SingleChoiceValue = SingleChoiceValue> {
  label: React.ReactNode;
  value: T;
  description?: React.ReactNode;
  disabled?: boolean;
}

/** Single Choice 组件 onChange 回调的上下文信息。 */
export interface SingleChoiceChangePayload<T extends SingleChoiceValue = SingleChoiceValue> {
  option: SingleChoiceOption<T>;
  checked: boolean;
}

/** Single Choice 组件提交给业务层的数据结构。 */
export interface SingleChoiceSubmitValue<T extends SingleChoiceValue = SingleChoiceValue> {
  questionId: string;
  value: T | null;
}

/** Single Choice 组件暴露给父级的命令式方法，用于编辑回显和提交取值。 */
export interface SingleChoiceRef<T extends SingleChoiceValue = SingleChoiceValue> {
  init: (value?: T | null) => void;
  getSubmitValue: () => SingleChoiceSubmitValue<T>;
}

/** 文字单选组件。用于在一组选项中选择一个答案，支持受控、非受控、编辑回显和提交取值。 */
export interface SingleChoiceProps<T extends SingleChoiceValue = SingleChoiceValue> {
  questionId: string;
  options: Array<SingleChoiceOption<T>>;
  value?: T | null;
  defaultValue?: T | null;
  disabled?: boolean;
  className?: string;
  optionClassName?: string;
  onChange?: (value: T) => void;
}
