import type React from 'react';
import type { QUESTION_COMPONENT_TYPE } from '../../common/constants';

/** MultiBidirectionalRating 对应的题目类型常量。 */
export type MultiBidirectionalRatingType =
  typeof QUESTION_COMPONENT_TYPE.MULTI_BIDIRECTIONAL_RATING;

export type MultiBidirectionalRatingValue = string | number;
export type MultiBidirectionalRatingSide = 'left' | 'right';

/** Multi Bidirectional Rating 组件的行配置。 */
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

/** Multi Bidirectional Rating 组件的列配置。 */
export interface MultiBidirectionalRatingColumn {
  label: React.ReactNode;
  value: number;
  description?: React.ReactNode;
  disabled?: boolean;
}

/** Multi Bidirectional Rating 组件的双向分值配置。 */
export interface MultiBidirectionalRatingScore {
  leftScore?: number;
  rightScore?: number;
}

/** Multi Bidirectional Rating 组件内部保存和对外提交的答案值。 */
export type MultiBidirectionalRatingAnswer<
  R extends MultiBidirectionalRatingValue = MultiBidirectionalRatingValue,
> = Partial<Record<R, MultiBidirectionalRatingScore>>;

/** Multi Bidirectional Rating 组件 onChange 回调的上下文信息。 */
export interface MultiBidirectionalRatingChangePayload<
  R extends MultiBidirectionalRatingValue = MultiBidirectionalRatingValue,
> {
  row: MultiBidirectionalRatingRow<R>;
  side: MultiBidirectionalRatingSide;
  score: number;
  value: MultiBidirectionalRatingAnswer<R>;
}

/** Multi Bidirectional Rating 组件提交给业务层的数据结构。 */
export interface MultiBidirectionalRatingSubmitValue<
  R extends MultiBidirectionalRatingValue = MultiBidirectionalRatingValue,
> {
  questionId: string;
  value: MultiBidirectionalRatingAnswer<R>;
}

/** Multi Bidirectional Rating 组件暴露给父级的命令式方法，用于编辑回显和提交取值。 */
export interface MultiBidirectionalRatingRef<
  R extends MultiBidirectionalRatingValue = MultiBidirectionalRatingValue,
> {
  init: (value?: MultiBidirectionalRatingAnswer<R>) => void;
  getSubmitValue: () => MultiBidirectionalRatingSubmitValue<R>;
}

/** 多项双向打分组件。用于多个题项分别在左右两个方向上打分。 */
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
