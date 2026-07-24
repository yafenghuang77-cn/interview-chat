import type React from 'react';

export type SingleChoiceValue = string | number;

export interface SingleChoiceOption<T extends SingleChoiceValue = SingleChoiceValue> {
  label: React.ReactNode;
  value: T;
  description?: React.ReactNode;
  disabled?: boolean;
}

export interface SingleChoiceChangePayload<T extends SingleChoiceValue = SingleChoiceValue> {
  option: SingleChoiceOption<T>;
  checked: boolean;
}

export interface SingleChoiceSubmitValue<T extends SingleChoiceValue = SingleChoiceValue> {
  questionId: string;
  value: T | null;
}

export interface SingleChoiceRef<T extends SingleChoiceValue = SingleChoiceValue> {
  init: (value?: T | null) => void;
  getSubmitValue: () => SingleChoiceSubmitValue<T>;
}

export interface SingleChoiceProps<T extends SingleChoiceValue = SingleChoiceValue> {
  questionId: string;
  options: Array<SingleChoiceOption<T>>;
  value?: T | null;
  defaultValue?: T | null;
  disabled?: boolean;
  className?: string;
  optionClassName?: string;
  onChange?: (value: T) => void;
}
