import { useState, useEffect } from 'react';

/**
 * Hook trì hoãn cập nhật giá trị (Debounce) giúp tránh re-render và gọi API liên tục khi người dùng nhập liệu.
 * @param value Giá trị cần debounce (string, number, object...)
 * @param delayMs Thời gian trì hoãn tính bằng mili giây (mặc định: 300ms)
 */
export function useDebounce<T>(value: T, delayMs: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delayMs]);

  return debouncedValue;
}
