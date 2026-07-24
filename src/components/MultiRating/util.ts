import type { MultiRatingAnswer, MultiRatingValue } from './type';

export const joinClassNames = (classNames: Array<string | false | null | undefined>): string =>
  classNames.filter(Boolean).join(' ');

export const getRecordKey = (value: MultiRatingValue): string => String(value);

export const getRatingValue = <R extends MultiRatingValue>(
  answer: MultiRatingAnswer<R>,
  rowValue: R,
): number => Number(answer[getRecordKey(rowValue) as R] || 0);
