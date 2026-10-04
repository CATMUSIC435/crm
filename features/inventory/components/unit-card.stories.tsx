import React from 'react';
import { UnitCard } from './unit-card';

export default {
  title: 'Features/Inventory/UnitCard',
  component: UnitCard,
  tags: ['autodocs'],
  decorators: [
    (Story: React.ComponentType) => (
      <div className="max-w-sm p-4">
        <Story />
      </div>
    ),
  ],
};

export const AvailableUnit = {
  args: {
    code: 'NV-Aqua-A102',
    projectName: 'NovaWorld Phan Thiet',
    type: 'Biệt Thự Đơn Lập View Biển',
    price: 18500000000,
    area: 250,
    bedrooms: 4,
    bathrooms: 4,
    direction: 'Đông Nam',
    status: 'Trống',
    onLockUnit: (code: string) => alert(`Khóa giữ chỗ căn ${code}`),
    onViewDetail: (code: string) => alert(`Xem chi tiết căn ${code}`),
  },
};

export const HeldWithSlaLock = {
  args: {
    code: 'OG-Sky-B205',
    projectName: 'The Origami - Vinhomes Grand Park',
    type: 'Căn Hộ Cao Cấp 2PN+',
    price: 4200000000,
    area: 69,
    bedrooms: 2,
    bathrooms: 2,
    direction: 'Đông Bắc',
    status: 'Đang giữ chỗ',
    remainingSeconds: 642,
    onViewDetail: (code: string) => alert(`Xem chi tiết căn ${code}`),
  },
};

export const DepositConfirmed = {
  args: {
    code: 'AQ-Suite-08',
    projectName: 'Aqua City The Phoenix',
    type: 'Shophouse Phố Đi Bộ',
    price: 14800000000,
    area: 160,
    bedrooms: 3,
    bathrooms: 3,
    direction: 'Nam',
    status: 'Đã cọc',
    onViewDetail: (code: string) => alert(`Xem chi tiết căn ${code}`),
  },
};

export const SoldUnit = {
  args: {
    code: 'GS-Villa-V01',
    projectName: 'Grand Sapphire',
    type: 'Dinh Thự Đảo VIP',
    price: 38400000000,
    area: 450,
    bedrooms: 5,
    bathrooms: 6,
    direction: 'Tây Nam',
    status: 'Đã bán',
    onViewDetail: (code: string) => alert(`Xem chi tiết căn ${code}`),
  },
};
