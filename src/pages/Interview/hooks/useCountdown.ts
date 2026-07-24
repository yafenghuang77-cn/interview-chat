import { useEffect, useState } from 'react';

export type CountdownTime = string | number | Date;
export type CountdownDuration = [CountdownTime, CountdownTime];

const SECOND = 1000;
const SECONDS_PER_MINUTE = 60;

const toTimestamp = (value: CountdownTime): number => {
  if (value instanceof Date) {
    return value.getTime();
  }

  if (typeof value === 'number') {
    return value;
  }

  const timestampValue = Number(value);
  if (value.trim() !== '' && Number.isFinite(timestampValue)) {
    return timestampValue;
  }

  return new Date(value).getTime();
};

const getRemainingMilliseconds = (
  startValue?: CountdownTime,
  endValue?: CountdownTime
): number | null => {
  if (startValue === undefined || endValue === undefined) {
    return null;
  }

  const start = toTimestamp(startValue);
  const end = toTimestamp(endValue);

  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
    return null;
  }

  const now = Date.now();
  if (now < start) {
    return end - start;
  }

  return Math.max(end - now, 0);
};

const formatMilliseconds = (milliseconds: number): string => {
  const totalSeconds = Math.ceil(milliseconds / SECOND);
  const minutes = Math.floor(totalSeconds / SECONDS_PER_MINUTE);
  const seconds = totalSeconds % SECONDS_PER_MINUTE;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const formatRemainingMilliseconds = (remainingMilliseconds: number | null): string => {
  return remainingMilliseconds === null ? '' : formatMilliseconds(remainingMilliseconds);
};

const getCountdownText = (
  startValue?: CountdownTime,
  endValue?: CountdownTime
): string => {
  const remainingMilliseconds = getRemainingMilliseconds(startValue, endValue);

  return formatRemainingMilliseconds(remainingMilliseconds);
};

export const useCountdown = (duration?: CountdownDuration | null): string => {
  const start = Array.isArray(duration) ? duration[0] : undefined;
  const end = Array.isArray(duration) ? duration[1] : undefined;
  const [countdown, setCountdown] = useState(() => getCountdownText(start, end));

  useEffect(() => {
    const updateCountdown = (): number | null => {
      const remainingMilliseconds = getRemainingMilliseconds(start, end);

      setCountdown(formatRemainingMilliseconds(remainingMilliseconds));

      return remainingMilliseconds;
    };

    const remainingMilliseconds = updateCountdown();
    if (remainingMilliseconds === null || remainingMilliseconds <= 0) {
      return undefined;
    }

    const timer = setInterval(() => {
      const nextRemainingMilliseconds = updateCountdown();

      if (nextRemainingMilliseconds !== null && nextRemainingMilliseconds <= 0) {
        clearInterval(timer);
      }
    }, SECOND);

    return () => clearInterval(timer);
  }, [start, end]);

  return countdown;
};
