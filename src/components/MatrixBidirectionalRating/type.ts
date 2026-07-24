import type React from 'react';
import type { QUESTION_COMPONENT_TYPE } from '../../common/constants';

export type MatrixBidirectionalRatingType =
  typeof QUESTION_COMPONENT_TYPE.MATRIX_BIDIRECTIONAL_RATING;

export type MatrixBidirectionalRatingValue = string | number;
export type MatrixBidirectionalRatingSide = 'left' | 'right';

export interface MatrixBidirectionalRatingRow<
  T extends MatrixBidirectionalRatingValue = MatrixBidirectionalRatingValue,
> {
  label: React.ReactNode;
  value: T;
  description?: React.ReactNode;
  leftLabel?: React.ReactNode;
  rightLabel?: React.ReactNode;
  disabled?: boolean;
}

export interface MatrixBidirectionalRatingColumn {
  label: React.ReactNode;
  value: number;
  description?: React.ReactNode;
  disabled?: boolean;
}

export interface MatrixBidirectionalRatingScore {
  leftScore?: number;
  rightScore?: number;
}

export type MatrixBidirectionalRatingAnswer<
  R extends MatrixBidirectionalRatingValue = MatrixBidirectionalRatingValue,
> = Partial<Record<R, MatrixBidirectionalRatingScore>>;

export interface MatrixBidirectionalRatingChangePayload<
  R extends MatrixBidirectionalRatingValue = MatrixBidirectionalRatingValue,
> {
  row: MatrixBidirectionalRatingRow<R>;
  side: MatrixBidirectionalRatingSide;
  score: number;
  value: MatrixBidirectionalRatingAnswer<R>;
}

export interface MatrixBidirectionalRatingSubmitValue<
  R extends MatrixBidirectionalRatingValue = MatrixBidirectionalRatingValue,
> {
  questionId: string;
  value: MatrixBidirectionalRatingAnswer<R>;
}

export interface MatrixBidirectionalRatingRef<
  R extends MatrixBidirectionalRatingValue = MatrixBidirectionalRatingValue,
> {
  init: (value?: MatrixBidirectionalRatingAnswer<R>) => void;
  getSubmitValue: () => MatrixBidirectionalRatingSubmitValue<R>;
}

export interface MatrixBidirectionalRatingProps<
  R extends MatrixBidirectionalRatingValue = MatrixBidirectionalRatingValue,
> {
  type?: MatrixBidirectionalRatingType;
  questionId: string;
  rows: Array<MatrixBidirectionalRatingRow<R>>;
  columns: MatrixBidirectionalRatingColumn[];
  value?: MatrixBidirectionalRatingAnswer<R>;
  defaultValue?: MatrixBidirectionalRatingAnswer<R>;
  disabled?: boolean;
  leftLabel?: React.ReactNode;
  rightLabel?: React.ReactNode;
  className?: string;
  onChange?: (
    value: MatrixBidirectionalRatingAnswer<R>,
    payload: MatrixBidirectionalRatingChangePayload<R>,
  ) => void;
}
