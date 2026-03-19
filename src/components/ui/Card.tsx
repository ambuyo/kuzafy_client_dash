import React from 'react';
import { cn } from '@/lib/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Removes the default padding — useful when you want full-bleed content */
  noPadding?: boolean;
}

export function Card({ noPadding, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-muted bg-background card-shadow',
        !noPadding && 'p-5 lg:p-6',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function CardHeader({ title, subtitle, action, className, ...props }: CardHeaderProps) {
  return (
    <div
      className={cn('mb-5 flex items-start justify-between gap-4', className)}
      {...props}
    >
      <div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-700">{title}</h3>
        {subtitle && (
          <p className="mt-0.5 text-sm text-gray-400">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function CardBody({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  );
}
