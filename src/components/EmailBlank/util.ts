import type { InputProps } from '@tarojs/components';

type InputEvent = Parameters<NonNullable<InputProps['onInput']>>[0];

export const joinClassNames = (
  classNames: Array<string | false | null | undefined>,
): string => classNames.filter(Boolean).join(' ');

export const getInputValue = (event: InputEvent): string => event.detail.value;

export const validateEmailValue = (
  value: string,
  required: boolean,
  requiredMessage: string,
  errorMessage: string,
): string => {
  if (!value) {
    return required ? requiredMessage : '';
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : errorMessage;
};
