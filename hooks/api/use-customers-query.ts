'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from './query-keys';
import { Customer } from '@/types';
import { useStore } from '@/store/useStore';

export interface CustomerQueryParams {
  rank?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export function useCustomersQuery(params?: CustomerQueryParams) {
  const fallbackCustomers = useStore((state) => state.customers);

  return useQuery({
    queryKey: queryKeys.customers.list(params),
    queryFn: async (): Promise<Customer[]> => {
      try {
        const rankFilter = params?.rank && params.rank !== 'all' && params.rank !== 'Tất cả' ? params.rank : undefined;
        const data = await apiClient.customers.getAll(
          rankFilter,
          params?.search
        );
        if (data && data.length > 0) {
          return data.map((item: any) => ({
            ...item,
            id: item.id || `c-${Math.random()}`,
            name: item.fullName || item.name || '',
            phone: item.phone || '',
            email: item.email || '',
            code: item.code || item.id,
            rank: item.rank || 'Tiềm Năng',
            revenue: Number(item.revenue || item.totalRevenue) || 0,
            status: item.status || 'Đang tư vấn',
            assignedTo: typeof item.assignedTo === 'object' && item.assignedTo?.fullName
              ? item.assignedTo.fullName
              : (typeof item.assignedTo === 'string' ? item.assignedTo : 'Lê Hoàng Anh'),
            createdAt: item.createdAt ? new Date(item.createdAt).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
          }));
        }
        return fallbackCustomers;
      } catch {
        return fallbackCustomers;
      }
    },
    staleTime: 60 * 1000,
  });
}

export function useCustomerDetailQuery(id: string) {
  const fallbackCustomers = useStore((state) => state.customers);

  return useQuery({
    queryKey: queryKeys.customers.detail(id),
    queryFn: async () => {
      try {
        return await apiClient.customers.getById(id);
      } catch {
        return fallbackCustomers.find((c) => c.id === id) || null;
      }
    },
    enabled: !!id,
    staleTime: 60 * 1000,
  });
}
