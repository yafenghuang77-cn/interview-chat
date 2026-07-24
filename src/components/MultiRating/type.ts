import type React from 'react';
import type { QUESTION_COMPONENT_TYPE } from '../../common/constants';

/** MultiRating 对应的题目类型常量。 */
export type MultiRatingType = typeof QUESTION_COMPONENT_TYPE.MULTI_RATING;
export type MultiRatingValue = string | number;

/** Multi Rating 组件的行配置。 */
export interface MultiRatingRow<T extends MultiRatingValue = MultiRatingValue> {
  label: React.ReactNode;
  value: T;
  description?: React.ReactNode;
  disabled?: boolean;
}

/** Multi Rating 组件的列配置。 */
export interface MultiRatingColumn {
  label: React.ReactNode;
  value: number;
  description?: React.ReactNode;
  disabled?: boolean;
}

/** Multi Rating 组件内部保存和对外提交的答案值。 */
export type MultiRatingAnswer<R extends MultiRatingValue = MultiRatingValue> = Partial<
  Record<R, number>
>;

/** Multi Rating 组件 onChange 回调的上下文信息。 */
export interface MultiRatingChangePayload<R extends MultiRatingValue = MultiRatingValue> {
  row: MultiRatingRow<R>;
  score: number;
  value: MultiRatingAnswer<R>;
}

/** Multi Rating 组件提交给业务层的数据结构。 */
export interface MultiRatingSubmitValue<R extends MultiRatingValue = MultiRatingValue> {
  questionId: string;
  value: MultiRatingAnswer<R>;
}

/** Multi Rating 组件暴露给父级的命令式方法，用于编辑回显和提交取值。 */
export interface MultiRatingRef<R extends MultiRatingValue = MultiRatingValue> {
  init: (value?: MultiRatingAnswer<R>) => void;
  getSubmitValue: () => MultiRatingSubmitValue<R>;
}

/** 多项打分组件。用于多个题项分别打分，每个题项独立保存分值。 */
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
