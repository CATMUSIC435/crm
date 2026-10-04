'use client';

import React from 'react';
import { Column } from '@tanstack/react-table';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn('text-xs font-semibold text-slate-700 dark:text-slate-300', className)}>{title}</div>;
  }

  const isSorted = column.getIsSorted();

  return (
    <div className={cn('flex items-center space-x-1', className)}>
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 text-xs font-semibold text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
        onClick={() => column.toggleSorting(isSorted === 'asc')}
      >
        <span>{title}</span>
        {isSorted === 'desc' ? (
          <ArrowDown className="ml-1.5 h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
        ) : isSorted === 'asc' ? (
          <ArrowUp className="ml-1.5 h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
        ) : (
          <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 text-slate-400 opacity-60" />
        )}
      </Button>
    </div>
  );
}
