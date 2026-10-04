import { StateCreator } from 'zustand';
import { Contract } from '@/types';

export interface ContractSlice {
  contracts: Contract[];
  activeContractId: string | null;

  // Actions
  setContracts: (contracts: Contract[]) => void;
  addContract: (contract: Contract) => void;
  updateContractStatus: (id: string, status: Contract['status'], signatureHash?: string) => void;
}

export const createContractSlice: StateCreator<ContractSlice, [], [], ContractSlice> = (set) => ({
  contracts: [],
  activeContractId: null,

  setContracts: (contracts) => set({ contracts }),

  addContract: (contract) =>
    set((state) => ({
      contracts: [contract, ...state.contracts],
    })),

  updateContractStatus: (id, status, signatureHash) =>
    set((state) => ({
      contracts: state.contracts.map((c) =>
        c.id === id ? { ...c, status, ...(signatureHash ? { signatureHash } : {}) } : c
      ),
    })),
});
