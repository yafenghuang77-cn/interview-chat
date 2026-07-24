import type React from 'react';
import type { QUESTION_COMPONENT_TYPE } from '../../common/constants';

/** MatrixRating 对应的题目类型常量。 */
export type MatrixRatingType = typeof QUESTION_COMPONENT_TYPE.MATRIX_RATING;

export type MatrixRatingValue = string | number;

/** Matrix Rating 组件的行配置。 */
export interface MatrixRatingRow<T extends MatrixRatingValue = MatrixRatingValue> {
  label: React.ReactNode;
  value: T;
  description?: React.ReactNode;
  disabled?: boolean;
}

/** Matrix Rating 组件的列配置。 */
export interface MatrixRatingColumn {
  label: React.ReactNode;
  value: number;
  description?: React.ReactNode;
  disabled?: boolean;
}

/** Matrix Rating 组件内部保存和对外提交的答案值。 */
export type MatrixRatingAnswer<R extends MatrixRatingValue = MatrixRatingValue> = Partial<
  Record<R, number>
>;

/** Matrix Rating 组件 onChange 回调的上下文信息。 */
export interface MatrixRatingChangePayload<R extends MatrixRatingValue = MatrixRatingValue> {
  row: MatrixRatingRow<R>;
  score: number;
  value: MatrixRatingAnswer<R>;
}

/** Matrix Rating 组件提交给业务层的数据结构。 */
export interface MatrixRatingSubmitValue<R extends MatrixRatingValue = MatrixRatingValue> {
  questionId: string;
  value: MatrixRatingAnswer<R>;
}

/** Matrix Rating 组件暴露给父级的命令式方法，用于编辑回显和提交取值。 */
export interface MatrixRatingRef<R extends MatrixRatingValue = MatrixRatingValue> {
  init: (value?: MatrixRatingAnswer<R>) => void;
  getSubmitValue: () => MatrixRatingSubmitValue<R>;
}

/** 矩阵打分组件。布局与矩阵单选一致，将单元格控件替换为五角星打分。 */
export interface MatrixRatingProps<R extends MatrixRatingValue = MatrixRatingValue> {
  type?: MatrixRatingType;
  questionId: string;
  rows: Array<MatrixRatingRow<R>>;
  columns: MatrixRatingColumn[];
  value?: MatrixRatingAnswer<R>;
  defaultValue?: MatrixRatingAnswer<R>;
  disabled?: boolean;
  className?: string;
  onChange?: (value: MatrixRatingAnswer<R>, payload: MatrixRatingChangePayload<R>) => void;
}
