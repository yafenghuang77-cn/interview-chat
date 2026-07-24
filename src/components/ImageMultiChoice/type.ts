import type { ImageProps } from '@tarojs/components';
import type React from 'react';

export type ImageMultiChoiceValue = string | number;

export interface ImageMultiChoiceOption<T extends ImageMultiChoiceValue = ImageMultiChoiceValue> {
  label: React.ReactNode;
  value: T;
  image: string;
  description?: React.ReactNode;
  disabled?: boolean;
  imageMode?: ImageProps['mode'];
  imageAlt?: string;
}

export interface ImageMultiChoiceChangePayload<
  T extends ImageMultiChoiceValue = ImageMultiChoiceValue,
> {
  option: ImageMultiChoiceOption<T>;
  checked: boolean;
}

export interface ImageMultiChoiceSubmitValue<
  T extends ImageMultiChoiceValue = ImageMultiChoiceValue,
> {
  questionId: string;
  value: T[];
}

export interface ImageMultiChoiceRef<T extends ImageMultiChoiceValue = ImageMultiChoiceValue> {
  init: (value?: T[]) => void;
  getSubmitValue: () => ImageMultiChoiceSubmitValue<T>;
}

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
