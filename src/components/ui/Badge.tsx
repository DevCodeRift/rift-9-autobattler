'use client';

import { cn } from '@/lib/utils';
import { RARITY_CONFIG, FACTION_CONFIG } from '@/constants/game';
import type { Rarity, Faction } from '@/types';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'rarity' | 'faction';
  rarity?: Rarity;
  faction?: Faction;
}

export function Badge({
  className,
  variant = 'default',
  rarity,
  faction,
  children,
  ...props
}: BadgeProps) {
  let styles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  let customStyle: React.CSSProperties = {};

  if (variant === 'rarity' && rarity) {
    const config = RARITY_CONFIG[rarity];
    customStyle = {
      backgroundColor: config.bgColor,
      color: config.color,
      borderColor: config.borderColor,
    };
    styles += ' border';
  } else if (variant === 'faction' && faction) {
    const config = FACTION_CONFIG[faction];
    customStyle = {
      backgroundColor: `${config.color}20`,
      color: config.color,
      borderColor: `${config.color}40`,
    };
    styles += ' border';
  } else {
    styles += ' bg-gray-700 text-gray-300';
  }

  return (
    <span
      className={cn(styles, className)}
      style={customStyle}
      {...props}
    >
      {variant === 'faction' && faction && (
        <span className="mr-1">{FACTION_CONFIG[faction].icon}</span>
      )}
      {children}
    </span>
  );
}

// Specific badge for rarity display
export function RarityBadge({ rarity }: { rarity: Rarity }) {
  return (
    <Badge variant="rarity" rarity={rarity}>
      {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
    </Badge>
  );
}

// Specific badge for faction display
export function FactionBadge({ faction }: { faction: Faction }) {
  return (
    <Badge variant="faction" faction={faction}>
      {FACTION_CONFIG[faction].name}
    </Badge>
  );
}
