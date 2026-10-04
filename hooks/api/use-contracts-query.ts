'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from './query-keys';
import { Contract } from '@/types';
import { useStore } from '@/store/useStore';

export function useContractsQuery(status?: string) {
  const fallbackContracts = useStore((state) => state.contracts);

  return useQuery({
    queryKey: queryKeys.contracts.list(status),
    queryFn: async (): Promise<Contract[]> => {
      try {
        const data = await apiClient.contracts.getAll(status);
        return data && data.length > 0 ? data : fallbackContracts;
      } catch {
        return fallbackContracts;
      }
    },
    staleTime: 60 * 1000,
  });
}

export function useESignContractMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, signerName }: { id: string; signerName: string }) => {
      return apiClient.contracts.eSign(id, signerName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contracts.all });
    },
  });
}

export function useCreateContractMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      type: string;
      customerId: string;
      unitId: string;
      projectId: string;
      value: number;
    }) => {
      return apiClient.contracts.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contracts.all });
    },
  });
}

export function useRecordPaymentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, amount }: { id: string; amount: number }) => {
      return apiClient.contracts.recordPayment(id, amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contracts.all });
    },
  });
}

