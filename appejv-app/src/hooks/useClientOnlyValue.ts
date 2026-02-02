import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

/**
 * Sử dụng giá trị khác nhau cho web và native
 * @param webValue Giá trị được sử dụng cho web
 * @param defaultValue Giá trị được sử dụng cho native
 * @returns Giá trị phù hợp với nền tảng
 */
export function useClientOnlyValue<T>(webValue: T, defaultValue: T): T {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    if (Platform.OS === 'web') {
      setValue(webValue);
    }
  }, [webValue]);

  return value;
}
