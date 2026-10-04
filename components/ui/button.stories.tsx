import React from 'react';
import { Button } from './button';
import { KeyRound, Download, Trash2, ShieldCheck, Sparkles } from 'lucide-react';

export default {
  title: 'Design System/Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'secondary', 'ghost', 'destructive', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'xs', 'sm', 'lg', 'icon'],
    },
    disabled: { control: 'boolean' },
  },
};

export const PrimaryAction = {
  args: {
    children: 'Bàn Giao Căn Hộ',
    variant: 'default',
    size: 'default',
  },
};

export const WithHandoverIcon = {
  args: {
    children: (
      <>
        <KeyRound className="h-4 w-4 mr-1.5" />
        Ký Biên Bản Nhận Nhà
      </>
    ),
    variant: 'default',
  },
};

export const OutlineExport = {
  args: {
    children: (
      <>
        <Download className="h-4 w-4 mr-1.5 text-cyan-400" />
        Xuất Báo Cáo (CSV)
      </>
    ),
    variant: 'outline',
  },
};

export const DestructiveCancel = {
  args: {
    children: (
      <>
        <Trash2 className="h-4 w-4 mr-1.5" />
        Hủy Phiếu Giữ Chỗ
      </>
    ),
    variant: 'destructive',
  },
};
