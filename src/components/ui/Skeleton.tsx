import React from 'react';
import { cn } from '@/lib/cn';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Render as a circle (e.g. for avatars) */
  circle?: boolean;
  /** Height — defaults to h-4 */
  height?: string;
  /** Width — defaults to w-full */
  width?: string;
}

/**
 * Skeleton
 *
 * Placeholder loading state that matches Isomorphic's animated wave pattern.
 * Uses the `skeleton` background-image defined in tailwind.config.ts.
 */
export function Skeleton({ circle, height, width, className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-gray-100 dark:bg-gray-200',
        circle ? 'rounded-full' : 'rounded-md',
        height ?? 'h-4',
        width  ?? 'w-full',
        className,
      )}
      {...props}
    >
      {/* Animated wave overlay */}
      <div className="absolute inset-0 -translate-x-full animate-skeleton bg-skeleton dark:bg-skeleton-dark" />
    </div>
  );
}
