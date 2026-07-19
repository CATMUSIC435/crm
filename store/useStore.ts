import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppDatabase, Customer, Project, InventoryItem, Contract } from '@/types';

// Dummy Initial Data
const INITIAL_CUSTOMERS: Customer[] = [
  { id: 'c1', code: 'KH-001', name: 'Nguyễn Văn A', phone: '0901234567', email: 'nguyenvana@email.com', rank: 'VVIP', revenue: 15000000000, assignedTo: 'Lê Hoàng Anh', status: 'Đã giao dịch', createdAt: '2023-01-15' },
  { id: 'c2', code: 'KH-002', name: 'Trần Thị B', phone: '0912345678', email: 'tranthib@email.com', rank: 'VIP', revenue: 8500000000, assignedTo: 'Nguyễn Mai', status: 'Đang tư vấn', createdAt: '2023-05-20' },
  { id: 'c3', code: 'KH-003', name: 'Lê Văn C', phone: '0987654321', email: 'levanc@email.com', rank: 'Tiềm Năng', revenue: 0, assignedTo: 'Trần Khoa', status: 'Đang chăm sóc', createdAt: '2023-11-10' }
];

const INITIAL_PROJECTS: Project[] = [
  { id: 'p1', name: 'NovaWorld Phan Thiet', location: 'Phan Thiết, Bình Thuận', totalUnits: 10000, soldUnits: 6500, status: 'Đang mở bán', type: 'Biệt thự nghỉ dưỡng', revenue: 5000000000000 },
  { id: 'p2', name: 'Aqua City', location: 'Biên Hòa, Đồng Nai', totalUnits: 15000, soldUnits: 12000, status: 'Đã bàn giao', type: 'Nhà phố thương mại', revenue: 12000000000000 },
  { id: 'p3', name: 'The Grand Manhattan', location: 'Quận 1, TP.HCM', totalUnits: 1000, soldUnits: 800, status: 'Sắp mở bán', type: 'Căn hộ cao cấp', revenue: 8000000000000 }
];

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'i1', code: 'A1-01', projectId: 'p1', type: 'Biệt thự biển', price: 25000000000, area: 250, status: 'Đã bán', customerId: 'c1' },
  { id: 'i2', code: 'A1-02', projectId: 'p1', type: 'Biệt thự biển', price: 26000000000, area: 260, status: 'Trống' },
  { id: 'i3', code: 'B2-05', projectId: 'p2', type: 'Shophouse', price: 15000000000, area: 120, status: 'Booking', customerId: 'c2' },
  { id: 'i4', code: 'C3-10', projectId: 'p3', type: 'Căn hộ 3PN', price: 12000000000, area: 100, status: 'Trống' }
];

const INITIAL_CONTRACTS: Contract[] = [
  { id: 'ct1', code: 'HD-921', customerId: 'c1', inventoryId: 'i1', projectId: 'p1', value: 25000000000, date: '2023-12-01', status: 'Đã ký' }
];

interface AppState extends AppDatabase {
  // Actions for Customers
  addCustomer: (customer: Omit<Customer, 'id' | 'code' | 'createdAt'>) => void;
  updateCustomer: (id: string, data: Partial<Customer>) => void;
  
  // Actions for Inventory
  updateInventoryStatus: (id: string, status: InventoryItem['status'], customerId?: string) => void;
  
  // Actions for Contracts
  addContract: (contract: Omit<Contract, 'id' | 'code' | 'date'>) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      customers: INITIAL_CUSTOMERS,
      projects: INITIAL_PROJECTS,
      inventory: INITIAL_INVENTORY,
      contracts: INITIAL_CONTRACTS,

      addCustomer: (data) => set((state) => {
        const newId = `c${state.customers.length + 1}`;
        const newCode = `KH-${String(state.customers.length + 1).padStart(3, '0')}`;
        const newCustomer: Customer = {
          ...data,
          id: newId,
          code: newCode,
          createdAt: new Date().toISOString().split('T')[0]
        };
        return { customers: [newCustomer, ...state.customers] };
      }),

      updateCustomer: (id, data) => set((state) => ({
        customers: state.customers.map(c => c.id === id ? { ...c, ...data } : c)
      })),

      updateInventoryStatus: (id, status, customerId) => set((state) => ({
        inventory: state.inventory.map(i => i.id === id ? { ...i, status, customerId } : i)
      })),

      addContract: (data) => set((state) => {
        const newId = `ct${state.contracts.length + 1}`;
        const newCode = `HD-${String(state.contracts.length + 922).padStart(3, '0')}`;
        const newContract: Contract = {
          ...data,
          id: newId,
          code: newCode,
          date: new Date().toISOString().split('T')[0]
        };
        
        // Also update inventory status automatically
        const updatedInventory = state.inventory.map(i => 
          i.id === data.inventoryId ? { ...i, status: 'Đã bán' as const, customerId: data.customerId } : i
        );

        return { 
          contracts: [newContract, ...state.contracts],
          inventory: updatedInventory
        };
      })
    }),
    {
      name: 'novacrm-storage', // name of item in local storage
    }
  )
);
