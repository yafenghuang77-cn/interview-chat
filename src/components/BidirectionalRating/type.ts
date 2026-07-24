import type React from 'react';
import type { QUESTION_COMPONENT_TYPE } from '../../common/constants';

/** BidirectionalRating 对应的题目类型常量。 */
export type BidirectionalRatingType = typeof QUESTION_COMPONENT_TYPE.BIDIRECTIONAL_RATING;

export type BidirectionalRatingSide = 'left' | 'right';

/** Bidirectional Rating 组件的列配置。 */
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

/** Bidirectional Rating 组件 onChange 回调的上下文信息。 */
export interface BidirectionalRatingChangePayload {
  side: BidirectionalRatingSide;
  score: number;
  value: BidirectionalRatingAnswer;
}

/** Bidirectional Rating 组件提交给业务层的数据结构。 */
export interface BidirectionalRatingSubmitValue {
  questionId: string;
  value: BidirectionalRatingAnswer | null;
}

/** Bidirectional Rating 组件暴露给父级的命令式方法，用于编辑回显和提交取值。 */
export interface BidirectionalRatingRef {
  init: (value?: BidirectionalRatingAnswer | null) => void;
  getSubmitValue: () => BidirectionalRatingSubmitValue;
}

/** 双向打分组件。用于左右两个方向分别选择打分强度，两个方向可同时保留选择值。 */
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
