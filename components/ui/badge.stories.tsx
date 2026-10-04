import React from 'react';
import { Badge } from './badge';
import { ShieldCheck, Sparkles, CheckCircle2, Clock } from 'lucide-react';

export default {
  title: 'Design System/Atoms/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline', 'ghost'],
    },
  },
};

export const DefaultBadge = {
  args: {
    children: 'Sổ Hồng Riêng',
    variant: 'default',
  },
};

export const OutlineSuccess = {
  args: {
    children: 'Đã Bàn Giao',
    variant: 'outline',
    className: 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40',
  },
};

export const PulsingLive = {
  args: {
    children: (
      <>
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        Live PostgreSQL Engine
      </>
    ),
    variant: 'outline',
    className: 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10',
  },
};

export const SlaWarning = {
  args: {
    children: (
      <>
        <Clock className="h-3 w-3 mr-1" />
        SLA 15 Phút Giữ Chỗ
      </>
    ),
    variant: 'secondary',
    className: 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300',
  },
};
