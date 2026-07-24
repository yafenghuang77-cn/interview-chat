import { useEffect, useState } from 'react';

const DEFAULT_TYPING_INTERVAL = 35;

export const useTypingText = (
  text: string,
  interval = DEFAULT_TYPING_INTERVAL
): string => {
  const [typingText, setTypingText] = useState('');

  useEffect(() => {
    if (!text) {
      setTypingText('');
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
      }
    }, interval);

    return () => clearInterval(timer);
  }, [text, interval]);

  return typingText;
};
