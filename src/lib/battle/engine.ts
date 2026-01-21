import type {
  BattleTeamSnapshot,
  BattleUnitSnapshot,
  BattleTick,
  BattleEvent,
  UnitStats,
  Ability,
  AbilityEffect,
} from '@/types';
import { GAME_CONFIG } from '@/constants/game';
import { seededRandom } from '@/lib/utils';
import { calculateDamage, calculateHealing } from './formulas';

// ============================================
// BATTLE STATE
// ============================================

interface BattleUnit {
  id: string;
  templateId: string;
  name: string;
  team: 1 | 2;
  position: number;

  stats: UnitStats;
  currentHealth: number;
  currentEnergy: number;

  abilities: Ability[];
  cooldowns: Map<string, number>;
  buffs: ActiveBuff[];
  debuffs: ActiveDebuff[];

  isAlive: boolean;
}

interface ActiveBuff {
  statAffected: keyof UnitStats;
  value: number;
  isPercentage: boolean;
  remainingTurns: number;
  sourceAbilityId: string;
}

interface ActiveDebuff extends ActiveBuff {}

interface BattleState {
  team1: BattleUnit[];
  team2: BattleUnit[];
  currentTick: number;
  isGameOver: boolean;
  winner: 1 | 2 | 'draw' | null;
}

// ============================================
// BATTLE ENGINE
// ============================================

export interface BattleResult {
  winner: 'player1_win' | 'player2_win' | 'draw';
  winnerId: string | null;
  battleLog: BattleTick[];
  totalTicks: number;
  team1Remaining: number;
  team2Remaining: number;
}

export class BattleEngine {
  private state: BattleState;
  private random: () => number;
  private abilitiesMap: Map<string, Ability>;
  private player1Id: string;
  private player2Id: string | null;

  constructor(
    team1: BattleTeamSnapshot,
    team2: BattleTeamSnapshot,
    abilities: Ability[],
    seed: number
  ) {
    this.random = seededRandom(seed);
    this.abilitiesMap = new Map(abilities.map(a => [a.id, a]));
    this.player1Id = team1.player_id;
    this.player2Id = team2.player_id;

    this.state = {
      team1: this.initializeTeam(team1, 1),
      team2: this.initializeTeam(team2, 2),
      currentTick: 0,
      isGameOver: false,
      winner: null,
    };
  }

  private initializeTeam(team: BattleTeamSnapshot, teamNumber: 1 | 2): BattleUnit[] {
    return team.units.map(unit => ({
      id: unit.unit_id,
      templateId: unit.template_id,
      name: unit.name,
      team: teamNumber,
      position: unit.position,

      stats: { ...unit.final_stats },
      currentHealth: unit.final_stats.max_health,
      currentEnergy: 0,

      abilities: unit.abilities
        .map(id => this.abilitiesMap.get(id))
        .filter((a): a is Ability => a !== undefined),
      cooldowns: new Map(),
      buffs: [],
      debuffs: [],

      isAlive: true,
    }));
  }

  /**
   * Run the complete battle simulation
   */
  simulate(): BattleResult {
    const battleLog: BattleTick[] = [];

    while (!this.state.isGameOver && this.state.currentTick < GAME_CONFIG.MAX_BATTLE_TICKS) {
      const tickEvents = this.processTick();

      if (tickEvents.length > 0) {
        battleLog.push({
          tick_number: this.state.currentTick,
          events: tickEvents,
        });
      }

      this.checkGameOver();
      this.state.currentTick++;
    }

    // Determine winner
    const team1Alive = this.state.team1.filter(u => u.isAlive).length;
    const team2Alive = this.state.team2.filter(u => u.isAlive).length;

    let result: 'player1_win' | 'player2_win' | 'draw';
    let winnerId: string | null = null;

    if (team1Alive > team2Alive) {
      result = 'player1_win';
      winnerId = this.player1Id;
    } else if (team2Alive > team1Alive) {
      result = 'player2_win';
      winnerId = this.player2Id;
    } else {
      // Tiebreaker: total remaining health percentage
      const team1Health = this.getTotalHealthPercentage(this.state.team1);
      const team2Health = this.getTotalHealthPercentage(this.state.team2);

      if (team1Health > team2Health) {
        result = 'player1_win';
        winnerId = this.player1Id;
      } else if (team2Health > team1Health) {
        result = 'player2_win';
        winnerId = this.player2Id;
      } else {
        result = 'draw';
      }
    }

    return {
      winner: result,
      winnerId,
      battleLog,
      totalTicks: this.state.currentTick,
      team1Remaining: team1Alive,
      team2Remaining: team2Alive,
    };
  }

