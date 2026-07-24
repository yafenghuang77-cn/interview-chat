import type {
  MatrixBidirectionalRatingAnswer,
  MatrixBidirectionalRatingScore,
  MatrixBidirectionalRatingValue,
} from './type';

export const joinClassNames = (
  classNames: Array<string | false | null | undefined>,
): string => classNames.filter(Boolean).join(' ');

export const getRecordKey = (
  value: MatrixBidirectionalRatingValue,
): string => String(value);

export const getBidirectionalRatingValue = <
  R extends MatrixBidirectionalRatingValue,
>(
  answer: MatrixBidirectionalRatingAnswer<R>,
  rowValue: R,
): MatrixBidirectionalRatingScore | undefined =>
  answer[getRecordKey(rowValue) as R];
