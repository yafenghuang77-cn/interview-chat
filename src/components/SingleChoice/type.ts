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

export interface SingleChoiceProps<T extends SingleChoiceValue = SingleChoiceValue> {
  options: Array<SingleChoiceOption<T>>;
  value?: T | null;
  defaultValue?: T | null;
  disabled?: boolean;
  className?: string;
  optionClassName?: string;
  onChange?: (value: T) => void;
}
