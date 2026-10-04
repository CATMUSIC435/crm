import React from 'react';
import { SnaggingDefectCard } from './snagging-defect-card';

export default {
  title: 'Features/Handover/SnaggingDefectCard',
  component: SnaggingDefectCard,
  tags: ['autodocs'],
  decorators: [
    (Story: React.ComponentType) => (
      <div className="max-w-md p-4">
        <Story />
      </div>
    ),
  ],
};

export const CriticalDefectInProgress = {
  args: {
    id: 'SNAG-001',
    propertyCode: 'NV-Aqua-A102',
    location: 'Ban công phòng khách tầng 2',
    category: 'Thấm dột & Thoát nước',
    description: 'Đọng nước cục bộ góc ban công sau mưa lớn, phễu thu sàn bị nghẹt vữa xi măng.',
    severity: 'Khan Cap',
    contractor: 'Hòa Bình Construction',
    status: 'Dang Xu Ly',
    reportedDate: '2026-09-28',
    onToggleStatus: (id: string, newStatus: string) => alert(`Lỗi ${id} chuyển sang: ${newStatus}`),
  },
};

export const MediumDefectAwaitingInspection = {
  args: {
    id: 'SNAG-002',
    propertyCode: 'OG-Sky-B205',
    location: 'Phòng ngủ Master',
    category: 'Cửa nhôm kính & Ron cao su',
    description: 'Bản lề cửa trượt bị rít, ron cao su cách âm góc dưới bên trái có dấu hiệu bong tróc.',
    severity: 'Trung Binh',
    contractor: 'BM Windows',
    status: 'Cho Nghiem Thu',
    reportedDate: '2026-09-30',
    onToggleStatus: (id: string, newStatus: string) => alert(`Lỗi ${id} chuyển sang: ${newStatus}`),
  },
};

export const MinorDefectResolved = {
  args: {
    id: 'SNAG-003',
    propertyCode: 'AQ-Suite-08',
    location: 'Bếp ăn tầng trệt',
    category: 'Sơn & Bả hoàn thiện',
    description: 'Vết xước nhẹ cạnh tủ bếp trên, đã dặm lại sơn Dulux mã màu chuẩn.',
    severity: 'Nhe',
    contractor: 'An Cường Wood Working',
    status: 'Da Khac Phuc',
    reportedDate: '2026-09-25',
    onToggleStatus: (id: string, newStatus: string) => alert(`Lỗi ${id} chuyển sang: ${newStatus}`),
  },
};
