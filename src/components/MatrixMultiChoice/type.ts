import type React from 'react';
import type { QUESTION_COMPONENT_TYPE } from '../../common/constants';

/** MatrixMultiChoice 对应的题目类型常量。 */
export type MatrixMultiChoiceType = typeof QUESTION_COMPONENT_TYPE.MATRIX_MULTI_CHOICE;

export type MatrixMultiChoiceValue = string | number;

/** Matrix Multi Choice 组件的行配置。 */
export interface MatrixMultiChoiceRow<T extends MatrixMultiChoiceValue = MatrixMultiChoiceValue> {
  label: React.ReactNode;
  value: T;
  description?: React.ReactNode;
  disabled?: boolean;
}

/** Matrix Multi Choice 组件的列配置。 */
export interface MatrixMultiChoiceColumn<
  T extends MatrixMultiChoiceValue = MatrixMultiChoiceValue,
> {
  label: React.ReactNode;
  value: T;
  disabled?: boolean;
}

/** Matrix Multi Choice 组件内部保存和对外提交的答案值。 */
export type MatrixMultiChoiceAnswer<
  R extends MatrixMultiChoiceValue = MatrixMultiChoiceValue,
  C extends MatrixMultiChoiceValue = MatrixMultiChoiceValue,
> = Partial<Record<R, C[]>>;

/** Matrix Multi Choice 组件 onChange 回调的上下文信息。 */
export interface MatrixMultiChoiceChangePayload<
  R extends MatrixMultiChoiceValue = MatrixMultiChoiceValue,
  C extends MatrixMultiChoiceValue = MatrixMultiChoiceValue,
> {
  row: MatrixMultiChoiceRow<R>;
  column: MatrixMultiChoiceColumn<C>;
  checked: boolean;
  value: MatrixMultiChoiceAnswer<R, C>;
}

/** Matrix Multi Choice 组件提交给业务层的数据结构。 */
export interface MatrixMultiChoiceSubmitValue<
  R extends MatrixMultiChoiceValue = MatrixMultiChoiceValue,
  C extends MatrixMultiChoiceValue = MatrixMultiChoiceValue,
> {
  questionId: string;
  value: MatrixMultiChoiceAnswer<R, C>;
}

/** Matrix Multi Choice 组件暴露给父级的命令式方法，用于编辑回显和提交取值。 */
export interface MatrixMultiChoiceRef<
  R extends MatrixMultiChoiceValue = MatrixMultiChoiceValue,
  C extends MatrixMultiChoiceValue = MatrixMultiChoiceValue,
> {
  init: (value?: MatrixMultiChoiceAnswer<R, C>) => void;
  getSubmitValue: () => MatrixMultiChoiceSubmitValue<R, C>;
}

/** 矩阵多选组件。每一行可以选择多个列选项，超出宽度时支持横向滑动。 */
export interface MatrixMultiChoiceProps<
  R extends MatrixMultiChoiceValue = MatrixMultiChoiceValue,
  C extends MatrixMultiChoiceValue = MatrixMultiChoiceValue,
> {
  type?: MatrixMultiChoiceType;
  questionId: string;
  rows: Array<MatrixMultiChoiceRow<R>>;
  columns: Array<MatrixMultiChoiceColumn<C>>;
  value?: MatrixMultiChoiceAnswer<R, C>;
  defaultValue?: MatrixMultiChoiceAnswer<R, C>;
  disabled?: boolean;
  className?: string;
  onChange?: (
    value: MatrixMultiChoiceAnswer<R, C>,
    payload: MatrixMultiChoiceChangePayload<R, C>,
  ) => void;
}
