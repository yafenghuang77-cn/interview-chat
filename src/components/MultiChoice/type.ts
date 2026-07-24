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

export interface MultiChoiceSubmitValue<T extends MultiChoiceValue = MultiChoiceValue> {
  questionId: string;
  value: T[];
}

export interface MultiChoiceRef<T extends MultiChoiceValue = MultiChoiceValue> {
  init: (value?: T[]) => void;
  getSubmitValue: () => MultiChoiceSubmitValue<T>;
}

export interface MultiChoiceProps<T extends MultiChoiceValue = MultiChoiceValue> {
  questionId: string;
  options: Array<MultiChoiceOption<T>>;
  value?: T[];
  defaultValue?: T[];
  disabled?: boolean;
  className?: string;
  optionClassName?: string;
  onChange?: (value: T[]) => void;
}
