'use client';

import { cn } from '@/lib/utils';
import { RARITY_CONFIG } from '@/constants/game';
import type { Rarity } from '@/types';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  rarity?: Rarity;
  glow?: boolean;
  hover?: boolean;
  variant?: 'default' | 'glass' | 'solid' | 'outline';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  className,
  rarity,
  glow = false,
  hover = false,
  variant = 'default',
  padding = 'md',
  children,
  ...props
}: CardProps) {
  const rarityConfig = rarity ? RARITY_CONFIG[rarity] : null;

  const variants = {
    default: cn(
      'bg-linear-to-br from-gray-900/90 to-gray-900/70',
      'backdrop-blur-xl',
      'border border-gray-700/50',
      'shadow-xl shadow-black/20'
    ),
    glass: cn(
      'bg-linear-to-br from-white/[0.08] to-white/[0.02]',
      'backdrop-blur-xl',
      'border border-white/10',
      'shadow-xl shadow-black/30'
    ),
    solid: cn(
      'bg-gray-900',
      'border border-gray-800'
    ),
    outline: cn(
      'bg-transparent',
      'border-2 border-gray-700'
    ),
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const hoverStyles = hover ? cn(
    'transition-all duration-300 ease-out cursor-pointer',
    'hover:scale-[1.02] hover:-translate-y-1',
    'hover:shadow-2xl hover:shadow-black/30',
    'hover:border-gray-600/70',
    'active:scale-[1.01]'
  ) : '';

  const getRarityStyles = () => {
    if (!rarityConfig) return {};

    const baseStyle: React.CSSProperties = {
      borderColor: `${rarityConfig.borderColor}80`,
    };

    if (glow) {
      baseStyle.boxShadow = `0 0 30px ${rarityConfig.color}25, inset 0 0 60px ${rarityConfig.color}05`;
    }

    return baseStyle;
  };

  return (
    <div
      className={cn(
        'relative rounded-2xl overflow-hidden',
        variants[variant],
        paddings[padding],
        hoverStyles,
        rarity === 'legendary' && glow && 'animate-pulse-glow',
        className
      )}
      style={rarityConfig ? getRarityStyles() : undefined}
      {...props}
    >
      {/* Subtle inner highlight */}
      <div
        className="absolute inset-0 bg-linear-to-br from-white/[0.03] via-transparent to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Holographic effect for legendary items */}
      {rarity === 'legendary' && glow && (
        <div
          className="absolute inset-0 holo-effect pointer-events-none"
          aria-hidden="true"
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  action?: React.ReactNode;
}

export function CardHeader({ className, action, children, ...props }: CardHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 mb-4',
        className
      )}
      {...props}
    >
      <div className="flex-1 min-w-0">
        {children}
      </div>
      {action && (
        <div className="shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  subtitle?: string;
}

export function CardTitle({
  className,
  as: Component = 'h3',
  subtitle,
  children,
  ...props
}: CardTitleProps) {
  return (
    <div className="space-y-1">
      <Component
        className={cn(
          'text-lg font-bold text-white tracking-tight',
          className
        )}
        {...props}
      >
        {children}
      </Component>
      {subtitle && (
        <p className="text-sm text-gray-400">{subtitle}</p>
      )}
    </div>
  );
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  noPadding?: boolean;
}

export function CardContent({ className, noPadding, ...props }: CardContentProps) {
  return (
    <div
      className={cn(
        'text-gray-300',
        !noPadding && 'py-1',
        className
      )}
      {...props}
    />
  );
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'left' | 'center' | 'right' | 'between';
}

export function CardFooter({ className, align = 'right', ...props }: CardFooterProps) {
  const alignments = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between',
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 mt-4 pt-4',
        'border-t border-gray-700/50',
        alignments[align],
        className
      )}
      {...props}
    />
  );
}

// Stat Card - a specialized card for displaying statistics
interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'cyan' | 'purple' | 'green' | 'yellow' | 'red';
  className?: string;
}

export function StatCard({
  label,
  value,
  icon,
  trend,
  color = 'cyan',
  className
}: StatCardProps) {
  const colors = {
    cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/30',
    purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/30',
    green: 'from-green-500/20 to-green-500/5 border-green-500/30',
    yellow: 'from-yellow-500/20 to-yellow-500/5 border-yellow-500/30',
    red: 'from-red-500/20 to-red-500/5 border-red-500/30',
  };

  const iconColors = {
    cyan: 'text-cyan-400',
    purple: 'text-purple-400',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    red: 'text-red-400',
  };

  return (
    <div
      className={cn(
        'relative rounded-xl p-4 overflow-hidden',
        'bg-linear-to-br border',
        colors[color],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-gray-400 font-medium">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {trend && (
            <p className={cn(
              'text-xs font-medium',
              trend.isPositive ? 'text-green-400' : 'text-red-400'
            )}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        {icon && (
          <div className={cn('p-2 rounded-lg bg-black/20', iconColors[color])}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
