'use client';

import { cn } from '@/lib/utils';
import { RARITY_CONFIG } from '@/constants/game';
import type { Rarity } from '@/types';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  rarity?: Rarity;
  glow?: boolean;
  hover?: boolean;
}

export function Card({
  className,
  rarity,
  glow = false,
  hover = false,
  children,
  ...props
}: CardProps) {
  const rarityConfig = rarity ? RARITY_CONFIG[rarity] : null;

  return (
    <div
      className={cn(
        'rounded-xl border bg-gray-900/80 backdrop-blur-sm p-4',
        hover && 'transition-all duration-200 hover:scale-[1.02] cursor-pointer',
        rarityConfig
          ? `border-[${rarityConfig.borderColor}]`
          : 'border-gray-700',
        glow && rarityConfig && `shadow-lg shadow-[${rarityConfig.color}]/20`,
        className
      )}
      style={rarityConfig ? {
        borderColor: rarityConfig.borderColor,
        ...(glow && { boxShadow: `0 0 20px ${rarityConfig.color}30` })
      } : undefined}
      {...props}
    >
      {children}
    </div>
  );
}

type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>;

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between mb-3', className)} {...props} />
  );
}

type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

export function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <h3 className={cn('text-lg font-bold text-white', className)} {...props} />
  );
}

type CardContentProps = React.HTMLAttributes<HTMLDivElement>;

export function CardContent({ className, ...props }: CardContentProps) {
  return (
    <div className={cn('text-gray-300', className)} {...props} />
  );
}

type CardFooterProps = React.HTMLAttributes<HTMLDivElement>;

export function CardFooter({ className, ...props }: CardFooterProps) {
  return (
    <div className={cn('flex items-center justify-end gap-2 mt-4 pt-3 border-t border-gray-700', className)} {...props} />
  );
}
