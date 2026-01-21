'use client';

import { cn } from '@/lib/utils';
import { Card, RarityBadge, FactionBadge, HealthBar } from '@/components/ui';
import { FACTION_CONFIG, CLASS_CONFIG } from '@/constants/game';
import type { PlayerUnit, UnitTemplate, Faction } from '@/types';
import { Star } from 'lucide-react';

interface UnitCardProps {
  unit: PlayerUnit;
  template: UnitTemplate;
  isSelected?: boolean;
  onClick?: () => void;
  compact?: boolean;
  showStats?: boolean;
}

export function UnitCard({
  unit,
  template,
  isSelected = false,
  onClick,
  compact = false,
  showStats = false,
}: UnitCardProps) {
  const factionConfig = FACTION_CONFIG[template.faction as Faction];
  const classConfig = CLASS_CONFIG[template.class];

  if (compact) {
    return (
      <div
        className={cn(
          'p-3 rounded-xl border cursor-pointer transition-all duration-200',
          isSelected
            ? 'border-cyan-500 bg-cyan-500/20 scale-[1.02]'
            : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
        )}
        onClick={onClick}
      >
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
            style={{ backgroundColor: `${factionConfig.color}30` }}
          >
            {factionConfig.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-white truncate">
              {unit.nickname || template.name}
            </h4>
            <div className="flex items-center gap-1">
              {Array.from({ length: unit.star_rank }).map((_, i) => (
                <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">Lv.{unit.level}</span>
          <RarityBadge rarity={template.rarity} />
        </div>
      </div>
    );
  }

  return (
    <Card
      rarity={template.rarity}
      hover
      glow={isSelected}
      className={cn(
        'cursor-pointer transition-all duration-200',
        isSelected && 'ring-2 ring-cyan-500'
      )}
      onClick={onClick}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0"
            style={{ backgroundColor: `${factionConfig.color}30` }}
          >
            {factionConfig.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white truncate">
              {unit.nickname || template.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <FactionBadge faction={template.faction as Faction} />
              <span className="text-xs text-gray-400">{classConfig.icon} {classConfig.name}</span>
            </div>
          </div>
        </div>

        {/* Stars and Level */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'w-4 h-4',
                  i < unit.star_rank
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-600'
                )}
              />
            ))}
          </div>
          <span className="text-sm text-gray-400">Level {unit.level}</span>
        </div>

        {/* Stats */}
        {showStats && (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">HP</span>
              <span className="text-white">{template.base_health}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">ATK</span>
              <span className="text-white">{template.base_attack}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">DEF</span>
              <span className="text-white">{template.base_defense}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">SPD</span>
              <span className="text-white">{template.base_speed}</span>
            </div>
          </div>
        )}

        {/* Rarity Badge */}
        <div className="mt-3 pt-3 border-t border-gray-700">
          <RarityBadge rarity={template.rarity} />
        </div>
      </div>
    </Card>
  );
}
