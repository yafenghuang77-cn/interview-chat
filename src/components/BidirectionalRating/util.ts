import type {
  BidirectionalRatingAnswer,
  BidirectionalRatingSide,
} from './type';

export const joinClassNames = (
  classNames: Array<string | false | null | undefined>,
): string => classNames.filter(Boolean).join(' ');

export const getColumnKey = (value: number): string => String(value);

export const getActiveScore = (
  value: BidirectionalRatingAnswer | null | undefined,
  side: BidirectionalRatingSide,
): number =>
  Number(value?.[side === 'left' ? 'leftScore' : 'rightScore'] || 0);

export const getNextValue = (
  value: BidirectionalRatingAnswer | null | undefined,
  side: BidirectionalRatingSide,
  score: number,
): BidirectionalRatingAnswer => ({
  ...(value || {}),
  [side === 'left' ? 'leftScore' : 'rightScore']: score,
});
