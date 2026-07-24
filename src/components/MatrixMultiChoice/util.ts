import type { MatrixMultiChoiceAnswer, MatrixMultiChoiceValue } from './type';

export const joinClassNames = (classNames: Array<string | false | null | undefined>): string =>
  classNames.filter(Boolean).join(' ');

export const getRecordKey = (value: MatrixMultiChoiceValue): string => String(value);

export const getMultiAnswerValue = <
  R extends MatrixMultiChoiceValue,
  C extends MatrixMultiChoiceValue,
>(
  answer: MatrixMultiChoiceAnswer<R, C>,
  rowValue: R,
): C[] => answer[getRecordKey(rowValue) as R] || [];

export const toggleMatrixValue = <
  R extends MatrixMultiChoiceValue,
  C extends MatrixMultiChoiceValue,
>(
  answer: MatrixMultiChoiceAnswer<R, C>,
  rowValue: R,
  columnValue: C,
): { nextValue: MatrixMultiChoiceAnswer<R, C>; checked: boolean } => {
  const rowValues = getMultiAnswerValue(answer, rowValue);
  const checked = !rowValues.includes(columnValue);
  const nextRowValues = checked
    ? [...rowValues, columnValue]
    : rowValues.filter(item => item !== columnValue);

  return {
    nextValue: {
      ...answer,
      [getRecordKey(rowValue)]: nextRowValues,
    },
    checked,
  };
};
