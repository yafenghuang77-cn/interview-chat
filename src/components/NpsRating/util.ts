export const joinClassNames = (
  classNames: Array<string | false | null | undefined>,
): string => classNames.filter(Boolean).join(' ');

export const getOptionKey = (value: number): string => String(value);

export const isHeartActive = (
  currentValue: number | null | undefined,
  optionValue: number,
): boolean =>
  typeof currentValue === 'number' && optionValue > 0 && optionValue <= currentValue;