  private getTotalHealthPercentage(team: BattleUnit[]): number {
    let total = 0;
    let current = 0;
    for (const unit of team) {
      total += unit.stats.max_health;
      current += unit.currentHealth;
    }
    return total > 0 ? current / total : 0;
  }

  /**
   * Process a single tick of combat
   */
  private processTick(): BattleEvent[] {
    const events: BattleEvent[] = [];
    const timestamp = this.state.currentTick * GAME_CONFIG.TICK_RATE_MS;

    // 1. Regenerate energy for all units
    this.regenerateEnergy();

    // 2. Update cooldowns
    this.updateCooldowns();

    // 3. Process buff/debuff expiration
    events.push(...this.processStatusEffects(timestamp));

    // 4. Get turn order based on speed
    const turnOrder = this.calculateTurnOrder();

    // 5. Each unit takes their turn
    for (const unit of turnOrder) {
      if (!unit.isAlive) continue;

      // Select and execute action
      const action = this.selectAction(unit);
      const actionEvents = this.executeAction(unit, action, timestamp);
      events.push(...actionEvents);

      // Check for deaths after each action
      const deathEvents = this.processDeaths(timestamp);
      events.push(...deathEvents);

      // Check if battle is over
      if (this.checkGameOver()) break;
    }

    return events;
  }

  private regenerateEnergy(): void {
    const allUnits = [...this.state.team1, ...this.state.team2];
    for (const unit of allUnits) {
      if (unit.isAlive) {
        // Regenerate 10 energy per tick
        unit.currentEnergy = Math.min(
          unit.stats.energy,
          unit.currentEnergy + 10
        );
      }
    }
  }

  private updateCooldowns(): void {
    const allUnits = [...this.state.team1, ...this.state.team2];
    for (const unit of allUnits) {
      for (const [abilityId, remaining] of unit.cooldowns) {
        if (remaining > 0) {
          unit.cooldowns.set(abilityId, remaining - 1);
        }
      }
    }
  }

  private processStatusEffects(timestamp: number): BattleEvent[] {
    const events: BattleEvent[] = [];
    const allUnits = [...this.state.team1, ...this.state.team2];

    for (const unit of allUnits) {
      if (!unit.isAlive) continue;

      // Process buffs
      unit.buffs = unit.buffs.filter(buff => {
        buff.remainingTurns--;
        return buff.remainingTurns > 0;
      });

      // Process debuffs
      unit.debuffs = unit.debuffs.filter(debuff => {
        debuff.remainingTurns--;
        return debuff.remainingTurns > 0;
      });
    }

    return events;
  }

  private calculateTurnOrder(): BattleUnit[] {
    const allUnits = [...this.state.team1, ...this.state.team2]
      .filter(u => u.isAlive);

    // Sort by speed (descending), with random tiebreaker
    return allUnits.sort((a, b) => {
      const speedDiff = this.getEffectiveSpeed(b) - this.getEffectiveSpeed(a);
      if (speedDiff !== 0) return speedDiff;
      return this.random() - 0.5;
    });
  }

  private getEffectiveSpeed(unit: BattleUnit): number {
    let speed = unit.stats.speed;

    // Apply speed buffs
    for (const buff of unit.buffs) {
      if (buff.statAffected === 'speed') {
        speed += buff.isPercentage ? speed * (buff.value / 100) : buff.value;
      }
    }

    // Apply speed debuffs
    for (const debuff of unit.debuffs) {
      if (debuff.statAffected === 'speed') {
        speed -= debuff.isPercentage ? speed * (debuff.value / 100) : debuff.value;
      }
    }

    return Math.max(1, Math.floor(speed));
  }

