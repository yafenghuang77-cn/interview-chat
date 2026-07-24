export const joinClassNames = (
  classNames: Array<string | false | null | undefined>,
): string => classNames.filter(Boolean).join(' ');

export const getOptionKey = (value: number): string => String(value);

export const getRatingValue = (value: number | null | undefined): number =>
  typeof value === 'number' ? value : 0;
