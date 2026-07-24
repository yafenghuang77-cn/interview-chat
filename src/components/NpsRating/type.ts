import type React from 'react';
import type { QUESTION_COMPONENT_TYPE } from '../../common/constants';

/** NpsRating 对应的题目类型常量。 */
export type NpsRatingType = typeof QUESTION_COMPONENT_TYPE.NPS;

/** Nps Rating 组件的选项配置。 */
export interface NpsRatingOption {
  label: React.ReactNode;
  value: number;
  description?: React.ReactNode;
  disabled?: boolean;
}

/** Nps Rating 组件内部保存和对外提交的答案值。 */
export type NpsRatingAnswer = number | null;

/** Nps Rating 组件 onChange 回调的上下文信息。 */
export interface NpsRatingChangePayload {
  option: NpsRatingOption;
  value: NpsRatingAnswer;
}

/** Nps Rating 组件提交给业务层的数据结构。 */
export interface NpsRatingSubmitValue {
  questionId: string;
  value: NpsRatingAnswer;
}

/** Nps Rating 组件暴露给父级的命令式方法，用于编辑回显和提交取值。 */
export interface NpsRatingRef {
  init: (value?: NpsRatingAnswer) => void;
  getSubmitValue: () => NpsRatingSubmitValue;
}

/** NPS 推荐度组件。使用爱心展示分值，选中后按分值点亮对应数量的爱心。 */
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
