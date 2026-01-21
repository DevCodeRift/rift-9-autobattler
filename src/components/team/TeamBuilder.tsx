'use client';

import { useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import { UnitCard } from './UnitCard';
import { SynergyDisplay } from './SynergyDisplay';
import { calculateActiveSynergies } from '@/lib/battle/formulas';
import { createClient } from '@/lib/supabase/client';
import { GAME_CONFIG, FACTION_CONFIG } from '@/constants/game';
import type { PlayerUnit, UnitTemplate, PlayerTeam, BattleUnitSnapshot, Faction, UnitClass } from '@/types';
import { Save, RotateCcw, Info } from 'lucide-react';

interface TeamBuilderProps {
  units: Array<PlayerUnit & { template: UnitTemplate }>;
  activeTeam: PlayerTeam | null;
  playerId: string;
}

export function TeamBuilder({ units, activeTeam, playerId }: TeamBuilderProps) {
  const [teamSlots, setTeamSlots] = useState<Record<number, string>>(
    activeTeam?.unit_positions || {}
  );
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Get units that are in the team
  const teamUnits = Object.values(teamSlots)
    .map(unitId => units.find(u => u.id === unitId))
    .filter((u): u is PlayerUnit & { template: UnitTemplate } => u !== undefined);

  // Convert to BattleUnitSnapshot format for synergy calculation
  const teamSnapshots: BattleUnitSnapshot[] = teamUnits.map(unit => ({
    unit_id: unit.id,
    template_id: unit.template_id,
    name: unit.template.name,
    level: unit.level,
    star_rank: unit.star_rank,
    position: Object.entries(teamSlots).find(([, id]) => id === unit.id)?.[0]
      ? parseInt(Object.entries(teamSlots).find(([, id]) => id === unit.id)![0])
      : 0,
    faction: unit.template.faction as Faction,
    class: unit.template.class as UnitClass,
    final_stats: {
      max_health: unit.template.base_health,
      attack: unit.template.base_attack,
      defense: unit.template.base_defense,
      speed: unit.template.base_speed,
      energy: unit.template.base_energy,
      crit_rate: 5,
      crit_damage: 150,
    },
    abilities: unit.template.abilities,
    equipped_items: [],
  }));

  const activeSynergies = calculateActiveSynergies(teamSnapshots);

  // Get available units (not in team)
  const availableUnits = units.filter(
    u => !Object.values(teamSlots).includes(u.id)
  );

  const handleSlotClick = useCallback((position: number) => {
    if (selectedUnit) {
      // Place selected unit in slot
      setTeamSlots(prev => {
        // Remove unit from previous slot if it exists
        const newSlots = { ...prev };
        for (const [pos, id] of Object.entries(newSlots)) {
          if (id === selectedUnit) {
            delete newSlots[parseInt(pos)];
          }
        }
        // Add to new slot
        newSlots[position] = selectedUnit;
        return newSlots;
      });
      setSelectedUnit(null);
    } else if (teamSlots[position]) {
      // Select unit from slot
      setSelectedUnit(teamSlots[position]);
    }
  }, [selectedUnit, teamSlots]);

  const handleUnitClick = useCallback((unitId: string) => {
    if (selectedUnit === unitId) {
      setSelectedUnit(null);
    } else {
      setSelectedUnit(unitId);
    }
  }, [selectedUnit]);

  const handleRemoveFromSlot = useCallback((position: number) => {
    setTeamSlots(prev => {
      const newSlots = { ...prev };
      delete newSlots[position];
      return newSlots;
    });
  }, []);

  const handleClearTeam = useCallback(() => {
    setTeamSlots({});
    setSelectedUnit(null);
  }, []);

  const handleSaveTeam = async () => {
    setIsSaving(true);
    const supabase = createClient();

    try {
      if (activeTeam) {
        // Update existing team
        await supabase
          .from('player_teams')
          .update({ unit_positions: teamSlots })
          .eq('id', activeTeam.id);
      } else {
        // Create new team
        await supabase.from('player_teams').insert({
          player_id: playerId,
          name: 'Main Team',
          unit_positions: teamSlots,
          is_active: true,
        });
      }
    } catch (error) {
      console.error('Failed to save team:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Team Formation */}
      <div className="lg:col-span-2 space-y-6">
        {/* Battle Grid */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Battle Formation</span>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handleClearTeam}>
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Clear
                </Button>
                <Button size="sm" onClick={handleSaveTeam} isLoading={isSaving}>
                  <Save className="w-4 h-4 mr-1" />
                  Save Team
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Position Info */}
            <div className="flex items-center gap-2 mb-4 text-sm text-gray-400">
              <Info className="w-4 h-4" />
              <span>Front row (top) takes damage first. Back row (bottom) is protected.</span>
            </div>

            {/* Grid */}
            <div className="space-y-4">
              {/* Front Row Label */}
              <div className="text-xs text-gray-500 uppercase tracking-wide">Front Row</div>

              {/* Front Row Slots (0, 1, 2) */}
              <div className="grid grid-cols-3 gap-4">
                {[0, 1, 2].map(position => (
                  <TeamSlot
                    key={position}
                    position={position}
                    unit={units.find(u => u.id === teamSlots[position])}
                    isSelected={selectedUnit === teamSlots[position]}
                    isTargeted={selectedUnit !== null && !teamSlots[position]}
                    onClick={() => handleSlotClick(position)}
                    onRemove={() => handleRemoveFromSlot(position)}
                  />
                ))}
              </div>

              {/* Back Row Label */}
              <div className="text-xs text-gray-500 uppercase tracking-wide">Back Row</div>

              {/* Back Row Slots (3, 4, 5) */}
              <div className="grid grid-cols-3 gap-4">
                {[3, 4, 5].map(position => (
                  <TeamSlot
                    key={position}
                    position={position}
                    unit={units.find(u => u.id === teamSlots[position])}
                    isSelected={selectedUnit === teamSlots[position]}
                    isTargeted={selectedUnit !== null && !teamSlots[position]}
                    onClick={() => handleSlotClick(position)}
                    onRemove={() => handleRemoveFromSlot(position)}
                  />
                ))}
              </div>
            </div>

            {/* Team Stats Summary */}
            <div className="mt-6 pt-4 border-t border-gray-700">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">
                  Units: {Object.keys(teamSlots).length}/{GAME_CONFIG.MAX_TEAM_SIZE}
                </span>
                <span className="text-gray-400">
                  Synergies Active: {activeSynergies.length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Units */}
        <Card>
          <CardHeader>
            <CardTitle>Available Units ({availableUnits.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {availableUnits.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                All units are in your team or you have no units yet.
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {availableUnits.map(unit => (
                  <UnitCard
                    key={unit.id}
                    unit={unit}
                    template={unit.template}
                    isSelected={selectedUnit === unit.id}
                    onClick={() => handleUnitClick(unit.id)}
                    compact
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Synergies Panel */}
      <div className="space-y-6">
        <SynergyDisplay
          teamUnits={teamUnits}
          activeSynergies={activeSynergies}
        />

        {/* Selected Unit Details */}
        {selectedUnit && (
          <Card>
            <CardHeader>
              <CardTitle>Selected Unit</CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const unit = units.find(u => u.id === selectedUnit);
                if (!unit) return null;

                return (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                        style={{
                          backgroundColor: `${FACTION_CONFIG[unit.template.faction as Faction].color}20`,
                        }}
                      >
                        {FACTION_CONFIG[unit.template.faction as Faction].icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-white">{unit.template.name}</h4>
                        <p className="text-sm text-gray-400">
                          Lv.{unit.level} - {unit.star_rank} Stars
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-400">{unit.template.description}</p>

                    <div className="text-xs text-cyan-400">
                      Click an empty slot to place this unit
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Team Slot Component
interface TeamSlotProps {
  position: number;
  unit?: PlayerUnit & { template: UnitTemplate };
  isSelected: boolean;
  isTargeted: boolean;
  onClick: () => void;
  onRemove: () => void;
}

function TeamSlot({ position, unit, isSelected, isTargeted, onClick, onRemove }: TeamSlotProps) {
  return (
    <div
      className={`
        relative aspect-square rounded-xl border-2 border-dashed p-2
        flex flex-col items-center justify-center cursor-pointer
        transition-all duration-200
        ${isSelected
          ? 'border-cyan-500 bg-cyan-500/20'
          : isTargeted
          ? 'border-cyan-500/50 bg-cyan-500/10 animate-pulse'
          : unit
          ? 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
          : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
        }
      `}
      onClick={onClick}
    >
      {unit ? (
        <>
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-xl mb-1"
            style={{
              backgroundColor: `${FACTION_CONFIG[unit.template.faction as Faction].color}30`,
            }}
          >
            {FACTION_CONFIG[unit.template.faction as Faction].icon}
          </div>
          <span className="text-xs text-white font-medium text-center truncate w-full px-1">
            {unit.template.name}
          </span>
          <span className="text-xs text-gray-400">Lv.{unit.level}</span>

          {/* Remove button */}
          <button
            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/40 flex items-center justify-center text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            ×
          </button>
        </>
      ) : (
        <>
          <span className="text-2xl text-gray-600">+</span>
          <span className="text-xs text-gray-500">Slot {position + 1}</span>
        </>
      )}
    </div>
  );
}
