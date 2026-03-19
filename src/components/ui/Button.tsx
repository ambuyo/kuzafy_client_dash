import React from 'react';
import { cn } from '@/lib/cn';

type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'flat';
type ButtonSize    = 'sm' | 'md' | 'lg';
type ButtonColor   = 'primary' | 'secondary' | 'red' | 'green' | 'orange';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  color?: ButtonColor;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-8  px-3   text-xs  gap-1.5',
  md: 'h-10 px-4   text-sm  gap-2',
  lg: 'h-12 px-5   text-base gap-2.5',
};

const VARIANT_CLASSES: Record<ButtonVariant, Record<ButtonColor, string>> = {
  solid: {
    primary:   'bg-primary   text-primary-foreground   hover:bg-primary-dark',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary-dark',
    red:       'bg-red       text-white                hover:bg-red-dark',
    green:     'bg-green     text-white                hover:bg-green-dark',
    orange:    'bg-orange    text-white                hover:bg-orange-dark',
  },
  outline: {
    primary:   'border border-primary   text-primary   hover:bg-primary-lighter',
    secondary: 'border border-secondary text-secondary hover:bg-secondary-lighter',
    red:       'border border-red       text-red       hover:bg-red-lighter',
    green:     'border border-green     text-green     hover:bg-green-lighter',
    orange:    'border border-orange    text-orange    hover:bg-orange-lighter',
  },
  ghost: {
    primary:   'text-primary   hover:bg-primary-lighter',
    secondary: 'text-secondary hover:bg-secondary-lighter',
    red:       'text-red       hover:bg-red-lighter',
    green:     'text-green     hover:bg-green-lighter',
    orange:    'text-orange    hover:bg-orange-lighter',
  },
  flat: {
    primary:   'bg-primary-lighter   text-primary   hover:bg-primary/20',
    secondary: 'bg-secondary-lighter text-secondary hover:bg-secondary/20',
    red:       'bg-red-lighter       text-red       hover:bg-red/20',
    green:     'bg-green-lighter     text-green     hover:bg-green/20',
    orange:    'bg-orange-lighter    text-orange    hover:bg-orange/20',
  },
};

export function Button({
  variant = 'solid',
  size    = 'md',
  color   = 'primary',
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        // Base
        'inline-flex items-center justify-center rounded-lg font-medium',
        'transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        // Variant + color
        SIZE_CLASSES[size],
        VARIANT_CLASSES[variant][color],
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <span className="h-4 w-4 animate-spinner-ease-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  );
}
