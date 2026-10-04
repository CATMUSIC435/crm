import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wrench, CheckCircle, Clock, AlertTriangle, Building, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SnaggingDefectCardProps {
  id: string;
  propertyCode: string;
  location: string;
  category: string;
  description: string;
  severity: 'Nhe' | 'Trung Binh' | 'Khan Cap';
  contractor: string;
  status: 'Dang Xu Ly' | 'Cho Nghiem Thu' | 'Da Khac Phuc';
  reportedDate: string;
  onToggleStatus?: (id: string, newStatus: string) => void;
  className?: string;
}

const severityConfig = {
  'Nhe': { badge: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300', label: 'Lỗi Nhẹ' },
  'Trung Binh': { badge: 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300', label: 'Trung Bình' },
  'Khan Cap': { badge: 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300', label: 'Khẩn Cấp' },
};

const statusConfig = {
  'Dang Xu Ly': { badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300', label: 'Đang Xử Lý', icon: Clock },
  'Cho Nghiem Thu': { badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300', label: 'Chờ Nghiệm Thu', icon: AlertTriangle },
  'Da Khac Phuc': { badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300', label: 'Đã Khắc Phục', icon: CheckCircle },
};

export function SnaggingDefectCard({
  id,
  propertyCode,
  location,
  category,
  description,
  severity,
  contractor,
  status,
  reportedDate,
  onToggleStatus,
  className,
}: SnaggingDefectCardProps) {
  const sev = severityConfig[severity] || severityConfig['Nhe'];
  const st = statusConfig[status] || statusConfig['Dang Xu Ly'];
  const StatusIcon = st.icon;

  return (
    <Card className={cn('border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all', className)}>
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
            {id}
          </Badge>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">[{propertyCode}]</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Badge variant="outline" className={cn('text-xs font-semibold', sev.badge)}>
            {sev.label}
          </Badge>
          <Badge variant="outline" className={cn('text-xs font-semibold flex items-center gap-1', st.badge)}>
            <StatusIcon className="h-3 w-3" />
            {st.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-1 space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <MapPin className="h-3.5 w-3.5 text-slate-400" />
          <span className="font-medium text-slate-700 dark:text-slate-300">{location}</span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="text-xs text-slate-500">{category}</span>
        </div>

        <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
          {description}
        </p>

        <div className="flex items-center justify-between pt-1 text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800">
          <span className="flex items-center gap-1">
            <Building className="h-3.5 w-3.5 text-slate-400" /> Tổng thầu: <strong className="text-slate-700 dark:text-slate-300">{contractor}</strong>
          </span>
          <span>Báo ngày: {reportedDate}</span>
        </div>
      </CardContent>

      {onToggleStatus && (
        <CardFooter className="p-4 pt-0">
          {status !== 'Da Khac Phuc' ? (
            <Button
              size="sm"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs"
              onClick={() => onToggleStatus(id, 'Da Khac Phuc')}
            >
              <CheckCircle className="h-3.5 w-3.5 mr-1" /> Xác Nhận Đã Khắc Phục Lỗi
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="w-full border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600"
              onClick={() => onToggleStatus(id, 'Dang Xu Ly')}
            >
              Mở Lại Hồ Sơ Lỗi (Re-open)
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
