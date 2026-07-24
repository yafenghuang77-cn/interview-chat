import type { MatrixRatingAnswer, MatrixRatingValue } from './type';

export const joinClassNames = (classNames: Array<string | false | null | undefined>): string =>
  classNames.filter(Boolean).join(' ');

export const getRecordKey = (value: MatrixRatingValue): string => String(value);

export const getRatingValue = <R extends MatrixRatingValue>(
  answer: MatrixRatingAnswer<R>,
  rowValue: R,
): number => Number(answer[getRecordKey(rowValue) as R] || 0);
