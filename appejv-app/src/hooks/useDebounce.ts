import { useState, useEffect } from 'react';

/**
 * Hook để debounce một giá trị, hữu ích cho search, input validation, etc.
 * @param value Giá trị cần debounce
 * @param delay Thời gian delay tính bằng milliseconds
 * @returns Giá trị đã được debounce
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
