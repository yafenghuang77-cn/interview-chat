import type React from 'react';

export type MultiChoiceValue = string | number;

export interface MultiChoiceOption<T extends MultiChoiceValue = MultiChoiceValue> {
  label: React.ReactNode;
  value: T;
  description?: React.ReactNode;
  disabled?: boolean;
}

export interface MultiChoiceChangePayload<T extends MultiChoiceValue = MultiChoiceValue> {
  option: MultiChoiceOption<T>;
  checked: boolean;
}

export interface MultiChoiceProps<T extends MultiChoiceValue = MultiChoiceValue> {
  options: Array<MultiChoiceOption<T>>;
  value?: T[];
  defaultValue?: T[];
  disabled?: boolean;
  className?: string;
  optionClassName?: string;
  onChange?: (value: T[]) => void;
}
