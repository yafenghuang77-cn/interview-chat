import type React from 'react';
import type { QUESTION_COMPONENT_TYPE } from '../../common/constants';

/** MatrixSingleChoice 对应的题目类型常量。 */
export type MatrixSingleChoiceType = typeof QUESTION_COMPONENT_TYPE.MATRIX_SINGLE_CHOICE;

export type MatrixSingleChoiceValue = string | number;

/** Matrix Single Choice 组件的行配置。 */
export interface MatrixSingleChoiceRow<
  T extends MatrixSingleChoiceValue = MatrixSingleChoiceValue,
> {
  label: React.ReactNode;
  value: T;
  description?: React.ReactNode;
  disabled?: boolean;
}

/** Matrix Single Choice 组件的列配置。 */
export interface MatrixSingleChoiceColumn<
  T extends MatrixSingleChoiceValue = MatrixSingleChoiceValue,
> {
  label: React.ReactNode;
  value: T;
  disabled?: boolean;
}

/** Matrix Single Choice 组件内部保存和对外提交的答案值。 */
export type MatrixSingleChoiceAnswer<
  R extends MatrixSingleChoiceValue = MatrixSingleChoiceValue,
  C extends MatrixSingleChoiceValue = MatrixSingleChoiceValue,
> = Partial<Record<R, C>>;

/** Matrix Single Choice 组件 onChange 回调的上下文信息。 */
export interface MatrixSingleChoiceChangePayload<
  R extends MatrixSingleChoiceValue = MatrixSingleChoiceValue,
  C extends MatrixSingleChoiceValue = MatrixSingleChoiceValue,
> {
  row: MatrixSingleChoiceRow<R>;
  column: MatrixSingleChoiceColumn<C>;
  value: MatrixSingleChoiceAnswer<R, C>;
}

/** Matrix Single Choice 组件提交给业务层的数据结构。 */
export interface MatrixSingleChoiceSubmitValue<
  R extends MatrixSingleChoiceValue = MatrixSingleChoiceValue,
  C extends MatrixSingleChoiceValue = MatrixSingleChoiceValue,
> {
  questionId: string;
  value: MatrixSingleChoiceAnswer<R, C>;
}

/** Matrix Single Choice 组件暴露给父级的命令式方法，用于编辑回显和提交取值。 */
export interface MatrixSingleChoiceRef<
  R extends MatrixSingleChoiceValue = MatrixSingleChoiceValue,
  C extends MatrixSingleChoiceValue = MatrixSingleChoiceValue,
> {
  init: (value?: MatrixSingleChoiceAnswer<R, C>) => void;
  getSubmitValue: () => MatrixSingleChoiceSubmitValue<R, C>;
}

/** 矩阵单选组件。每一行只能选择一个列选项，超出宽度时支持横向滑动。 */
export interface MatrixSingleChoiceProps<
  R extends MatrixSingleChoiceValue = MatrixSingleChoiceValue,
  C extends MatrixSingleChoiceValue = MatrixSingleChoiceValue,
> {
  type?: MatrixSingleChoiceType;
  questionId: string;
  rows: Array<MatrixSingleChoiceRow<R>>;
  columns: Array<MatrixSingleChoiceColumn<C>>;
  value?: MatrixSingleChoiceAnswer<R, C>;
  defaultValue?: MatrixSingleChoiceAnswer<R, C>;
  disabled?: boolean;
  className?: string;
  onChange?: (
    value: MatrixSingleChoiceAnswer<R, C>,
    payload: MatrixSingleChoiceChangePayload<R, C>,
  ) => void;
}
