'use client';

import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  barClassName?: string;
  showLabel?: boolean;
  labelFormat?: 'percentage' | 'value' | 'both';
  color?: 'cyan' | 'green' | 'red' | 'purple' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export function ProgressBar({
  value,
  max,
  className,
  barClassName,
  showLabel = false,
  labelFormat = 'percentage',
  color = 'cyan',
  size = 'md',
  animated = false,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const colors = {
    cyan: 'bg-cyan-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    yellow: 'bg-yellow-500',
  };

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const formatLabel = () => {
    switch (labelFormat) {
      case 'percentage':
        return `${Math.round(percentage)}%`;
      case 'value':
        return `${value}/${max}`;
      case 'both':
        return `${value}/${max} (${Math.round(percentage)}%)`;
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>{formatLabel()}</span>
        </div>
      )}
      <div className={cn('w-full bg-gray-700 rounded-full overflow-hidden', sizes[size])}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300',
            colors[color],
            animated && 'animate-pulse',
            barClassName
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Health bar variant with color gradient based on health
export function HealthBar({
  current,
  max,
  className,
}: {
  current: number;
  max: number;
  className?: string;
}) {
  const percentage = (current / max) * 100;
  let color: 'green' | 'yellow' | 'red' = 'green';

  if (percentage <= 25) {
    color = 'red';
  } else if (percentage <= 50) {
    color = 'yellow';
  }

  return (
    <ProgressBar
      value={current}
      max={max}
      color={color}
      size="sm"
      className={className}
    />
  );
}

// Energy bar variant
export function EnergyBar({
  current,
  max,
  className,
}: {
  current: number;
  max: number;
  className?: string;
}) {
  return (
    <ProgressBar
      value={current}
      max={max}
      color="cyan"
      size="sm"
      className={className}
    />
  );
}
