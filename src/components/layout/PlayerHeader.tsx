'use client';

import { formatCurrency } from '@/lib/utils';
import { ProgressBar } from '@/components/ui';
import { COMMANDER_XP_TABLE, RANK_CONFIG } from '@/constants/game';
import type { Player } from '@/types';

interface PlayerHeaderProps {
  player: Player | null;
}

export function PlayerHeader({ player }: PlayerHeaderProps) {
  if (!player) {
    return (
      <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-center">
        <p className="text-gray-400">Loading player data...</p>
      </header>
    );
  }

  const currentLevelXP = COMMANDER_XP_TABLE[player.commander_level - 1] || 0;
  const nextLevelXP = COMMANDER_XP_TABLE[player.commander_level] || currentLevelXP;
  const xpProgress = player.experience - currentLevelXP;
  const xpNeeded = nextLevelXP - currentLevelXP;

  const rankConfig = RANK_CONFIG[player.rank_tier];

  return (
    <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6">
      {/* Player Info */}
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
          <span className="text-white font-bold">
            {player.username.charAt(0).toUpperCase()}
          </span>
        </div>

        {/* Name and Level */}
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">{player.username}</span>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: `${rankConfig.color}20`,
                color: rankConfig.color,
              }}
            >
              {rankConfig.icon} {player.rank_tier.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">
              Lv. {player.commander_level}
            </span>
            <div className="w-24">
              <ProgressBar
                value={xpProgress}
                max={xpNeeded}
                size="sm"
                color="purple"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Currency Display */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg">
          <span className="text-lg">⚙️</span>
          <span className="font-bold text-white">{formatCurrency(player.scrap, 'scrap').replace('⚙️ ', '')}</span>
          <span className="text-xs text-gray-400">Scrap</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg">
          <span className="text-lg">✨</span>
          <span className="font-bold text-white">{formatCurrency(player.ether, 'ether').replace('✨ ', '')}</span>
          <span className="text-xs text-gray-400">Ether</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg">
          <span className="text-lg">💎</span>
          <span className="font-bold text-white">{formatCurrency(player.credits, 'credits').replace('💎 ', '')}</span>
          <span className="text-xs text-gray-400">Credits</span>
        </div>
      </div>
    </header>
  );
}
