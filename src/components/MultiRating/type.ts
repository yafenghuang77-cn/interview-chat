import type React from 'react';
import type { QUESTION_COMPONENT_TYPE } from '../../common/constants';

export type MultiRatingType = typeof QUESTION_COMPONENT_TYPE.MULTI_RATING;
export type MultiRatingValue = string | number;

export interface MultiRatingRow<T extends MultiRatingValue = MultiRatingValue> {
  label: React.ReactNode;
  value: T;
  description?: React.ReactNode;
  disabled?: boolean;
}

export interface MultiRatingColumn {
  label: React.ReactNode;
  value: number;
  description?: React.ReactNode;
  disabled?: boolean;
}

export type MultiRatingAnswer<R extends MultiRatingValue = MultiRatingValue> = Partial<
  Record<R, number>
>;

export interface MultiRatingChangePayload<R extends MultiRatingValue = MultiRatingValue> {
  row: MultiRatingRow<R>;
  score: number;
  value: MultiRatingAnswer<R>;
}

export interface MultiRatingSubmitValue<R extends MultiRatingValue = MultiRatingValue> {
  questionId: string;
  value: MultiRatingAnswer<R>;
}

export interface MultiRatingRef<R extends MultiRatingValue = MultiRatingValue> {
  init: (value?: MultiRatingAnswer<R>) => void;
  getSubmitValue: () => MultiRatingSubmitValue<R>;
}

export interface MultiRatingProps<R extends MultiRatingValue = MultiRatingValue> {
  type?: MultiRatingType;
  questionId: string;
  rows: Array<MultiRatingRow<R>>;
  columns: MultiRatingColumn[];
  value?: MultiRatingAnswer<R>;
  defaultValue?: MultiRatingAnswer<R>;
  disabled?: boolean;
  className?: string;
  onChange?: (value: MultiRatingAnswer<R>, payload: MultiRatingChangePayload<R>) => void;
}
