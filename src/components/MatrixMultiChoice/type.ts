import type React from 'react';
import type { QUESTION_COMPONENT_TYPE } from '../../common/constants';

export type MatrixMultiChoiceType = typeof QUESTION_COMPONENT_TYPE.MATRIX_MULTI_CHOICE;

export type MatrixMultiChoiceValue = string | number;

export interface MatrixMultiChoiceRow<T extends MatrixMultiChoiceValue = MatrixMultiChoiceValue> {
  label: React.ReactNode;
  value: T;
  description?: React.ReactNode;
  disabled?: boolean;
}

export interface MatrixMultiChoiceColumn<
  T extends MatrixMultiChoiceValue = MatrixMultiChoiceValue,
> {
  label: React.ReactNode;
  value: T;
  disabled?: boolean;
}

export type MatrixMultiChoiceAnswer<
  R extends MatrixMultiChoiceValue = MatrixMultiChoiceValue,
  C extends MatrixMultiChoiceValue = MatrixMultiChoiceValue,
> = Partial<Record<R, C[]>>;

export interface MatrixMultiChoiceChangePayload<
  R extends MatrixMultiChoiceValue = MatrixMultiChoiceValue,
  C extends MatrixMultiChoiceValue = MatrixMultiChoiceValue,
> {
  row: MatrixMultiChoiceRow<R>;
  column: MatrixMultiChoiceColumn<C>;
  checked: boolean;
  value: MatrixMultiChoiceAnswer<R, C>;
}

export interface MatrixMultiChoiceSubmitValue<
  R extends MatrixMultiChoiceValue = MatrixMultiChoiceValue,
  C extends MatrixMultiChoiceValue = MatrixMultiChoiceValue,
> {
  questionId: string;
  value: MatrixMultiChoiceAnswer<R, C>;
}

export interface MatrixMultiChoiceRef<
  R extends MatrixMultiChoiceValue = MatrixMultiChoiceValue,
  C extends MatrixMultiChoiceValue = MatrixMultiChoiceValue,
> {
  init: (value?: MatrixMultiChoiceAnswer<R, C>) => void;
  getSubmitValue: () => MatrixMultiChoiceSubmitValue<R, C>;
}

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
