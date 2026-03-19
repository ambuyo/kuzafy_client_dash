import React from 'react';
import { cn } from '@/lib/cn';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;      // percentage, e.g. 12.5 or -3.2
  icon?: React.ReactNode;
  className?: string;
}

/**
 * StatCard
 *
 * KPI card used on dashboard overview pages.
 * Shows a metric, optional trend arrow, and an optional icon.
 */
export function StatCard({ title, value, change, icon, className }: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;
  const isNegative = change !== undefined && change < 0;

  return (
    <div
      className={cn(
        'rounded-xl border border-muted bg-background p-5 card-shadow lg:p-6',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-400">{title}</p>
          <p className="mt-1 font-lexend text-2xl font-bold text-gray-900 dark:text-gray-700">
            {value}
          </p>

          {change !== undefined && (
            <div className="mt-2 flex items-center gap-1">
              <span
                className={cn(
                  'inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium',
                  isPositive && 'bg-green-lighter text-green-dark',
                  isNegative && 'bg-red-lighter   text-red-dark',
                )}
              >
                {isPositive ? '↑' : '↓'} {Math.abs(change)}%
              </span>
              <span className="text-xs text-gray-400">vs last month</span>
            </div>
          )}
        </div>

        {icon && (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-lighter text-primary dark:bg-primary-lighter dark:text-primary">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
