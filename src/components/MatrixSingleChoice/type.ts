import type React from 'react';
import type { QUESTION_COMPONENT_TYPE } from '../../common/constants';

export type MatrixSingleChoiceType =
  typeof QUESTION_COMPONENT_TYPE.MATRIX_SINGLE_CHOICE;

export type MatrixSingleChoiceValue = string | number;

export interface MatrixSingleChoiceRow<
  T extends MatrixSingleChoiceValue = MatrixSingleChoiceValue,
> {
  label: React.ReactNode;
  value: T;
  description?: React.ReactNode;
  disabled?: boolean;
}

export interface MatrixSingleChoiceColumn<
  T extends MatrixSingleChoiceValue = MatrixSingleChoiceValue,
> {
  label: React.ReactNode;
  value: T;
  disabled?: boolean;
}

export type MatrixSingleChoiceAnswer<
  R extends MatrixSingleChoiceValue = MatrixSingleChoiceValue,
  C extends MatrixSingleChoiceValue = MatrixSingleChoiceValue,
> = Partial<Record<R, C>>;

export interface MatrixSingleChoiceChangePayload<
  R extends MatrixSingleChoiceValue = MatrixSingleChoiceValue,
  C extends MatrixSingleChoiceValue = MatrixSingleChoiceValue,
> {
  row: MatrixSingleChoiceRow<R>;
  column: MatrixSingleChoiceColumn<C>;
  value: MatrixSingleChoiceAnswer<R, C>;
}

export interface MatrixSingleChoiceProps<
  R extends MatrixSingleChoiceValue = MatrixSingleChoiceValue,
  C extends MatrixSingleChoiceValue = MatrixSingleChoiceValue,
> {
  type?: MatrixSingleChoiceType;
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
