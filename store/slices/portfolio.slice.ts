import { StateCreator } from 'zustand';
import { PortfolioProperty, PortfolioMilestone } from '@/types';

export interface PortfolioSlice {
  portfolioProperties: PortfolioProperty[];
  selectedPortfolioPropertyId: string | null;

  // Actions
  setPortfolioProperties: (properties: PortfolioProperty[]) => void;
  selectPortfolioProperty: (id: string | null) => void;
  addPortfolioProperty: (property: PortfolioProperty) => void;
  updatePortfolioProperty: (id: string, updates: Partial<PortfolioProperty>) => void;
  deletePortfolioProperty: (id: string) => void;
  payPortfolioMilestone: (propertyId: string) => void;
}

export const createPortfolioSlice: StateCreator<PortfolioSlice, [], [], PortfolioSlice> = (set) => ({
  portfolioProperties: [],
  selectedPortfolioPropertyId: null,

  setPortfolioProperties: (properties) => set({ portfolioProperties: properties }),

  selectPortfolioProperty: (id) => set({ selectedPortfolioPropertyId: id }),

  addPortfolioProperty: (property) =>
    set((state) => ({
      portfolioProperties: [property, ...state.portfolioProperties],
    })),

  updatePortfolioProperty: (id, updates) =>
    set((state) => ({
      portfolioProperties: state.portfolioProperties.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),

  deletePortfolioProperty: (id) =>
    set((state) => ({
      portfolioProperties: state.portfolioProperties.filter((p) => p.id !== id),
    })),

  payPortfolioMilestone: (propertyId) =>
    set((state) => ({
      portfolioProperties: state.portfolioProperties.map((p) => {
        if (p.id === propertyId && p.nextMilestone) {
          return {
            ...p,
            nextMilestone: {
              ...p.nextMilestone,
              isPaid: true,
              paidDate: new Date().toISOString().split('T')[0],
            },
          };
        }
        return p;
      }),
    })),
});
