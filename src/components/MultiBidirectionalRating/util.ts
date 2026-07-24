import type {
  MultiBidirectionalRatingAnswer,
  MultiBidirectionalRatingScore,
  MultiBidirectionalRatingSide,
  MultiBidirectionalRatingValue,
} from './type';

export const joinClassNames = (
  classNames: Array<string | false | null | undefined>,
): string => classNames.filter(Boolean).join(' ');

export const getRecordKey = (
  value: MultiBidirectionalRatingValue,
): string => String(value);

export const getBidirectionalRatingValue = <
  R extends MultiBidirectionalRatingValue,
>(
  answer: MultiBidirectionalRatingAnswer<R>,
  rowValue: R,
): MultiBidirectionalRatingScore | undefined =>
  answer[getRecordKey(rowValue) as R];

export const getActiveScore = (
  value: MultiBidirectionalRatingScore | undefined,
  side: MultiBidirectionalRatingSide,
): number =>
  Number(value?.[side === 'left' ? 'leftScore' : 'rightScore'] || 0);

export const getNextRatingValue = (
  value: MultiBidirectionalRatingScore | undefined,
  side: MultiBidirectionalRatingSide,
  score: number,
): MultiBidirectionalRatingScore => ({
  ...(value || {}),
  [side === 'left' ? 'leftScore' : 'rightScore']: score,
});
