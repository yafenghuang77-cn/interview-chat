import type React from 'react';
import type { QUESTION_COMPONENT_TYPE } from '../../common/constants';

export type MatrixRatingType = typeof QUESTION_COMPONENT_TYPE.MATRIX_RATING;

export type MatrixRatingValue = string | number;

export interface MatrixRatingRow<T extends MatrixRatingValue = MatrixRatingValue> {
  label: React.ReactNode;
  value: T;
  description?: React.ReactNode;
  disabled?: boolean;
}

export interface MatrixRatingColumn {
  label: React.ReactNode;
  value: number;
  description?: React.ReactNode;
  disabled?: boolean;
}

export type MatrixRatingAnswer<R extends MatrixRatingValue = MatrixRatingValue> = Partial<
  Record<R, number>
>;

export interface MatrixRatingChangePayload<R extends MatrixRatingValue = MatrixRatingValue> {
  row: MatrixRatingRow<R>;
  score: number;
  value: MatrixRatingAnswer<R>;
}

export interface MatrixRatingSubmitValue<R extends MatrixRatingValue = MatrixRatingValue> {
  questionId: string;
  value: MatrixRatingAnswer<R>;
}

export interface MatrixRatingRef<R extends MatrixRatingValue = MatrixRatingValue> {
  init: (value?: MatrixRatingAnswer<R>) => void;
  getSubmitValue: () => MatrixRatingSubmitValue<R>;
}

export interface MatrixRatingProps<R extends MatrixRatingValue = MatrixRatingValue> {
  type?: MatrixRatingType;
  questionId: string;
  rows: Array<MatrixRatingRow<R>>;
  columns: MatrixRatingColumn[];
  value?: MatrixRatingAnswer<R>;
  defaultValue?: MatrixRatingAnswer<R>;
  disabled?: boolean;
  className?: string;
  onChange?: (value: MatrixRatingAnswer<R>, payload: MatrixRatingChangePayload<R>) => void;
}
