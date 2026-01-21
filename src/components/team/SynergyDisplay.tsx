'use client';

import { Card, CardHeader, CardTitle, CardContent, ProgressBar } from '@/components/ui';
import { SYNERGY_BONUSES, FACTION_CONFIG } from '@/constants/game';
import type { PlayerUnit, UnitTemplate, SynergyBonus, Faction } from '@/types';

interface SynergyDisplayProps {
  teamUnits: Array<PlayerUnit & { template: UnitTemplate }>;
  activeSynergies: SynergyBonus[];
}

export function SynergyDisplay({ teamUnits, activeSynergies }: SynergyDisplayProps) {
  // Count units per faction
  const factionCounts = teamUnits.reduce((acc, unit) => {
    const faction = unit.template.faction as Faction;
    acc[faction] = (acc[faction] || 0) + 1;
    return acc;
  }, {} as Record<Faction, number>);

  // Get all factions with at least one unit or tier threshold
  const allFactions = Object.keys(FACTION_CONFIG) as Faction[];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Synergies</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {allFactions.map(faction => {
            const count = factionCounts[faction] || 0;
            const config = FACTION_CONFIG[faction];
            const tiers = SYNERGY_BONUSES[faction];
            const activeSynergy = activeSynergies.find(s => s.faction === faction);

            // Find next tier threshold
            const nextTier = tiers.find(t => t.threshold > count);
            const maxTier = tiers[tiers.length - 1];
            const progressMax = nextTier?.threshold || maxTier.threshold;

            // Skip factions with no units
            if (count === 0) return null;

            return (
              <div
                key={faction}
                className={`p-3 rounded-lg transition-all ${
                  activeSynergy
                    ? 'bg-gray-800/80 border border-gray-600'
                    : 'bg-gray-800/40'
                }`}
              >
                {/* Faction Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{config.icon}</span>
                    <span
                      className="font-medium"
                      style={{ color: activeSynergy ? config.color : '#9CA3AF' }}
                    >
                      {config.name}
                    </span>
                  </div>
                  <span
                    className={`text-sm font-bold ${
                      activeSynergy ? 'text-white' : 'text-gray-500'
                    }`}
                  >
                    {count}/{progressMax}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-2">
                  <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${(count / progressMax) * 100}%`,
                        backgroundColor: activeSynergy ? config.color : '#4B5563',
                      }}
                    />
                  </div>
                </div>

                {/* Tier Thresholds */}
                <div className="flex gap-1 mb-2">
                  {tiers.map(tier => (
                    <span
                      key={tier.threshold}
                      className={`text-xs px-1.5 py-0.5 rounded ${
                        count >= tier.threshold
                          ? 'bg-gray-600 text-white'
                          : 'bg-gray-800 text-gray-500'
                      }`}
                    >
                      {tier.threshold}
                    </span>
                  ))}
                </div>

                {/* Active Bonus */}
                {activeSynergy && (
                  <div className="text-xs text-gray-300 space-y-1">
                    {activeSynergy.bonuses.map((bonus, idx) => (
                      <div key={idx} className="flex items-center gap-1">
                        <span className="text-green-400">+</span>
                        <span>
                          {bonus.value}{bonus.is_percentage ? '%' : ''} {formatStatName(bonus.stat)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Next Tier Preview */}
                {!activeSynergy && nextTier && (
                  <div className="text-xs text-gray-500">
                    Need {nextTier.threshold - count} more for bonus
                  </div>
                )}
              </div>
            );
          })}

          {Object.keys(factionCounts).length === 0 && (
            <p className="text-gray-400 text-center py-4">
              Add units to your team to see synergies
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function formatStatName(stat: string): string {
  const names: Record<string, string> = {
    health: 'Health',
    attack: 'Attack',
    defense: 'Defense',
    speed: 'Speed',
    energy: 'Energy',
    crit_rate: 'Crit Rate',
    crit_damage: 'Crit Damage',
  };
  return names[stat] || stat;
}
