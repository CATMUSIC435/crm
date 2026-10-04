import React from 'react';
import { KpiCard } from './kpi-card';
import { Landmark, TrendingUp, KeyRound, AlertTriangle, ShieldCheck } from 'lucide-react';

export default {
  title: 'Design System/Molecules/KpiCard',
  component: KpiCard,
  tags: ['autodocs'],
};

export const WealthValuation = {
  args: {
    title: 'Tổng Giá Trị Danh Mục BĐS VIP',
    value: '61.1 Tỷ VNĐ',
    subText: 'Vốn ban đầu: 42.7 Tỷ (Lãi vốn +18.4 Tỷ)',
    trend: '+43.1%',
    trendType: 'positive',
    icon: Landmark,
    accentColor: 'indigo',
  },
};

export const SnaggingDefectsWarning = {
  args: {
    title: 'Khiếm Khuyết Chờ Xử Lý',
    value: '3 Lỗi',
    subText: 'Hòa Bình Corp: 2 • BM Windows: 1',
    trend: 'SLA < 72h',
    trendType: 'warning',
    icon: AlertTriangle,
    accentColor: 'amber',
  },
};

export const HandoverSuccess = {
  args: {
    title: 'Căn Hộ Đã Trao Sổ Hồng',
    value: '1 / 3 Căn',
    subText: 'Phôi sổ CN-892147/BThuan',
    trend: 'Hoàn tất 100%',
    trendType: 'positive',
    icon: KeyRound,
    accentColor: 'teal',
  },
};
