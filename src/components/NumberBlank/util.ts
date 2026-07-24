import type { InputProps } from '@tarojs/components';

type InputEvent = Parameters<NonNullable<InputProps['onInput']>>[0];

export const joinClassNames = (
  classNames: Array<string | false | null | undefined>,
): string => classNames.filter(Boolean).join(' ');

export const getInputValue = (event: InputEvent): string => event.detail.value;

export const validateNumberValue = (
  value: string,
  required: boolean,
  requiredMessage: string,
  errorMessage: string,
  min?: number,
  max?: number,
  minMessage?: string,
  maxMessage?: string,
): string => {
  if (!value) {
    return required ? requiredMessage : '';
  }

  if (!/^-?\d+(\.\d+)?$/.test(value)) {
    return errorMessage;
  }

  const numberValue = Number(value);

  if (min !== undefined && numberValue < min) {
    return minMessage || `数值不能小于${min}`;
  }

  if (max !== undefined && numberValue > max) {
    return maxMessage || `数值不能大于${max}`;
  }

  return '';
};
