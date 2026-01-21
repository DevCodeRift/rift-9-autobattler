'use client';

import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { ProgressBar, Tooltip } from '@/components/ui';
import { COMMANDER_XP_TABLE, RANK_CONFIG } from '@/constants/game';
import type { Player } from '@/types';
import { Bell, Settings, Zap, Gem, Coins } from 'lucide-react';

interface PlayerHeaderProps {
  player: Player | null;
}

// Currency display component
function CurrencyDisplay({
  icon: Icon,
  value,
  label,
  color,
  tooltip,
}: {
  icon: React.ElementType;
  value: number;
  label: string;
  color: 'amber' | 'cyan' | 'purple';
  tooltip: string;
}) {
  const colorClasses = {
    amber: {
      bg: 'from-amber-500/20 to-amber-500/5',
      border: 'border-amber-500/20',
      icon: 'text-amber-400',
      glow: 'group-hover:shadow-amber-500/20',
    },
    cyan: {
      bg: 'from-cyan-500/20 to-cyan-500/5',
      border: 'border-cyan-500/20',
      icon: 'text-cyan-400',
      glow: 'group-hover:shadow-cyan-500/20',
    },
    purple: {
      bg: 'from-purple-500/20 to-purple-500/5',
      border: 'border-purple-500/20',
      icon: 'text-purple-400',
      glow: 'group-hover:shadow-purple-500/20',
    },
  };

  const classes = colorClasses[color];

  return (
    <Tooltip content={tooltip} position="bottom">
      <div
        className={cn(
          'group flex items-center gap-2.5 px-4 py-2 rounded-xl',
          'bg-linear-to-r border',
          'transition-all duration-300',
          'hover:scale-105 hover:shadow-lg cursor-default',
          classes.bg,
          classes.border,
          classes.glow
        )}
      >
        <div className={cn(
          'flex items-center justify-center w-8 h-8 rounded-lg',
          'bg-black/20',
          classes.icon
        )}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-white text-sm leading-tight">
            {value.toLocaleString()}
          </span>
          <span className="text-[10px] text-gray-400 uppercase tracking-wide">
            {label}
          </span>
        </div>
      </div>
    </Tooltip>
  );
}

export function PlayerHeader({ player }: PlayerHeaderProps) {
  if (!player) {
    return (
      <header className="h-18 bg-linear-to-r from-gray-900/80 to-gray-900/60 backdrop-blur-xl border-b border-gray-700/30 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading player data...</p>
        </div>
      </header>
    );
  }

  const currentLevelXP = COMMANDER_XP_TABLE[player.commander_level - 1] || 0;
  const nextLevelXP = COMMANDER_XP_TABLE[player.commander_level] || currentLevelXP;
  const xpProgress = player.experience - currentLevelXP;
  const xpNeeded = nextLevelXP - currentLevelXP;
  const xpPercentage = Math.round((xpProgress / xpNeeded) * 100);

  const rankConfig = RANK_CONFIG[player.rank_tier];

  return (
    <header className="relative h-18 flex items-center justify-between px-6">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-r from-gray-900/95 via-gray-900/90 to-gray-900/95 backdrop-blur-xl" />
      <div className="absolute inset-0 bg-linear-to-r from-cyan-500/[0.02] via-transparent to-purple-500/[0.02]" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gray-700/50 to-transparent" />

      {/* Player Info */}
      <div className="relative flex items-center gap-4">
        {/* Avatar with glow */}
        <div className="relative group">
          <div className="absolute inset-0 bg-linear-to-br from-cyan-500 to-purple-500 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
          <div className="relative w-12 h-12 rounded-full bg-linear-to-br from-cyan-500 to-purple-500 flex items-center justify-center ring-2 ring-white/10">
            <span className="text-white font-bold text-lg">
              {player.username.charAt(0).toUpperCase()}
            </span>
          </div>
          {/* Online indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-gray-900" />
        </div>

        {/* Name, Rank, and Level */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-lg">{player.username}</span>
            <Tooltip content={`Rank: ${player.rank_tier} (${player.rank_points} RP)`} position="bottom">
              <span
                className={cn(
                  'text-xs px-2.5 py-1 rounded-full font-semibold',
                  'flex items-center gap-1',
                  'transition-transform hover:scale-105 cursor-default'
                )}
                style={{
                  backgroundColor: `${rankConfig.color}20`,
                  color: rankConfig.color,
                  boxShadow: `0 0 20px ${rankConfig.color}15`,
                }}
              >
                <span>{rankConfig.icon}</span>
                <span>{player.rank_tier.toUpperCase()}</span>
              </span>
            </Tooltip>
          </div>

          {/* Level and XP Bar */}
          <div className="flex items-center gap-3">
            <Tooltip content={`${xpProgress.toLocaleString()} / ${xpNeeded.toLocaleString()} XP (${xpPercentage}%)`} position="bottom">
              <div className="flex items-center gap-2 cursor-default">
                <span className="text-xs font-medium text-gray-400">
                  Lv. <span className="text-purple-400 font-bold">{player.commander_level}</span>
                </span>
                <div className="w-28 relative">
                  <ProgressBar
                    value={xpProgress}
                    max={xpNeeded}
                    size="sm"
                    color="purple"
                  />
                </div>
              </div>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Right Side - Currency and Actions */}
      <div className="relative flex items-center gap-4">
        {/* Currency Display */}
        <div className="flex items-center gap-3">
          <CurrencyDisplay
            icon={Coins}
            value={player.scrap}
            label="Scrap"
            color="amber"
            tooltip="Scrap - Common currency earned from battles"
          />
          <CurrencyDisplay
            icon={Zap}
            value={player.ether}
            label="Ether"
            color="cyan"
            tooltip="Ether - Used for crafting and upgrades"
          />
          <CurrencyDisplay
            icon={Gem}
            value={player.credits}
            label="Credits"
            color="purple"
            tooltip="Credits - Premium currency"
          />
        </div>

        {/* Divider */}
        <div className="w-px h-10 bg-gray-700/50" />

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <Tooltip content="Notifications" position="bottom">
            <button
              className={cn(
                'relative flex items-center justify-center w-10 h-10 rounded-xl',
                'bg-gray-800/50 hover:bg-gray-700/50',
                'text-gray-400 hover:text-white',
                'transition-all duration-200',
                'border border-transparent hover:border-gray-600/50'
              )}
            >
              <Bell className="w-5 h-5" />
              {/* Notification badge */}
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                3
              </span>
            </button>
          </Tooltip>

          <Tooltip content="Settings" position="bottom">
            <button
              className={cn(
                'flex items-center justify-center w-10 h-10 rounded-xl',
                'bg-gray-800/50 hover:bg-gray-700/50',
                'text-gray-400 hover:text-white',
                'transition-all duration-200',
                'border border-transparent hover:border-gray-600/50'
              )}
            >
              <Settings className="w-5 h-5" />
            </button>
          </Tooltip>
        </div>
      </div>
    </header>
  );
}
