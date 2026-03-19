import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/cn';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  initials?: string;
  size?: AvatarSize;
  className?: string;
}

const SIZE_CLASSES: Record<AvatarSize, string> = {
  xs: 'h-6  w-6  text-[10px]',
  sm: 'h-8  w-8  text-xs',
  md: 'h-9  w-9  text-sm',
  lg: 'h-11 w-11 text-base',
  xl: 'h-14 w-14 text-lg',
};

const SIZE_PX: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 36,
  lg: 44,
  xl: 56,
};

/**
 * Avatar
 *
 * Shows an image if `src` is provided, otherwise falls back to
 * `initials` rendered on a colored background.
 * Shadow matches the `shadow-profilePic` token from tailwind.config.ts.
 */
export function Avatar({ src, alt = '', initials, size = 'md', className }: AvatarProps) {
  const px = SIZE_PX[size];

  return (
    <div
      className={cn(
        'relative shrink-0 overflow-hidden rounded-full shadow-profilePic',
        SIZE_CLASSES[size],
        !src && 'flex items-center justify-center bg-secondary font-semibold text-secondary-foreground',
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={px}
          height={px}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{initials ?? '?'}</span>
      )}
    </div>
  );
}
