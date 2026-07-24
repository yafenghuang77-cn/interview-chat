import type React from 'react';
import type { QUESTION_COMPONENT_TYPE } from '../../common/constants';

/** MatrixBidirectionalRating 对应的题目类型常量。 */
export type MatrixBidirectionalRatingType =
  typeof QUESTION_COMPONENT_TYPE.MATRIX_BIDIRECTIONAL_RATING;

export type MatrixBidirectionalRatingValue = string | number;
export type MatrixBidirectionalRatingSide = 'left' | 'right';

/** Matrix Bidirectional Rating 组件的行配置。 */
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

/** Matrix Bidirectional Rating 组件的列配置。 */
export interface MatrixBidirectionalRatingColumn {
  label: React.ReactNode;
  value: number;
  description?: React.ReactNode;
  disabled?: boolean;
}

/** Matrix Bidirectional Rating 组件的双向分值配置。 */
export interface MatrixBidirectionalRatingScore {
  leftScore?: number;
  rightScore?: number;
}

/** Matrix Bidirectional Rating 组件内部保存和对外提交的答案值。 */
export type MatrixBidirectionalRatingAnswer<
  R extends MatrixBidirectionalRatingValue = MatrixBidirectionalRatingValue,
> = Partial<Record<R, MatrixBidirectionalRatingScore>>;

/** Matrix Bidirectional Rating 组件 onChange 回调的上下文信息。 */
export interface MatrixBidirectionalRatingChangePayload<
  R extends MatrixBidirectionalRatingValue = MatrixBidirectionalRatingValue,
> {
  row: MatrixBidirectionalRatingRow<R>;
  side: MatrixBidirectionalRatingSide;
  score: number;
  value: MatrixBidirectionalRatingAnswer<R>;
}

/** Matrix Bidirectional Rating 组件提交给业务层的数据结构。 */
export interface MatrixBidirectionalRatingSubmitValue<
  R extends MatrixBidirectionalRatingValue = MatrixBidirectionalRatingValue,
> {
  questionId: string;
  value: MatrixBidirectionalRatingAnswer<R>;
}

/** Matrix Bidirectional Rating 组件暴露给父级的命令式方法，用于编辑回显和提交取值。 */
export interface MatrixBidirectionalRatingRef<
  R extends MatrixBidirectionalRatingValue = MatrixBidirectionalRatingValue,
> {
  init: (value?: MatrixBidirectionalRatingAnswer<R>) => void;
  getSubmitValue: () => MatrixBidirectionalRatingSubmitValue<R>;
}

/** 矩阵双向打分组件。每个矩阵行按上下两组展示左右方向的五角星打分。 */
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
