'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from './query-keys';
import { BookingTicket } from '@/types';
import { useStore } from '@/store/useStore';

export function useBookingsQuery(projectId?: string, stage?: string) {
  const fallbackBookings = useStore((state) => state.bookingTickets) || [];

  return useQuery({
    queryKey: queryKeys.bookings.list({ projectId, stage }),
    queryFn: async (): Promise<BookingTicket[]> => {
      try {
        const data = await apiClient.bookings.getAll(projectId, stage);
        return data && data.length > 0 ? data : fallbackBookings;
      } catch {
        return fallbackBookings;
      }
    },
    staleTime: 30 * 1000,
  });
}

export function useApproveBookingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, comment }: { id: string; comment?: string }) => {
      return apiClient.bookings.approve(id, comment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
    },
  });
}

export function useRejectBookingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      return apiClient.bookings.reject(id, reason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
    },
  });
}