  private selectAction(unit: BattleUnit): { type: 'ability' | 'basic'; ability?: Ability } {
    // Check for usable abilities (has energy, not on cooldown)
    const usableAbilities = unit.abilities.filter(ability => {
      if (ability.type === 'passive') return false;
      if (unit.currentEnergy < ability.energy_cost) return false;
      const cooldown = unit.cooldowns.get(ability.id) || 0;
      if (cooldown > 0) return false;
      return true;
    });

    // Prioritize ultimate > active abilities > basic attack
    const ultimates = usableAbilities.filter(a => a.type === 'ultimate');
    if (ultimates.length > 0) {
      return { type: 'ability', ability: ultimates[0] };
    }

    const actives = usableAbilities.filter(a => a.type === 'active' && a.energy_cost > 0);
    if (actives.length > 0) {
      // Random selection among active abilities
      const index = Math.floor(this.random() * actives.length);
      return { type: 'ability', ability: actives[index] };
    }

    // Basic attack (find the basic attack ability or use default)
    const basicAttack = unit.abilities.find(a => a.energy_cost === 0 && a.type === 'active');
    if (basicAttack) {
      return { type: 'ability', ability: basicAttack };
    }

    return { type: 'basic' };
  }

  private executeAction(
    unit: BattleUnit,
    action: { type: 'ability' | 'basic'; ability?: Ability },
    timestamp: number
  ): BattleEvent[] {
    const events: BattleEvent[] = [];

    if (action.type === 'basic' || !action.ability) {
      // Default basic attack
      const targets = this.selectTargets(unit, 'single_enemy');
      if (targets.length > 0) {
        const target = targets[0];
        const { damage, isCrit } = calculateDamage(
          this.getEffectiveStats(unit),
          this.getEffectiveStats(target),
          1.0,
          'physical',
          this.random
        );

        target.currentHealth = Math.max(0, target.currentHealth - damage);

        events.push({
          type: 'attack',
          source_unit_id: unit.id,
          target_unit_ids: [target.id],
          values: { damage, isCrit: isCrit ? 1 : 0 },
          timestamp_ms: timestamp,
        });
      }
    } else {
      // Use ability
      const ability = action.ability;
      unit.currentEnergy -= ability.energy_cost;
      unit.cooldowns.set(ability.id, ability.cooldown_turns);

      const targets = this.selectTargets(unit, ability.target_type);

      events.push({
        type: 'ability',
        source_unit_id: unit.id,
        target_unit_ids: targets.map(t => t.id),
        ability_id: ability.id,
        values: {},
        timestamp_ms: timestamp,
      });

      // Apply ability effects
      for (const effect of ability.effects) {
        const effectEvents = this.applyEffect(unit, targets, effect, timestamp);
        events.push(...effectEvents);
      }
    }

    return events;
  }

  private selectTargets(
    unit: BattleUnit,
    targetType: string
  ): BattleUnit[] {
    const allies = unit.team === 1 ? this.state.team1 : this.state.team2;
    const enemies = unit.team === 1 ? this.state.team2 : this.state.team1;

    const aliveAllies = allies.filter(u => u.isAlive);
    const aliveEnemies = enemies.filter(u => u.isAlive);

    switch (targetType) {
      case 'self':
        return [unit];

      case 'single_ally':
        // Target lowest health ally
        return aliveAllies.length > 0
          ? [aliveAllies.reduce((min, u) =>
              u.currentHealth / u.stats.max_health < min.currentHealth / min.stats.max_health ? u : min
            )]
          : [];

      case 'single_enemy':
        // Target front row first (positions 0-2), then back row
        const frontRow = aliveEnemies.filter(u => u.position < 3);
        const backRow = aliveEnemies.filter(u => u.position >= 3);
        const targetPool = frontRow.length > 0 ? frontRow : backRow;
        if (targetPool.length === 0) return [];
        // Target random from pool
        return [targetPool[Math.floor(this.random() * targetPool.length)]];

      case 'all_allies':
        return aliveAllies;

      case 'all_enemies':
        return aliveEnemies;

      case 'random':
        if (aliveEnemies.length === 0) return [];
        return [aliveEnemies[Math.floor(this.random() * aliveEnemies.length)]];

      default:
        return [];
    }
  }

