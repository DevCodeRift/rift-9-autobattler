'use client';

import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'glow';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    isLoading,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props
  }, ref) => {
    const baseStyles = cn(
      'relative inline-flex items-center justify-center font-medium',
      'transition-all duration-300 ease-out',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
      'active:scale-[0.98]',
      'overflow-hidden'
    );

    const variants = {
      primary: cn(
        'bg-gradient-to-r from-cyan-600 to-cyan-500',
        'hover:from-cyan-500 hover:to-cyan-400',
        'text-white font-semibold',
        'shadow-lg shadow-cyan-500/25',
        'hover:shadow-xl hover:shadow-cyan-500/30',
        'focus-visible:ring-cyan-500',
        'border border-cyan-400/20'
      ),
      secondary: cn(
        'bg-gradient-to-r from-purple-600 to-purple-500',
        'hover:from-purple-500 hover:to-purple-400',
        'text-white font-semibold',
        'shadow-lg shadow-purple-500/25',
        'hover:shadow-xl hover:shadow-purple-500/30',
        'focus-visible:ring-purple-500',
        'border border-purple-400/20'
      ),
      danger: cn(
        'bg-gradient-to-r from-red-600 to-red-500',
        'hover:from-red-500 hover:to-red-400',
        'text-white font-semibold',
        'shadow-lg shadow-red-500/25',
        'hover:shadow-xl hover:shadow-red-500/30',
        'focus-visible:ring-red-500',
        'border border-red-400/20'
      ),
      ghost: cn(
        'bg-transparent',
        'hover:bg-white/5',
        'text-gray-300 hover:text-white',
        'focus-visible:ring-gray-500'
      ),
      outline: cn(
        'border-2 border-gray-600',
        'hover:border-cyan-500/70',
        'text-gray-300 hover:text-cyan-400',
        'bg-transparent hover:bg-cyan-500/5',
        'focus-visible:ring-cyan-500'
      ),
      glow: cn(
        'bg-gradient-to-r from-cyan-600 via-purple-600 to-cyan-600',
        'bg-[length:200%_100%]',
        'animate-[shimmer_3s_ease-in-out_infinite]',
        'text-white font-bold',
        'shadow-lg shadow-cyan-500/30',
        'hover:shadow-xl hover:shadow-purple-500/40',
        'focus-visible:ring-purple-500',
        'border border-white/10'
      ),
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
      md: 'px-4 py-2 text-sm rounded-lg gap-2',
      lg: 'px-6 py-2.5 text-base rounded-xl gap-2',
      xl: 'px-8 py-3.5 text-lg rounded-xl gap-3',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {/* Shine effect overlay */}
        <span
          className={cn(
            'absolute inset-0 -translate-x-full',
            'bg-gradient-to-r from-transparent via-white/10 to-transparent',
            'group-hover:translate-x-full transition-transform duration-700',
            'pointer-events-none'
          )}
          aria-hidden="true"
        />

        {/* Button content */}
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

// Icon Button variant for square icon-only buttons
interface IconButtonProps extends Omit<ButtonProps, 'leftIcon' | 'rightIcon'> {
  icon: React.ReactNode;
  'aria-label': string;
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, size = 'md', icon, ...props }, ref) => {
    const sizes = {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12',
      xl: 'w-14 h-14',
    };

    return (
      <Button
        ref={ref}
        className={cn(sizes[size], 'px-0', className)}
        size={size}
        {...props}
      >
        {icon}
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';

export { Button, IconButton };
