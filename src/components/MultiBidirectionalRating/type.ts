import type React from 'react';
import type { QUESTION_COMPONENT_TYPE } from '../../common/constants';

export type MultiBidirectionalRatingType =
  typeof QUESTION_COMPONENT_TYPE.MULTI_BIDIRECTIONAL_RATING;

export type MultiBidirectionalRatingValue = string | number;
export type MultiBidirectionalRatingSide = 'left' | 'right';

export interface MultiBidirectionalRatingRow<
  T extends MultiBidirectionalRatingValue = MultiBidirectionalRatingValue,
> {
  label: React.ReactNode;
  value: T;
  description?: React.ReactNode;
  leftLabel?: React.ReactNode;
  rightLabel?: React.ReactNode;
  disabled?: boolean;
}

export interface MultiBidirectionalRatingColumn {
  label: React.ReactNode;
  value: number;
  description?: React.ReactNode;
  disabled?: boolean;
}

export interface MultiBidirectionalRatingScore {
  leftScore?: number;
  rightScore?: number;
}

export type MultiBidirectionalRatingAnswer<
  R extends MultiBidirectionalRatingValue = MultiBidirectionalRatingValue,
> = Partial<Record<R, MultiBidirectionalRatingScore>>;

export interface MultiBidirectionalRatingChangePayload<
  R extends MultiBidirectionalRatingValue = MultiBidirectionalRatingValue,
> {
  row: MultiBidirectionalRatingRow<R>;
  side: MultiBidirectionalRatingSide;
  score: number;
  value: MultiBidirectionalRatingAnswer<R>;
}

export interface MultiBidirectionalRatingSubmitValue<
  R extends MultiBidirectionalRatingValue = MultiBidirectionalRatingValue,
> {
  questionId: string;
  value: MultiBidirectionalRatingAnswer<R>;
}

export interface MultiBidirectionalRatingRef<
  R extends MultiBidirectionalRatingValue = MultiBidirectionalRatingValue,
> {
  init: (value?: MultiBidirectionalRatingAnswer<R>) => void;
  getSubmitValue: () => MultiBidirectionalRatingSubmitValue<R>;
}

export interface MultiBidirectionalRatingProps<
  R extends MultiBidirectionalRatingValue = MultiBidirectionalRatingValue,
> {
  type?: MultiBidirectionalRatingType;
  questionId: string;
  rows: Array<MultiBidirectionalRatingRow<R>>;
  columns: MultiBidirectionalRatingColumn[];
  value?: MultiBidirectionalRatingAnswer<R>;
  defaultValue?: MultiBidirectionalRatingAnswer<R>;
  disabled?: boolean;
  leftLabel?: React.ReactNode;
  rightLabel?: React.ReactNode;
  className?: string;
  onChange?: (
    value: MultiBidirectionalRatingAnswer<R>,
    payload: MultiBidirectionalRatingChangePayload<R>,
  ) => void;
}
