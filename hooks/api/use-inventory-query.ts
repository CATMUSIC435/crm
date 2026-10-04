'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from './query-keys';
import { InventoryItem } from '@/types';
import { useStore } from '@/store/useStore';

export interface InventoryFilterParams {
  projectId?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
}

export function useInventoryQuery(params?: InventoryFilterParams) {
  // Fallback to Zustand store data if backend API is not responding
  const fallbackInventory = useStore((state) => state.inventory);

  return useQuery({
    queryKey: queryKeys.inventory.list(params),
    queryFn: async (): Promise<InventoryItem[]> => {
      try {
        const data = await apiClient.inventory.getAll(params);
        return data && data.length > 0 ? data : fallbackInventory;
      } catch (err) {
        // Fallback gracefully to local mock store
        return fallbackInventory;
      }
    },
    staleTime: 30 * 1000, // 30s fresh
  });
}

export function useInventoryStatsQuery(projectId?: string) {
  return useQuery({
    queryKey: queryKeys.inventory.stats(projectId),
    queryFn: async () => {
      try {
        return await apiClient.inventory.getStats(projectId);
      } catch {
        return null;
      }
    },
    staleTime: 60 * 1000,
  });
}

export function useBatchLockMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ unitIds, status }: { unitIds: string[]; status: 'LOCKED' | 'AVAILABLE' }) => {
      return apiClient.inventory.batchLock(unitIds, status);
    },
    onSuccess: () => {
      // Invalidate both inventory lists and stats
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.all });
    },
  });
}
