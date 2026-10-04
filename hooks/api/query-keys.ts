/**
 * Centralized Query Key Factory for TanStack Query
 * Provides deterministic, type-safe query keys for cache queries and invalidations
 */

export const queryKeys = {
  // 1. Projects
  projects: {
    all: ['projects'] as const,
    lists: () => [...queryKeys.projects.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.projects.all, 'detail', id] as const,
  },

  // 2. Inventory
  inventory: {
    all: ['inventory'] as const,
    lists: () => [...queryKeys.inventory.all, 'list'] as const,
    list: (filters?: Record<string, any>) => [...queryKeys.inventory.lists(), filters || {}] as const,
    stats: (projectId?: string) => [...queryKeys.inventory.all, 'stats', projectId || 'all'] as const,
    detail: (id: string) => [...queryKeys.inventory.all, 'detail', id] as const,
  },

  // 3. Bookings
  bookings: {
    all: ['bookings'] as const,
    lists: () => [...queryKeys.bookings.all, 'list'] as const,
    list: (filters?: { projectId?: string; stage?: string }) => [...queryKeys.bookings.lists(), filters || {}] as const,
    detail: (id: string) => [...queryKeys.bookings.all, 'detail', id] as const,
  },

  // 4. Customers
  customers: {
    all: ['customers'] as const,
    lists: () => [...queryKeys.customers.all, 'list'] as const,
    list: (filters?: { rank?: string; search?: string; page?: number; limit?: number }) =>
      [...queryKeys.customers.lists(), filters || {}] as const,
    detail: (id: string) => [...queryKeys.customers.all, 'detail', id] as const,
  },

  // 5. Contracts
  contracts: {
    all: ['contracts'] as const,
    lists: () => [...queryKeys.contracts.all, 'list'] as const,
    list: (status?: string) => [...queryKeys.contracts.lists(), status || 'all'] as const,
    detail: (id: string) => [...queryKeys.contracts.all, 'detail', id] as const,
  },

  // 6. Auctions
  auctions: {
    all: ['auctions'] as const,
    lists: () => [...queryKeys.auctions.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.auctions.all, 'detail', id] as const,
  },

  // 7. Payments & Transactions
  payments: {
    all: ['payments'] as const,
    transactions: (limit?: number) => [...queryKeys.payments.all, 'transactions', limit || 50] as const,
  },

  // 8. Handover & Operations
  handover: {
    all: ['handover'] as const,
    items: () => [...queryKeys.handover.all, 'items'] as const,
    standards: () => [...queryKeys.handover.all, 'standards'] as const,
  },

  operations: {
    all: ['operations'] as const,
    fees: () => [...queryKeys.operations.all, 'fees'] as const,
    permits: () => [...queryKeys.operations.all, 'permits'] as const,
    bookings: () => [...queryKeys.operations.all, 'bookings'] as const,
  },

  // 9. Portfolio
  portfolio: {
    all: ['portfolio'] as const,
    summary: () => [...queryKeys.portfolio.all, 'summary'] as const,
    assets: () => [...queryKeys.portfolio.all, 'assets'] as const,
  },
};
