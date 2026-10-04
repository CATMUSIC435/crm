import { StateCreator } from 'zustand';
import { InventoryItem } from '@/types';

export interface InventorySlice {
  inventory: InventoryItem[];
  selectedUnitCode: string | null;
  unitFilter: {
    projectId: string;
    status: string;
    bedrooms: number | 'all';
    maxPrice: number | 'all';
  };

  // Actions
  setInventory: (items: InventoryItem[]) => void;
  selectUnit: (code: string | null) => void;
  updateUnitStatus: (code: string, status: InventoryItem['status'], customerId?: string) => void;
  setUnitFilter: (filter: Partial<InventorySlice['unitFilter']>) => void;
}

export const createInventorySlice: StateCreator<InventorySlice, [], [], InventorySlice> = (set) => ({
  inventory: [],
  selectedUnitCode: null,
  unitFilter: {
    projectId: 'all',
    status: 'all',
    bedrooms: 'all',
    maxPrice: 'all',
  },

  setInventory: (items) => set({ inventory: items }),

  selectUnit: (code) => set({ selectedUnitCode: code }),

  updateUnitStatus: (code, status, customerId) =>
    set((state) => ({
      inventory: state.inventory.map((item) =>
        item.code === code ? { ...item, status, customerId: customerId ?? item.customerId } : item
      ),
    })),

  setUnitFilter: (filter) =>
    set((state) => ({
      unitFilter: { ...state.unitFilter, ...filter },
    })),
});
