import type { TextareaProps } from '@tarojs/components';

type TextareaEvent = Parameters<NonNullable<TextareaProps['onInput']>>[0];

export const joinClassNames = (classNames: Array<string | false | null | undefined>): string =>
  classNames.filter(Boolean).join(' ');

export const getInputValue = (event: TextareaEvent): string => event.detail.value;

export const getTextAreaHeight = (rows: number): number => Math.max(rows, 1) * 40 + 48;
