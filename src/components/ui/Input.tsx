import React from 'react';
import { cn } from '@/lib/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  /** Visual size — does not affect the HTML size attribute */
  inputSize?: 'sm' | 'md' | 'lg';
}

const SIZE_CLASSES = {
  sm: 'h-8  px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-4 text-base',
};

/**
 * Input
 *
 * Styled text input that follows Isomorphic's form field design:
 * - Gray border, focus ring in primary color
 * - Error state uses red token
 * - Supports left/right icon slots
 * - Label + hint + error message all included
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      inputSize = 'md',
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-600"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              // Base
              'w-full rounded-lg border bg-background text-gray-800 outline-none transition-colors',
              'placeholder:text-gray-400 dark:text-gray-700 dark:placeholder:text-gray-400',
              // Border
              error
                ? 'border-red focus:border-red focus:ring-2 focus:ring-red/20'
                : 'border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/10',
              // Disabled
              'disabled:cursor-not-allowed disabled:opacity-50',
              // Size
              SIZE_CLASSES[inputSize],
              // Icon padding
              leftIcon  && 'pl-10',
              rightIcon && 'pr-10',
              className,
            )}
            {...props}
          />

          {rightIcon && (
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
              {rightIcon}
            </span>
          )}
        </div>

        {(error || hint) && (
          <p
            className={cn(
              'mt-1.5 text-xs',
              error ? 'text-red' : 'text-gray-400',
            )}
          >
            {error ?? hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
