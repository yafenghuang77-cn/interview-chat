export const joinClassNames = (classNames: Array<string | false | null | undefined>): string =>
  classNames.filter(Boolean).join(' ');

export const padTimeUnit = (value: number): string => `${value}`.padStart(2, '0');

export const getDateText = (value: string | null | undefined, placeholder: string): string => {
  if (!value) {
    return placeholder;
  }

  const matches = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  return matches ? `${matches[1]}年${matches[2]}月${matches[3]}日` : value;
};

export const getDatetimeText = (value: string | null | undefined, placeholder: string): string => {
  if (!value) {
    return placeholder;
  }

  const matches = value.match(/^(\d{4})-(\d{2})-(\d{2})(?:\s+(\d{2}):(\d{2}):(\d{2}))?$/);

  if (!matches) {
    return value;
  }

  return `${matches[1]}年${matches[2]}月${matches[3]}日 ${matches[4] || '00'}时${matches[5] || '00'}分${matches[6] || '00'}秒`;
};

export const createNumberRange = (start: number, end: number): string[] =>
  Array.from({ length: end - start + 1 }, (_, index) => `${start + index}`);

export const stripTimeUnit = (value: string): string => value.replace(/[年月日时分秒]/g, '');

export const getDefaultYearRange = (): number[] => {
  const currentYear = new Date().getFullYear();

  return [currentYear - 50, currentYear + 50];
};

export const createDatetimeRange = (yearRange: number[]): string[][] => {
  const [startYear, endYear] = yearRange;

  return [
    createNumberRange(startYear, endYear).map(item => `${item}年`),
    createNumberRange(1, 12)
      .map(Number)
      .map(item => `${padTimeUnit(item)}月`),
    createNumberRange(1, 31)
      .map(Number)
      .map(item => `${padTimeUnit(item)}日`),
    createNumberRange(0, 23)
      .map(Number)
      .map(item => `${padTimeUnit(item)}时`),
    createNumberRange(0, 59)
      .map(Number)
      .map(item => `${padTimeUnit(item)}分`),
    createNumberRange(0, 59)
      .map(Number)
      .map(item => `${padTimeUnit(item)}秒`),
  ];
};

export const getDatetimeIndexes = (
  value: string | null | undefined,
  range: string[][],
): number[] => {
  const fallback = new Date();
  const matches = value?.match(/^(\d{4})-(\d{2})-(\d{2})(?:\s+(\d{2}):(\d{2}):(\d{2}))?$/);
  const parts = matches
    ? [
        matches[1],
        matches[2],
        matches[3],
        matches[4] || '00',
        matches[5] || '00',
        matches[6] || '00',
      ]
    : [
        `${fallback.getFullYear()}`,
        padTimeUnit(fallback.getMonth() + 1),
        padTimeUnit(fallback.getDate()),
        padTimeUnit(fallback.getHours()),
        padTimeUnit(fallback.getMinutes()),
        padTimeUnit(fallback.getSeconds()),
      ];

  return parts.map((part, index) =>
    Math.max(
      range[index].findIndex(item => stripTimeUnit(item) === part),
      0,
    ),
  );
};

export const formatDatetimeValue = (indexes: number[], range: string[][]): string => {
  const [yearIndex, monthIndex, dayIndex, hourIndex, minuteIndex, secondIndex] = indexes;
  const year = stripTimeUnit(range[0][yearIndex]);
  const month = stripTimeUnit(range[1][monthIndex]);
  const day = stripTimeUnit(range[2][dayIndex]);
  const hour = stripTimeUnit(range[3][hourIndex]);
  const minute = stripTimeUnit(range[4][minuteIndex]);
  const second = stripTimeUnit(range[5][secondIndex]);

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};
