import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Percent, DollarSign, ArrowUpRight, Landmark } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface IrrMetricCardProps {
  propertyCode: string;
  projectName: string;
  currentValuation: number;
  buyPrice: number;
  irr: number;
  cagr: number;
  rentalYield: number;
  aiRecommendation?: string;
  className?: string;
}

export function IrrMetricCard({
  propertyCode,
  projectName,
  currentValuation,
  buyPrice,
  irr,
  cagr,
  rentalYield,
  aiRecommendation = 'Tiếp tục giữ tích sản',
  className,
}: IrrMetricCardProps) {
  const gain = currentValuation - buyPrice;
  const gainPercent = buyPrice > 0 ? ((gain / buyPrice) * 100).toFixed(1) : '0';

  return (
    <Card className={cn('border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all', className)}>
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
        <div>
          <span className="text-xs font-semibold text-slate-500">{projectName}</span>
          <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Landmark className="h-4 w-4 text-amber-500" />
            {propertyCode}
          </h4>
        </div>
        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
          {aiRecommendation}
        </Badge>
      </CardHeader>

      <CardContent className="p-4 pt-2 space-y-3">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-xs text-slate-500">Định giá hiện tại:</span>
            <p className="text-xl font-black text-slate-900 dark:text-white">
              {(currentValuation / 1e9).toFixed(2)} Tỷ
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500">Lãi vốn (Capital Gain):</span>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-end">
              <ArrowUpRight className="h-4 w-4" />+{(gain / 1e9).toFixed(2)} Tỷ (+{gainPercent}%)
            </p>
          </div>
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60">
            <span className="text-[10px] uppercase font-bold text-slate-400">IRR Dòng Tiền</span>
            <p className="text-sm font-black text-indigo-600 dark:text-indigo-400">{irr}%</p>
          </div>

          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60">
            <span className="text-[10px] uppercase font-bold text-slate-400">Tăng Trưởng CAGR</span>
            <p className="text-sm font-black text-amber-600 dark:text-amber-400">{cagr}%</p>
          </div>

          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60">
            <span className="text-[10px] uppercase font-bold text-slate-400">Yield Cho Thuê</span>
            <p className="text-sm font-black text-teal-600 dark:text-teal-400">{rentalYield}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
