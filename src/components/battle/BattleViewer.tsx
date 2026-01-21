'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, Button, HealthBar, EnergyBar } from '@/components/ui';
import { FACTION_CONFIG } from '@/constants/game';
import type { BattleTick, BattleTeamSnapshot, BattleUnitSnapshot, Faction } from '@/types';
import { Play, Pause, FastForward, SkipForward, RotateCcw } from 'lucide-react';

interface BattleViewerProps {
  team1: BattleTeamSnapshot;
  team2: BattleTeamSnapshot;
  battleLog: BattleTick[];
  onComplete?: () => void;
}

interface UnitState {
  id: string;
  name: string;
  faction: Faction;
  maxHealth: number;
  currentHealth: number;
  maxEnergy: number;
  currentEnergy: number;
  isAlive: boolean;
  position: number;
  team: 1 | 2;
}

export function BattleViewer({ team1, team2, battleLog, onComplete }: BattleViewerProps) {
  const [currentTick, setCurrentTick] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [unitStates, setUnitStates] = useState<Map<string, UnitState>>(new Map());
  const [battleEvents, setBattleEvents] = useState<string[]>([]);

  // Initialize unit states
  useEffect(() => {
    const initialStates = new Map<string, UnitState>();

    team1.units.forEach(unit => {
      initialStates.set(unit.unit_id, {
        id: unit.unit_id,
        name: unit.name,
        faction: unit.faction,
        maxHealth: unit.final_stats.max_health,
        currentHealth: unit.final_stats.max_health,
        maxEnergy: unit.final_stats.energy,
        currentEnergy: 0,
        isAlive: true,
        position: unit.position,
        team: 1,
      });
    });

    team2.units.forEach(unit => {
      initialStates.set(unit.unit_id, {
        id: unit.unit_id,
        name: unit.name,
        faction: unit.faction,
        maxHealth: unit.final_stats.max_health,
        currentHealth: unit.final_stats.max_health,
        maxEnergy: unit.final_stats.energy,
        currentEnergy: 0,
        isAlive: true,
        position: unit.position,
        team: 2,
      });
    });

    setUnitStates(initialStates);
  }, [team1, team2]);

  // Process battle tick
  const processTick = useCallback((tickNumber: number) => {
    if (tickNumber >= battleLog.length) {
      setIsPlaying(false);
      onComplete?.();
      return;
    }

    const tick = battleLog[tickNumber];
    const newEvents: string[] = [];

    setUnitStates(prev => {
      const newStates = new Map(prev);

      for (const event of tick.events) {
        const sourceUnit = newStates.get(event.source_unit_id);

        switch (event.type) {
          case 'damage': {
            for (const targetId of event.target_unit_ids) {
              const target = newStates.get(targetId);
              if (target) {
                const damage = event.values.damage || 0;
                const isCrit = event.values.isCrit === 1;
                target.currentHealth = Math.max(0, target.currentHealth - damage);

                newEvents.push(
                  `${sourceUnit?.name || 'Unknown'} deals ${damage}${isCrit ? ' CRIT' : ''} damage to ${target.name}`
                );
              }
            }
            break;
          }

          case 'heal': {
            for (const targetId of event.target_unit_ids) {
              const target = newStates.get(targetId);
              if (target) {
                const amount = event.values.amount || 0;
                target.currentHealth = Math.min(target.maxHealth, target.currentHealth + amount);

                newEvents.push(
                  `${sourceUnit?.name || 'Unknown'} heals ${target.name} for ${amount}`
                );
              }
            }
            break;
          }

          case 'death': {
            for (const targetId of event.target_unit_ids) {
              const target = newStates.get(targetId);
              if (target) {
                target.isAlive = false;
                target.currentHealth = 0;

                newEvents.push(`${target.name} has been defeated!`);
              }
            }
            break;
          }

          case 'ability': {
            newEvents.push(`${sourceUnit?.name || 'Unknown'} uses an ability`);
            break;
          }

          case 'buff': {
            newEvents.push(`${sourceUnit?.name || 'Unknown'} receives a buff`);
            break;
          }

          case 'debuff': {
            for (const targetId of event.target_unit_ids) {
              const target = newStates.get(targetId);
              newEvents.push(`${target?.name || 'Unknown'} receives a debuff`);
            }
            break;
          }
        }
      }

      return newStates;
    });

    setBattleEvents(prev => [...prev.slice(-10), ...newEvents]);
    setCurrentTick(tickNumber + 1);
  }, [battleLog, onComplete]);

  // Playback loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTick(prev => {
        processTick(prev);
        return prev;
      });
    }, 500 / playbackSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, processTick]);

  // Get units by team
  const team1Units = Array.from(unitStates.values()).filter(u => u.team === 1);
  const team2Units = Array.from(unitStates.values()).filter(u => u.team === 2);

  const handlePlayPause = () => {
    if (currentTick >= battleLog.length) {
      // Reset and play
      handleReset();
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleSkip = () => {
    setIsPlaying(false);
    // Process all remaining ticks
    for (let i = currentTick; i < battleLog.length; i++) {
      processTick(i);
    }
  };

  const handleReset = () => {
    setCurrentTick(0);
    setIsPlaying(false);
    setBattleEvents([]);

    // Reset unit states
    const initialStates = new Map<string, UnitState>();

    team1.units.forEach(unit => {
      initialStates.set(unit.unit_id, {
        id: unit.unit_id,
        name: unit.name,
        faction: unit.faction,
        maxHealth: unit.final_stats.max_health,
        currentHealth: unit.final_stats.max_health,
        maxEnergy: unit.final_stats.energy,
        currentEnergy: 0,
        isAlive: true,
        position: unit.position,
        team: 1,
      });
    });

    team2.units.forEach(unit => {
      initialStates.set(unit.unit_id, {
        id: unit.unit_id,
        name: unit.name,
        faction: unit.faction,
        maxHealth: unit.final_stats.max_health,
        currentHealth: unit.final_stats.max_health,
        maxEnergy: unit.final_stats.energy,
        currentEnergy: 0,
        isAlive: true,
        position: unit.position,
        team: 2,
      });
    });

    setUnitStates(initialStates);
  };

  const isComplete = currentTick >= battleLog.length;

  return (
    <div className="space-y-6">
      {/* Battle Arena */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-cyan-400">Your Team</h3>
          <h3 className="text-lg font-bold text-red-400">Enemy Team</h3>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Team 1 Grid */}
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map(pos => {
                const unit = team1Units.find(u => u.position === pos);
                return (
                  <BattleUnitSlot key={`t1-${pos}`} unit={unit} isEnemy={false} />
                );
              })}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[3, 4, 5].map(pos => {
                const unit = team1Units.find(u => u.position === pos);
                return (
                  <BattleUnitSlot key={`t1-${pos}`} unit={unit} isEnemy={false} />
                );
              })}
            </div>
          </div>

          {/* Team 2 Grid */}
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map(pos => {
                const unit = team2Units.find(u => u.position === pos);
                return (
                  <BattleUnitSlot key={`t2-${pos}`} unit={unit} isEnemy={true} />
                );
              })}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[3, 4, 5].map(pos => {
                const unit = team2Units.find(u => u.position === pos);
                return (
                  <BattleUnitSlot key={`t2-${pos}`} unit={unit} isEnemy={true} />
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* Controls */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              disabled={currentTick === 0}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>

            <Button
              variant={isPlaying ? 'secondary' : 'primary'}
              size="sm"
              onClick={handlePlayPause}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : isComplete ? (
                <RotateCcw className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPlaybackSpeed(s => s === 4 ? 1 : s * 2)}
            >
              <FastForward className="w-4 h-4" />
              <span className="ml-1 text-xs">{playbackSpeed}x</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              disabled={isComplete}
            >
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>

          <div className="text-sm text-gray-400">
            Tick {currentTick} / {battleLog.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 h-1 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-cyan-500 transition-all duration-200"
            style={{ width: `${(currentTick / battleLog.length) * 100}%` }}
          />
        </div>
      </Card>

      {/* Battle Log */}
      <Card className="p-4">
        <h4 className="text-sm font-medium text-gray-400 mb-2">Battle Log</h4>
        <div className="h-32 overflow-y-auto space-y-1">
          {battleEvents.length === 0 ? (
            <p className="text-gray-500 text-sm">Battle events will appear here...</p>
          ) : (
            battleEvents.map((event, idx) => (
              <p key={idx} className="text-sm text-gray-300">
                {event}
              </p>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

// Battle Unit Slot Component
function BattleUnitSlot({ unit, isEnemy }: { unit?: UnitState; isEnemy: boolean }) {
  if (!unit) {
    return (
      <div className="aspect-square rounded-lg bg-gray-800/30 border border-gray-700/50" />
    );
  }

  const factionConfig = FACTION_CONFIG[unit.faction];
  const healthPercent = (unit.currentHealth / unit.maxHealth) * 100;

  return (
    <div
      className={`
        aspect-square rounded-lg p-2 flex flex-col items-center justify-center
        transition-all duration-200
        ${unit.isAlive
          ? isEnemy
            ? 'bg-red-500/10 border border-red-500/30'
            : 'bg-cyan-500/10 border border-cyan-500/30'
          : 'bg-gray-800/50 border border-gray-700 opacity-50'
        }
      `}
    >
      {/* Unit Icon */}
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg mb-1 ${
          !unit.isAlive && 'grayscale'
        }`}
        style={{ backgroundColor: `${factionConfig.color}30` }}
      >
        {factionConfig.icon}
      </div>

      {/* Name */}
      <span className="text-xs text-white truncate w-full text-center">
        {unit.name}
      </span>

      {/* Health Bar */}
      <div className="w-full mt-1">
        <HealthBar current={unit.currentHealth} max={unit.maxHealth} />
      </div>

      {/* Health Text */}
      <span className="text-xs text-gray-400 mt-0.5">
        {unit.currentHealth}/{unit.maxHealth}
      </span>
    </div>
  );
}
