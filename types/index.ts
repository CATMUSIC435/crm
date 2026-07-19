export interface Customer {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  rank: 'VVIP' | 'VIP' | 'Tiềm Năng' | 'Mới';
  revenue: number;
  assignedTo: string;
  status: 'Đang tư vấn' | 'Đã giao dịch' | 'Đang chăm sóc';
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  location: string;
  totalUnits: number;
  soldUnits: number;
  status: 'Đang mở bán' | 'Sắp mở bán' | 'Đã bàn giao';
  type: 'Căn hộ cao cấp' | 'Biệt thự nghỉ dưỡng' | 'Nhà phố thương mại';
  revenue: number;
}

export interface InventoryItem {
  id: string;
  code: string; // e.g. A1-01
  projectId: string;
  type: string;
  price: number;
  area: number;
  status: 'Trống' | 'Booking' | 'Đã bán';
  customerId?: string; // Links to customer if booked/sold
}

export interface Contract {
  id: string;
  code: string;
  customerId: string;
  inventoryId: string;
  projectId: string;
  value: number;
  date: string;
  status: 'Đã ký' | 'Chờ duyệt' | 'Hủy';
}

export interface AppDatabase {
  customers: Customer[];
  projects: Project[];
  inventory: InventoryItem[];
  contracts: Contract[];
}
