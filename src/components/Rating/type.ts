import type React from 'react';
import type { QUESTION_COMPONENT_TYPE } from '../../common/constants';

export type RatingType = typeof QUESTION_COMPONENT_TYPE.RATING;

export interface RatingOption {
  label: React.ReactNode;
  value: number;
  description?: React.ReactNode;
  disabled?: boolean;
}

export type RatingAnswer = number | null;

export interface RatingChangePayload {
  option: RatingOption;
  value: RatingAnswer;
}

export interface RatingProps {
  type?: RatingType;
  options: RatingOption[];
  value?: RatingAnswer;
  defaultValue?: RatingAnswer;
  disabled?: boolean;
  className?: string;
  onChange?: (value: RatingAnswer, payload: RatingChangePayload) => void;
}
