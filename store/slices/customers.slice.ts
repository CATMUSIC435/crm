import { StateCreator } from 'zustand';
import { Customer } from '@/types';

export interface CustomerSlice {
  customers: Customer[];
  selectedCustomerId: string | null;

  // Actions
  setCustomers: (customers: Customer[]) => void;
  selectCustomer: (id: string | null) => void;
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
}

export const createCustomerSlice: StateCreator<CustomerSlice, [], [], CustomerSlice> = (set) => ({
  customers: [],
  selectedCustomerId: null,

  setCustomers: (customers) => set({ customers }),

  selectCustomer: (id) => set({ selectedCustomerId: id }),

  addCustomer: (customer) =>
    set((state) => ({
      customers: [customer, ...state.customers],
    })),

  updateCustomer: (id, updates) =>
    set((state) => ({
      customers: state.customers.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    })),
});
