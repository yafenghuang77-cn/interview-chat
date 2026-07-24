import type { ImageProps } from '@tarojs/components';
import type React from 'react';

export type ImageSingleChoiceValue = string | number;

/** Image Single Choice 组件的选项配置。 */
export interface ImageSingleChoiceOption<
  T extends ImageSingleChoiceValue = ImageSingleChoiceValue,
> {
  label: React.ReactNode;
  value: T;
  image: string;
  description?: React.ReactNode;
  disabled?: boolean;
  imageMode?: ImageProps['mode'];
  imageAlt?: string;
}

/** Image Single Choice 组件 onChange 回调的上下文信息。 */
export interface ImageSingleChoiceChangePayload<
  T extends ImageSingleChoiceValue = ImageSingleChoiceValue,
> {
  option: ImageSingleChoiceOption<T>;
  checked: boolean;
}

/** Image Single Choice 组件提交给业务层的数据结构。 */
export interface ImageSingleChoiceSubmitValue<
  T extends ImageSingleChoiceValue = ImageSingleChoiceValue,
> {
  questionId: string;
  value: T | null;
}

/** Image Single Choice 组件暴露给父级的命令式方法，用于编辑回显和提交取值。 */
export interface ImageSingleChoiceRef<T extends ImageSingleChoiceValue = ImageSingleChoiceValue> {
  init: (value?: T | null) => void;
  getSubmitValue: () => ImageSingleChoiceSubmitValue<T>;
}

/** 图片单选组件。每个选项垂直排列，上方展示左对齐正方形图片，下方展示选项内容。 */
export interface ImageSingleChoiceProps<T extends ImageSingleChoiceValue = ImageSingleChoiceValue> {
  questionId: string;
  options: Array<ImageSingleChoiceOption<T>>;
  value?: T | null;
  defaultValue?: T | null;
  disabled?: boolean;
  className?: string;
  optionClassName?: string;
  onChange?: (value: T, payload: ImageSingleChoiceChangePayload<T>) => void;
}
