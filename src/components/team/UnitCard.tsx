'use client';

import { cn } from '@/lib/utils';
import { Card, RarityBadge, FactionBadge, ProgressBar, Tooltip } from '@/components/ui';
import { FACTION_CONFIG, CLASS_CONFIG, RARITY_CONFIG } from '@/constants/game';
import type { PlayerUnit, UnitTemplate, Faction, Rarity } from '@/types';
import { Star, Swords, Shield, Zap, Heart } from 'lucide-react';

interface UnitCardProps {
  unit: PlayerUnit;
  template: UnitTemplate;
  isSelected?: boolean;
  onClick?: () => void;
  compact?: boolean;
  showStats?: boolean;
  showAbilities?: boolean;
}

export function UnitCard({
  unit,
  template,
  isSelected = false,
  onClick,
  compact = false,
  showStats = false,
  showAbilities = false,
}: UnitCardProps) {
  const factionConfig = FACTION_CONFIG[template.faction as Faction];
  const classConfig = CLASS_CONFIG[template.class];
  const rarityConfig = RARITY_CONFIG[template.rarity as Rarity];

  // Calculate actual stats based on level and stars
  const statMultiplier = 1 + (unit.level - 1) * 0.05 + (unit.star_rank - 1) * 0.1;
  const currentHealth = Math.round(template.base_health * statMultiplier);
  const currentAttack = Math.round(template.base_attack * statMultiplier);
  const currentDefense = Math.round(template.base_defense * statMultiplier);
  const currentSpeed = Math.round(template.base_speed * statMultiplier);

  if (compact) {
    return (
      <div
        className={cn(
          'group relative p-3 rounded-xl border cursor-pointer',
          'transition-all duration-300 ease-out',
          'hover:-translate-y-0.5',
          isSelected
            ? 'border-cyan-500/70 bg-cyan-500/10 shadow-lg shadow-cyan-500/20'
            : 'border-gray-700/50 bg-gray-800/30 hover:border-gray-600/70 hover:bg-gray-800/50'
        )}
        onClick={onClick}
      >
        {/* Rarity indicator line */}
        <div
          className="absolute top-0 left-3 right-3 h-0.5 rounded-full opacity-60"
          style={{ backgroundColor: rarityConfig.color }}
        />

        <div className="flex items-center gap-3">
          {/* Faction icon */}
          <div className="relative">
            <div
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center text-lg',
                'transition-transform duration-300',
                'group-hover:scale-110'
              )}
              style={{
                backgroundColor: `${factionConfig.color}20`,
                boxShadow: isSelected ? `0 0 20px ${factionConfig.color}30` : undefined,
              }}
            >
              {factionConfig.icon}
            </div>
            {/* Level badge */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">{unit.level}</span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-white truncate group-hover:text-cyan-400 transition-colors">
              {unit.nickname || template.name}
            </h4>
            <div className="flex items-center gap-1 mt-0.5">
              {Array.from({ length: unit.star_rank }).map((_, i) => (
                <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
              ))}
              {Array.from({ length: 5 - unit.star_rank }).map((_, i) => (
                <Star key={i + unit.star_rank} className="w-3 h-3 text-gray-700" />
              ))}
            </div>
          </div>

          <RarityBadge rarity={template.rarity} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'group relative rounded-2xl overflow-hidden cursor-pointer',
        'transition-all duration-300 ease-out',
        'hover:-translate-y-1 hover:shadow-2xl',
        isSelected && 'ring-2 ring-cyan-500 ring-offset-2 ring-offset-gray-950'
      )}
      onClick={onClick}
    >
      {/* Background gradient based on rarity */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `linear-gradient(135deg, ${rarityConfig.color}40 0%, transparent 60%)`,
        }}
      />

      {/* Glass background */}
      <div className="absolute inset-0 bg-linear-to-br from-gray-900/90 to-gray-900/70 backdrop-blur-xl" />

      {/* Border */}
      <div
        className={cn(
          'absolute inset-0 rounded-2xl border-2 transition-colors',
          isSelected ? 'border-cyan-500/70' : 'border-gray-700/50 group-hover:border-gray-600/70'
        )}
        style={{
          borderColor: isSelected ? undefined : `${rarityConfig.color}30`,
        }}
      />

      {/* Legendary/Epic glow effect */}
      {(template.rarity === 'legendary' || template.rarity === 'epic') && (
        <div
          className={cn(
            'absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity',
            template.rarity === 'legendary' && 'animate-pulse-glow'
          )}
          style={{
            boxShadow: `0 0 30px ${rarityConfig.color}30, inset 0 0 30px ${rarityConfig.color}10`,
          }}
        />
      )}

      {/* Content */}
      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          {/* Faction icon with glow */}
          <div className="relative">
            <div
              className="absolute inset-0 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"
              style={{ backgroundColor: factionConfig.color }}
            />
            <div
              className={cn(
                'relative w-16 h-16 rounded-xl flex items-center justify-center text-3xl',
                'border border-white/10',
                'transition-transform duration-300',
                'group-hover:scale-105'
              )}
              style={{
                backgroundColor: `${factionConfig.color}30`,
              }}
            >
              {factionConfig.icon}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white text-lg truncate group-hover:text-cyan-400 transition-colors">
              {unit.nickname || template.name}
            </h3>
            <div className="flex items-center gap-2 mt-1.5">
              <FactionBadge faction={template.faction as Faction} />
              <span className="text-xs text-gray-400 flex items-center gap-1">
                {classConfig.icon}
                <span>{classConfig.name}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Stars and Level */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'w-5 h-5 transition-all duration-300',
                  i < unit.star_rank
                    ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.5)]'
                    : 'text-gray-700'
                )}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Level</span>
            <span className="text-lg font-bold text-white">{unit.level}</span>
          </div>
        </div>

        {/* Stats Grid */}
        {showStats && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Tooltip content={`Base: ${template.base_health}`} position="top">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-800/50">
                <Heart className="w-4 h-4 text-green-400" />
                <div className="flex-1">
                  <div className="text-xs text-gray-400">HP</div>
                  <div className="text-sm font-bold text-white">{currentHealth}</div>
                </div>
              </div>
            </Tooltip>

            <Tooltip content={`Base: ${template.base_attack}`} position="top">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-800/50">
                <Swords className="w-4 h-4 text-red-400" />
                <div className="flex-1">
                  <div className="text-xs text-gray-400">ATK</div>
                  <div className="text-sm font-bold text-white">{currentAttack}</div>
                </div>
              </div>
            </Tooltip>

            <Tooltip content={`Base: ${template.base_defense}`} position="top">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-800/50">
                <Shield className="w-4 h-4 text-blue-400" />
                <div className="flex-1">
                  <div className="text-xs text-gray-400">DEF</div>
                  <div className="text-sm font-bold text-white">{currentDefense}</div>
                </div>
              </div>
            </Tooltip>

            <Tooltip content={`Base: ${template.base_speed}`} position="top">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-800/50">
                <Zap className="w-4 h-4 text-yellow-400" />
                <div className="flex-1">
                  <div className="text-xs text-gray-400">SPD</div>
                  <div className="text-sm font-bold text-white">{currentSpeed}</div>
                </div>
              </div>
            </Tooltip>
          </div>
        )}

        {/* XP Progress (if not max level) */}
        {unit.level < 100 && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-400">Experience</span>
              <span className="text-gray-400">{unit.experience} / {unit.level * 100}</span>
            </div>
            <ProgressBar
              value={unit.experience}
              max={unit.level * 100}
              size="sm"
              color="cyan"
            />
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
          <RarityBadge rarity={template.rarity} />
          {isSelected && (
            <span className="text-xs text-cyan-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Selected
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Mini card variant for battle display
interface MiniUnitCardProps {
  unit: PlayerUnit;
  template: UnitTemplate;
  health?: number;
  maxHealth?: number;
  energy?: number;
  maxEnergy?: number;
  isActive?: boolean;
}

export function MiniUnitCard({
  unit,
  template,
  health,
  maxHealth,
  energy,
  maxEnergy,
  isActive = false,
}: MiniUnitCardProps) {
  const factionConfig = FACTION_CONFIG[template.faction as Faction];
  const rarityConfig = RARITY_CONFIG[template.rarity as Rarity];

  const showHealth = health !== undefined && maxHealth !== undefined;
  const showEnergy = energy !== undefined && maxEnergy !== undefined;
  const healthPercent = showHealth ? (health / maxHealth) * 100 : 100;

  return (
    <div
      className={cn(
        'relative p-2 rounded-xl border',
        'transition-all duration-300',
        isActive
          ? 'border-cyan-500/50 bg-cyan-500/10 scale-105'
          : 'border-gray-700/30 bg-gray-800/30'
      )}
    >
      {/* Rarity glow */}
      {template.rarity === 'legendary' && (
        <div
          className="absolute inset-0 rounded-xl opacity-30 animate-pulse"
          style={{ boxShadow: `inset 0 0 20px ${rarityConfig.color}` }}
        />
      )}

      <div className="relative flex flex-col items-center gap-1">
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
          style={{ backgroundColor: `${factionConfig.color}30` }}
        >
          {factionConfig.icon}
        </div>

        {/* Name */}
        <span className="text-[10px] font-medium text-white text-center truncate w-full">
          {template.name}
        </span>

        {/* Health bar */}
        {showHealth && (
          <div className="w-full">
            <div
              className={cn(
                'h-1.5 rounded-full overflow-hidden',
                'bg-gray-700/50'
              )}
            >
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-300',
                  healthPercent > 50
                    ? 'bg-green-500'
                    : healthPercent > 25
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                )}
                style={{ width: `${healthPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Energy bar */}
        {showEnergy && (
          <div className="w-full">
            <div className="h-1 rounded-full overflow-hidden bg-gray-700/50">
              <div
                className="h-full rounded-full bg-cyan-500 transition-all duration-300"
                style={{ width: `${(energy / maxEnergy) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
