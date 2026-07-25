import { useEffect, useRef, useState } from 'react';

const DEFAULT_TYPING_INTERVAL = 35;

export const useTypingText = (
  text: string,
  interval = DEFAULT_TYPING_INTERVAL,
  onFinish?: () => void,
): string => {
  const [typingText, setTypingText] = useState('');
  const onFinishRef = useRef(onFinish);

  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  useEffect(() => {
    if (!text) {
      setTypingText('');
      onFinishRef.current?.();
      return undefined;
    }

    const chars = Array.from(text);
    let currentIndex = 0;

    setTypingText('');

    const timer = setInterval(() => {
      currentIndex += 1;
      setTypingText(chars.slice(0, currentIndex).join(''));

      if (currentIndex >= chars.length) {
        clearInterval(timer);
        onFinishRef.current?.();
      }
    }, interval);

    return () => clearInterval(timer);
  }, [text, interval]);

  return typingText;
};
