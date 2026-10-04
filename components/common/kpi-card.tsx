import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface KpiCardProps {
  title: string;
  value: string | number;
  subText?: string;
  trend?: string;
  trendType?: 'positive' | 'warning' | 'negative' | 'neutral';
  icon: LucideIcon;
  accentColor?: 'blue' | 'emerald' | 'amber' | 'indigo' | 'rose' | 'teal';
  className?: string;
}

const colorMap = {
  blue: { bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-600 dark:text-blue-400' },
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-600 dark:text-emerald-400' },
  amber: { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-600 dark:text-amber-400' },
  indigo: { bg: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-600 dark:text-indigo-400' },
  rose: { bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-600 dark:text-rose-400' },
  teal: { bg: 'bg-teal-50 dark:bg-teal-950/40', text: 'text-teal-600 dark:text-teal-400' },
};

const trendMap = {
  positive: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-500/20',
  warning: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border-amber-500/20',
  negative: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border-rose-500/20',
  neutral: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-300 dark:border-slate-700',
};

export function KpiCard({
  title,
  value,
  subText,
  trend,
  trendType = 'neutral',
  icon: Icon,
  accentColor = 'blue',
  className,
}: KpiCardProps) {
  const colors = colorMap[accentColor] || colorMap.blue;

  return (
    <Card className={cn('border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all', className)}>
      <CardContent className="p-5 flex items-center justify-between">
        <div className="space-y-1.5 max-w-[70%]">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {title}
          </p>
          <div className="flex items-baseline gap-2 flex-wrap">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {value}
            </h3>
            {trend && (
              <Badge variant="outline" className={cn('text-xs font-semibold px-2 py-0.5', trendMap[trendType])}>
                {trend}
              </Badge>
            )}
          </div>
          {subText && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {subText}
            </p>
          )}
        </div>
        <div className={cn('p-3.5 rounded-2xl flex items-center justify-center shrink-0', colors.bg, colors.text)}>
          <Icon className="h-6 w-6" />
        </div>
      </CardContent>
    </Card>
  );
}
