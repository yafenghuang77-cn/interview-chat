import type {
  MatrixSingleChoiceAnswer,
  MatrixSingleChoiceValue,
} from './type';

export const joinClassNames = (
  classNames: Array<string | false | null | undefined>,
): string => classNames.filter(Boolean).join(' ');

export const getRecordKey = (value: MatrixSingleChoiceValue): string =>
  String(value);

export const getSingleAnswerValue = <
  R extends MatrixSingleChoiceValue,
  C extends MatrixSingleChoiceValue,
>(
  answer: MatrixSingleChoiceAnswer<R, C>,
  rowValue: R,
): C | undefined => answer[getRecordKey(rowValue) as R];
