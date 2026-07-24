import type React from 'react';
import type { QUESTION_COMPONENT_TYPE } from '../../common/constants';

export type NpsRatingType = typeof QUESTION_COMPONENT_TYPE.NPS;

export interface NpsRatingOption {
  label: React.ReactNode;
  value: number;
  description?: React.ReactNode;
  disabled?: boolean;
}

export type NpsRatingAnswer = number | null;

export interface NpsRatingChangePayload {
  option: NpsRatingOption;
  value: NpsRatingAnswer;
}

export interface NpsRatingSubmitValue {
  questionId: string;
  value: NpsRatingAnswer;
}

export interface NpsRatingRef {
  init: (value?: NpsRatingAnswer) => void;
  getSubmitValue: () => NpsRatingSubmitValue;
}

export interface NpsRatingProps {
  type?: NpsRatingType;
  questionId: string;
  options: NpsRatingOption[];
  value?: NpsRatingAnswer;
  defaultValue?: NpsRatingAnswer;
  disabled?: boolean;
  lowLabel?: React.ReactNode;
  highLabel?: React.ReactNode;
  className?: string;
  onChange?: (value: NpsRatingAnswer, payload: NpsRatingChangePayload) => void;
}
