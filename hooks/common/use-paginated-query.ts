'use client';

import { useState, useMemo } from 'react';
import { useQuery, keepPreviousData, QueryKey } from '@tanstack/react-query';

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface UsePaginatedQueryOptions<T> {
  queryKey: QueryKey;
  queryFn: (params: { page: number; pageSize: number; search: string }) => Promise<T[] | { items: T[]; total: number }>;
  initialPage?: number;
  initialPageSize?: number;
  search?: string;
  staleTime?: number;
}

export function usePaginatedQuery<T>({
  queryKey,
  queryFn,
  initialPage = 1,
  initialPageSize = 10,
  search = '',
  staleTime = 60 * 1000,
}: UsePaginatedQueryOptions<T>) {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const query = useQuery({
    queryKey: [...queryKey, { page, pageSize, search }],
    queryFn: () => queryFn({ page, pageSize, search }),
    placeholderData: keepPreviousData,
    staleTime,
  });

  const paginatedResult = useMemo<PaginatedResult<T>>(() => {
    const rawData = query.data;

    if (!rawData) {
      return {
        items: [],
        total: 0,
        page,
        pageSize,
        totalPages: 0,
      };
    }

    // If queryFn already returned an object with items and total (server-side pagination)
    if ('items' in rawData && Array.isArray((rawData as any).items)) {
      const serverResult = rawData as { items: T[]; total: number };
      const total = serverResult.total;
      return {
        items: serverResult.items,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
    }

    // Otherwise rawData is an array, perform client-side pagination
    const arrayData = Array.isArray(rawData) ? rawData : [];
    const total = arrayData.length;
    const startIndex = (page - 1) * pageSize;
    const items = arrayData.slice(startIndex, startIndex + pageSize);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }, [query.data, page, pageSize]);

  return {
    ...query,
    items: paginatedResult.items,
    total: paginatedResult.total,
    page,
    pageSize,
    totalPages: paginatedResult.totalPages,
    setPage,
    setPageSize,
    hasNextPage: page < paginatedResult.totalPages,
    hasPrevPage: page > 1,
    nextPage: () => setPage((p) => Math.min(p + 1, paginatedResult.totalPages)),
    prevPage: () => setPage((p) => Math.max(p - 1, 1)),
  };
}
