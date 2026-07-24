import type {
  MatrixBidirectionalRatingAnswer,
  MatrixBidirectionalRatingScore,
  MatrixBidirectionalRatingSide,
  MatrixBidirectionalRatingValue,
} from './type';

export const joinClassNames = (classNames: Array<string | false | null | undefined>): string =>
  classNames.filter(Boolean).join(' ');

export const getRecordKey = (value: MatrixBidirectionalRatingValue): string => String(value);

export const getBidirectionalRatingValue = <R extends MatrixBidirectionalRatingValue>(
  answer: MatrixBidirectionalRatingAnswer<R>,
  rowValue: R,
): MatrixBidirectionalRatingScore | undefined => answer[getRecordKey(rowValue) as R];

export const getActiveScore = (
  value: MatrixBidirectionalRatingScore | undefined,
  side: MatrixBidirectionalRatingSide,
): number => Number(value?.[side === 'left' ? 'leftScore' : 'rightScore'] || 0);

export const getNextRatingValue = (
  value: MatrixBidirectionalRatingScore | undefined,
  side: MatrixBidirectionalRatingSide,
  score: number,
): MatrixBidirectionalRatingScore => ({
  ...(value || {}),
  [side === 'left' ? 'leftScore' : 'rightScore']: score,
});
