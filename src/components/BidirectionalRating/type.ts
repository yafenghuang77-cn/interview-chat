import type React from 'react';
import type { QUESTION_COMPONENT_TYPE } from '../../common/constants';

export type BidirectionalRatingType = typeof QUESTION_COMPONENT_TYPE.BIDIRECTIONAL_RATING;

export type BidirectionalRatingSide = 'left' | 'right';

export interface BidirectionalRatingColumn {
  label: React.ReactNode;
  value: number;
  description?: React.ReactNode;
  disabled?: boolean;
}

export interface BidirectionalRatingAnswer {
  leftScore?: number;
  rightScore?: number;
}

export interface BidirectionalRatingChangePayload {
  side: BidirectionalRatingSide;
  score: number;
  value: BidirectionalRatingAnswer;
}

export interface BidirectionalRatingSubmitValue {
  questionId: string;
  value: BidirectionalRatingAnswer | null;
}

export interface BidirectionalRatingRef {
  init: (value?: BidirectionalRatingAnswer | null) => void;
  getSubmitValue: () => BidirectionalRatingSubmitValue;
}

export interface BidirectionalRatingProps {
  type?: BidirectionalRatingType;
  questionId: string;
  columns: BidirectionalRatingColumn[];
  value?: BidirectionalRatingAnswer | null;
  defaultValue?: BidirectionalRatingAnswer | null;
  disabled?: boolean;
  leftLabel?: React.ReactNode;
  rightLabel?: React.ReactNode;
  className?: string;
  onChange?: (value: BidirectionalRatingAnswer, payload: BidirectionalRatingChangePayload) => void;
}
