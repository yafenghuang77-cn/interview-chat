import type { ImageProps } from '@tarojs/components';
import type React from 'react';

export type ImageSingleChoiceValue = string | number;

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

export interface ImageSingleChoiceChangePayload<
  T extends ImageSingleChoiceValue = ImageSingleChoiceValue,
> {
  option: ImageSingleChoiceOption<T>;
  checked: boolean;
}

export interface ImageSingleChoiceSubmitValue<
  T extends ImageSingleChoiceValue = ImageSingleChoiceValue,
> {
  questionId: string;
  value: T | null;
}

export interface ImageSingleChoiceRef<T extends ImageSingleChoiceValue = ImageSingleChoiceValue> {
  init: (value?: T | null) => void;
  getSubmitValue: () => ImageSingleChoiceSubmitValue<T>;
}

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
