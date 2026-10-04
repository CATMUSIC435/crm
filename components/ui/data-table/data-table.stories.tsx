import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from './data-table';
import { DataTableColumnHeader } from './data-table-column-header';
import { useDataTable } from '@/hooks/table/use-data-table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

interface DemoCustomer {
  id: string;
  code: string;
  name: string;
  phone: string;
  rank: 'VVIP' | 'VIP' | 'Tiềm Năng';
  revenue: number;
  status: 'Đã giao dịch' | 'Đang tư vấn' | 'Đang chăm sóc';
}

const mockData: DemoCustomer[] = [
  { id: '1', code: 'KH-001', name: 'Nguyễn Văn An', phone: '0901234567', rank: 'VVIP', revenue: 45000000000, status: 'Đã giao dịch' },
  { id: '2', code: 'KH-002', name: 'Trần Thị Bích', phone: '0912345678', rank: 'VIP', revenue: 18500000000, status: 'Đang tư vấn' },
  { id: '3', code: 'KH-003', name: 'Lê Hoàng Nam', phone: '0923456789', rank: 'VVIP', revenue: 62000000000, status: 'Đã giao dịch' },
  { id: '4', code: 'KH-004', name: 'Phạm Thu Trang', phone: '0934567890', rank: 'Tiềm Năng', revenue: 0, status: 'Đang chăm sóc' },
  { id: '5', code: 'KH-005', name: 'Hoàng Minh Đức', phone: '0945678901', rank: 'VIP', revenue: 24000000000, status: 'Đã giao dịch' },
  { id: '6', code: 'KH-006', name: 'Đỗ Hải Đăng', phone: '0956789012', rank: 'Tiềm Năng', revenue: 5000000000, status: 'Đang tư vấn' },
  { id: '7', code: 'KH-007', name: 'Vũ Thanh Hằng', phone: '0967890123', rank: 'VIP', revenue: 15000000000, status: 'Đã giao dịch' },
  { id: '8', code: 'KH-008', name: 'Bùi Anh Tuấn', phone: '0978901234', rank: 'VVIP', revenue: 89000000000, status: 'Đã giao dịch' },
  { id: '9', code: 'KH-009', name: 'Ngô Phương Thảo', phone: '0989012345', rank: 'Tiềm Năng', revenue: 0, status: 'Đang chăm sóc' },
  { id: '10', code: 'KH-010', name: 'Đặng Quốc Huy', phone: '0990123456', rank: 'VIP', revenue: 31000000000, status: 'Đã giao dịch' },
  { id: '11', code: 'KH-011', name: 'Mai Tuyết Nhung', phone: '0909876543', rank: 'Tiềm Năng', revenue: 0, status: 'Đang tư vấn' },
  { id: '12', code: 'KH-012', name: 'Trịnh Gia Bảo', phone: '0918765432', rank: 'VVIP', revenue: 53000000000, status: 'Đã giao dịch' },
];

const columns: ColumnDef<DemoCustomer>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(val) => table.toggleAllPageRowsSelected(!!val)}
        aria-label="Chọn tất cả"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(val) => row.toggleSelected(!!val)}
        aria-label="Chọn dòng"
      />
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'code',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Mã KH" />,
    cell: ({ row }) => <span className="font-mono font-bold text-indigo-600">{row.getValue('code')}</span>,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Họ và Tên" />,
    cell: ({ row }) => <span className="font-semibold text-slate-900">{row.getValue('name')}</span>,
  },
  {
    accessorKey: 'phone',
    header: 'Số Điện Thoại',
  },
  {
    accessorKey: 'rank',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Hạng VIP" />,
    cell: ({ row }) => {
      const rank = row.getValue('rank') as string;
      const badgeClass =
        rank === 'VVIP'
          ? 'bg-amber-100 text-amber-800 border-amber-300'
          : rank === 'VIP'
          ? 'bg-indigo-100 text-indigo-800 border-indigo-300'
          : 'bg-emerald-100 text-emerald-800 border-emerald-300';
      return <Badge variant="outline" className={badgeClass}>{rank}</Badge>;
    },
  },
  {
    accessorKey: 'revenue',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Doanh Số Giao Dịch" />,
    cell: ({ row }) => {
      const rev = Number(row.getValue('revenue'));
      return (
        <span className="font-bold text-slate-800">
          {rev > 0 ? `${(rev / 1e9).toFixed(1)} Tỷ VNĐ` : 'Chưa giao dịch'}
        </span>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Trạng Thái',
    cell: ({ row }) => <Badge variant="secondary">{row.getValue('status')}</Badge>,
  },
];

export default {
  title: 'Design System/Organisms/DataTable',
  component: DataTable,
  tags: ['autodocs'],
};

export const PaginatedCustomerTable = {
  render: () => {
    const { table } = useDataTable({
      columns,
      data: mockData,
      initialPageSize: 5,
      enableRowSelection: true,
    });

    return (
      <div className="p-4 max-w-5xl">
        <h3 className="text-lg font-bold text-slate-900 mb-3">
          Danh Sách Khách Hàng VIP (TanStack Table & Pagination)
        </h3>
        <DataTable table={table} columns={columns} />
      </div>
    );
  },
};
