import type { InputProps } from '@tarojs/components';

type InputEvent = Parameters<NonNullable<InputProps['onInput']>>[0];

export const joinClassNames = (
  classNames: Array<string | false | null | undefined>,
): string => classNames.filter(Boolean).join(' ');

export const getInputValue = (event: InputEvent): string => event.detail.value;

export const normalizePhoneValue = (value: string): string =>
  value.replace(/[^\d]/g, '');

export const validatePhoneValue = (
  value: string,
  required: boolean,
  requiredMessage: string,
  errorMessage: string,
): string => {
  if (!value) {
    return required ? requiredMessage : '';
  }

  return /^1[3-9]\d{9}$/.test(value) ? '' : errorMessage;
};
