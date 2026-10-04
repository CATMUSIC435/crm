import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lock, Bed, Bath, Compass, Maximize2, Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface UnitCardProps {
  code: string;
  projectName: string;
  type: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  direction?: string;
  status: 'Trống' | 'Đang giữ chỗ' | 'Đã cọc' | 'Đã bán';
  remainingSeconds?: number;
  onLockUnit?: (code: string) => void;
  onViewDetail?: (code: string) => void;
  className?: string;
}

const statusConfig = {
  'Trống': {
    badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-500/30',
    label: 'Đang mở bán',
  },
  'Đang giữ chỗ': {
    badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-500/30',
    label: 'Đang giữ chỗ SLA',
  },
  'Đã cọc': {
    badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-500/30',
    label: 'Chờ ký hợp đồng',
  },
  'Đã bán': {
    badge: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-300',
    label: 'Đã hoàn tất bán',
  },
};

export function UnitCard({
  code,
  projectName,
  type,
  price,
  area,
  bedrooms,
  bathrooms,
  direction,
  status,
  remainingSeconds,
  onLockUnit,
  onViewDetail,
  className,
}: UnitCardProps) {
  const formattedPrice = (price / 1e9).toFixed(2) + ' Tỷ VNĐ';
  const config = statusConfig[status] || statusConfig['Trống'];

  return (
    <Card className={cn('border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all', className)}>
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
        <div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{projectName}</span>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{code}</h4>
        </div>
        <Badge variant="outline" className={cn('text-xs font-semibold', config.badge)}>
          {config.label}
        </Badge>
      </CardHeader>

      <CardContent className="p-4 pt-1 space-y-3">
        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">{type}</p>

        <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1.5">
            <Maximize2 className="h-3.5 w-3.5 text-slate-400" />
            <span>{area} m²</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bed className="h-3.5 w-3.5 text-slate-400" />
            <span>{bedrooms} PN</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="h-3.5 w-3.5 text-slate-400" />
            <span>{bathrooms} WC</span>
          </div>
        </div>

        {direction && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Compass className="h-3.5 w-3.5 text-slate-400" />
            <span>Hướng: {direction}</span>
          </div>
        )}

        <div className="pt-1 flex items-baseline justify-between">
          <span className="text-xs text-slate-500">Giá niêm yết:</span>
          <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">{formattedPrice}</span>
        </div>

        {status === 'Đang giữ chỗ' && remainingSeconds !== undefined && (
          <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs">
            <span className="flex items-center gap-1 font-medium">
              <Clock className="h-3.5 w-3.5 animate-pulse" /> Thời hạn SLA:
            </span>
            <span className="font-mono font-bold">
              {Math.floor(remainingSeconds / 60)}:{(remainingSeconds % 60).toString().padStart(2, '0')}
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        {status === 'Trống' && onLockUnit && (
          <Button
            size="sm"
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs"
            onClick={() => onLockUnit(code)}
          >
            <Lock className="h-3.5 w-3.5 mr-1" /> Khóa Giữ Chỗ
          </Button>
        )}
        {onViewDetail && (
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-slate-200 dark:border-slate-800 text-xs font-semibold"
            onClick={() => onViewDetail(code)}
          >
            Chi Tiết Căn
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
