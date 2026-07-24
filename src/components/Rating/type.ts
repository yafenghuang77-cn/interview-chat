import type React from 'react';
import type { QUESTION_COMPONENT_TYPE } from '../../common/constants';

/** Rating 对应的题目类型常量。 */
export type RatingType = typeof QUESTION_COMPONENT_TYPE.RATING;

/** Rating 组件的选项配置。 */
export interface RatingOption {
  label: React.ReactNode;
  value: number;
  description?: React.ReactNode;
  disabled?: boolean;
}

/** Rating 组件内部保存和对外提交的答案值。 */
export type RatingAnswer = number | null;

/** Rating 组件 onChange 回调的上下文信息。 */
export interface RatingChangePayload {
  option: RatingOption;
  value: RatingAnswer;
}

/** Rating 组件提交给业务层的数据结构。 */
export interface RatingSubmitValue {
  questionId: string;
  value: RatingAnswer;
}

/** Rating 组件暴露给父级的命令式方法，用于编辑回显和提交取值。 */
export interface RatingRef {
  init: (value?: RatingAnswer) => void;
  getSubmitValue: () => RatingSubmitValue;
}

/** 打分题组件。使用五角星展示分值，选中后按分值点亮对应数量的星星。 */
export interface RatingProps {
  type?: RatingType;
  questionId: string;
  options: RatingOption[];
  value?: RatingAnswer;
  defaultValue?: RatingAnswer;
  disabled?: boolean;
  className?: string;
  onChange?: (value: RatingAnswer, payload: RatingChangePayload) => void;
}
