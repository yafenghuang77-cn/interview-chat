import type { InputProps } from '@tarojs/components';

type InputEvent = Parameters<NonNullable<InputProps['onInput']>>[0];

export const joinClassNames = (classNames: Array<string | false | null | undefined>): string =>
  classNames.filter(Boolean).join(' ');

export const getInputValue = (event: InputEvent): string => event.detail.value;

export const createBlankItems = (value: string[] | undefined, count: number): string[] => {
  const items = value || [];
  const lackCount = Math.max(count - items.length, 0);

  return lackCount > 0 ? [...items, ...Array(lackCount).fill('')] : items;
};
