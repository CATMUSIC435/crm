import { useState, useEffect } from 'react';

export interface BookingSlaStatus {
  remainingSeconds: number;
  formattedTime: string;
  isExpired: boolean;
  isUrgent: boolean; // Dưới 3 phút
  progressPercent: number; // 0 - 100%
}

/**
 * Hook đếm ngược SLA 15 phút giữ chỗ căn hộ.
 * @param createdAt Thời điểm tạo phiếu booking (ISO string hoặc timestamp)
 * @param slaDurationMinutes Thời hạn SLA tính theo phút (mặc định: 15 phút)
 */
export function useBookingSla(
  createdAt: string | number,
  slaDurationMinutes: number = 15,
  onExpire?: () => void
): BookingSlaStatus {
  const totalSeconds = slaDurationMinutes * 60;

  const calculateRemaining = () => {
    const createdTime = typeof createdAt === 'string' ? new Date(createdAt).getTime() : createdAt;
    const now = Date.now();
    const elapsedSeconds = Math.max(0, Math.floor((now - createdTime) / 1000));
    return Math.max(0, totalSeconds - elapsedSeconds);
  };

  const [remainingSeconds, setRemainingSeconds] = useState<number>(calculateRemaining);

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateRemaining();
      setRemainingSeconds(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        if (onExpire) onExpire();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [createdAt, totalSeconds]);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isExpired = remainingSeconds <= 0;
  const isUrgent = remainingSeconds > 0 && remainingSeconds <= 180; // Dưới 3 phút
  const progressPercent = Math.round(((totalSeconds - remainingSeconds) / totalSeconds) * 100);

  return {
    remainingSeconds,
    formattedTime,
    isExpired,
    isUrgent,
    progressPercent,
  };
}
