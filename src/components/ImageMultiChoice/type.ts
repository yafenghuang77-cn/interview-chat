import type { ImageProps } from '@tarojs/components';
import type React from 'react';

export type ImageMultiChoiceValue = string | number;

/** Image Multi Choice 组件的选项配置。 */
export interface ImageMultiChoiceOption<T extends ImageMultiChoiceValue = ImageMultiChoiceValue> {
  label: React.ReactNode;
  value: T;
  image: string;
  description?: React.ReactNode;
  disabled?: boolean;
  imageMode?: ImageProps['mode'];
  imageAlt?: string;
}

/** Image Multi Choice 组件 onChange 回调的上下文信息。 */
export interface ImageMultiChoiceChangePayload<
  T extends ImageMultiChoiceValue = ImageMultiChoiceValue,
> {
  option: ImageMultiChoiceOption<T>;
  checked: boolean;
}

/** Image Multi Choice 组件提交给业务层的数据结构。 */
export interface ImageMultiChoiceSubmitValue<
  T extends ImageMultiChoiceValue = ImageMultiChoiceValue,
> {
  questionId: string;
  value: T[];
}

/** Image Multi Choice 组件暴露给父级的命令式方法，用于编辑回显和提交取值。 */
export interface ImageMultiChoiceRef<T extends ImageMultiChoiceValue = ImageMultiChoiceValue> {
  init: (value?: T[]) => void;
  getSubmitValue: () => ImageMultiChoiceSubmitValue<T>;
}

/** 图片多选组件。每个选项垂直排列，上方展示左对齐正方形图片，下方展示选项内容。 */
export interface ImageMultiChoiceProps<T extends ImageMultiChoiceValue = ImageMultiChoiceValue> {
  questionId: string;
  options: Array<ImageMultiChoiceOption<T>>;
  value?: T[];
  defaultValue?: T[];
  disabled?: boolean;
  className?: string;
  optionClassName?: string;
  onChange?: (value: T[], payload: ImageMultiChoiceChangePayload<T>) => void;
}