  private applyEffect(
    source: BattleUnit,
    targets: BattleUnit[],
    effect: AbilityEffect,
    timestamp: number
  ): BattleEvent[] {
    const events: BattleEvent[] = [];
    const sourceStats = this.getEffectiveStats(source);

    for (const target of targets) {
      switch (effect.type) {
        case 'damage': {
          const { damage, isCrit } = calculateDamage(
            sourceStats,
            this.getEffectiveStats(target),
            effect.base_value / 100 + effect.scaling_ratio,
            effect.damage_type || 'magical',
            this.random
          );

          target.currentHealth = Math.max(0, target.currentHealth - damage);

          events.push({
            type: 'damage',
            source_unit_id: source.id,
            target_unit_ids: [target.id],
            values: { damage, isCrit: isCrit ? 1 : 0 },
            timestamp_ms: timestamp,
          });
          break;
        }

        case 'heal': {
          const healAmount = calculateHealing(
            sourceStats,
            effect.base_value,
            effect.scaling_stat as keyof UnitStats,
            effect.scaling_ratio
          );

          const actualHeal = Math.min(
            healAmount,
            target.stats.max_health - target.currentHealth
          );
          target.currentHealth += actualHeal;

          events.push({
            type: 'heal',
            source_unit_id: source.id,
            target_unit_ids: [target.id],
            values: { amount: actualHeal },
            timestamp_ms: timestamp,
          });
          break;
        }

        case 'buff': {
          if (effect.stat_affected && effect.duration_turns) {
            target.buffs.push({
              statAffected: effect.stat_affected as keyof UnitStats,
              value: effect.base_value,
              isPercentage: false,
              remainingTurns: effect.duration_turns,
              sourceAbilityId: '',
            });

            events.push({
              type: 'buff',
              source_unit_id: source.id,
              target_unit_ids: [target.id],
              values: {
                stat: effect.stat_affected as unknown as number,
                value: effect.base_value,
                duration: effect.duration_turns,
              },
              timestamp_ms: timestamp,
            });
          }
          break;
        }

        case 'debuff': {
          if (effect.stat_affected && effect.duration_turns) {
            target.debuffs.push({
              statAffected: effect.stat_affected as keyof UnitStats,
              value: effect.base_value,
              isPercentage: false,
              remainingTurns: effect.duration_turns,
              sourceAbilityId: '',
            });

            events.push({
              type: 'debuff',
              source_unit_id: source.id,
              target_unit_ids: [target.id],
              values: {
                stat: effect.stat_affected as unknown as number,
                value: effect.base_value,
                duration: effect.duration_turns,
              },
              timestamp_ms: timestamp,
            });
          }
          break;
        }

        case 'shield': {
          // Shields add temporary HP
          const shieldAmount = effect.base_value +
            sourceStats[effect.scaling_stat as keyof UnitStats] * effect.scaling_ratio;

          // For now, treat shield as a heal that can overheal
          target.currentHealth = Math.min(
            target.stats.max_health * 1.5, // Max 150% health with shields
            target.currentHealth + shieldAmount
          );

          events.push({
            type: 'buff',
            source_unit_id: source.id,
            target_unit_ids: [target.id],
            values: { shield: Math.floor(shieldAmount) },
            timestamp_ms: timestamp,
          });
          break;
        }
      }
    }

    return events;
  }

  private getEffectiveStats(unit: BattleUnit): UnitStats {
    const stats = { ...unit.stats };

    // Apply buffs
    for (const buff of unit.buffs) {
      const key = buff.statAffected;
      if (buff.isPercentage) {
        stats[key] = Math.floor(stats[key] * (1 + buff.value / 100));
      } else {
        stats[key] += buff.value;
      }
    }

    // Apply debuffs
    for (const debuff of unit.debuffs) {
      const key = debuff.statAffected;
      if (debuff.isPercentage) {
        stats[key] = Math.floor(stats[key] * (1 - debuff.value / 100));
      } else {
        stats[key] = Math.max(1, stats[key] - debuff.value);
      }
    }

    return stats;
  }

  private processDeaths(timestamp: number): BattleEvent[] {
    const events: BattleEvent[] = [];
    const allUnits = [...this.state.team1, ...this.state.team2];

    for (const unit of allUnits) {
      if (unit.isAlive && unit.currentHealth <= 0) {
        unit.isAlive = false;
        events.push({
          type: 'death',
          source_unit_id: unit.id,
          target_unit_ids: [unit.id],
          values: {},
          timestamp_ms: timestamp,
        });
      }
    }

    return events;
  }

  private checkGameOver(): boolean {
    const team1Alive = this.state.team1.some(u => u.isAlive);
    const team2Alive = this.state.team2.some(u => u.isAlive);

    if (!team1Alive || !team2Alive) {
      this.state.isGameOver = true;
      if (!team1Alive && !team2Alive) {
        this.state.winner = 'draw';
      } else if (!team2Alive) {
        this.state.winner = 1;
      } else {
        this.state.winner = 2;
      }
      return true;
    }

    return false;
  }
}
