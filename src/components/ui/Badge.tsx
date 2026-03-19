import React from 'react';
import { cn } from '@/lib/cn';

type BadgeVariant = 'solid' | 'flat' | 'outline';
type BadgeColor   = 'primary' | 'secondary' | 'red' | 'green' | 'orange' | 'blue' | 'gray';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  color?: BadgeColor;
  dot?: boolean;
}

const VARIANT_CLASSES: Record<BadgeVariant, Record<BadgeColor, string>> = {
  solid: {
    primary:   'bg-primary   text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    red:       'bg-red       text-white',
    green:     'bg-green     text-white',
    orange:    'bg-orange    text-white',
    blue:      'bg-blue      text-white',
    gray:      'bg-gray-200  text-gray-700',
  },
  flat: {
    primary:   'bg-primary-lighter   text-primary',
    secondary: 'bg-secondary-lighter text-secondary',
    red:       'bg-red-lighter       text-red-dark',
    green:     'bg-green-lighter     text-green-dark',
    orange:    'bg-orange-lighter    text-orange-dark',
    blue:      'bg-blue-lighter      text-blue-dark',
    gray:      'bg-gray-100          text-gray-600',
  },
  outline: {
    primary:   'border border-primary   text-primary',
    secondary: 'border border-secondary text-secondary',
    red:       'border border-red       text-red',
    green:     'border border-green     text-green',
    orange:    'border border-orange    text-orange',
    blue:      'border border-blue      text-blue',
    gray:      'border border-gray-300  text-gray-600',
  },
};

export function Badge({
  variant = 'flat',
  color   = 'gray',
  dot     = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        VARIANT_CLASSES[variant][color],
        className,
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            color === 'primary'   && 'bg-primary',
            color === 'secondary' && 'bg-secondary',
            color === 'red'       && 'bg-red',
            color === 'green'     && 'bg-green',
            color === 'orange'    && 'bg-orange',
            color === 'blue'      && 'bg-blue',
            color === 'gray'      && 'bg-gray-400',
          )}
        />
      )}
      {children}
    </span>
  );
}
