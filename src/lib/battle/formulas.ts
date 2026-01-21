import type {
  PlayerUnit,
  UnitTemplate,
  PlayerItem,
  ItemTemplate,
  UnitStats,
  StatModifier,
  SynergyBonus,
  Faction,
  BattleUnitSnapshot,
} from '@/types';
import { SYNERGY_BONUSES, GAME_CONFIG } from '@/constants/game';

/**
 * Calculate the final stats for a unit including equipment and synergies
 */
export function calculateFinalStats(
  unit: PlayerUnit,
  template: UnitTemplate,
  equippedItems: Array<{ item: PlayerItem; template: ItemTemplate }>,
  synergies: SynergyBonus[]
): UnitStats {
  const { LEVEL_STAT_MULTIPLIER, STAR_STAT_MULTIPLIER, BASE_CRIT_RATE, BASE_CRIT_DAMAGE } = GAME_CONFIG;

  // 1. Base stats from template, scaled by level
  const levelMultiplier = 1 + (unit.level - 1) * LEVEL_STAT_MULTIPLIER;
  const stats: UnitStats = {
    max_health: Math.floor(template.base_health * levelMultiplier),
    attack: Math.floor(template.base_attack * levelMultiplier),
    defense: Math.floor(template.base_defense * levelMultiplier),
    speed: template.base_speed, // Speed doesn't scale with level
    energy: template.base_energy,
    crit_rate: BASE_CRIT_RATE,
    crit_damage: BASE_CRIT_DAMAGE,
  };

  // 2. Star rank multiplier
  const starMultiplier = 1 + (unit.star_rank - 1) * STAR_STAT_MULTIPLIER;
  stats.max_health = Math.floor(stats.max_health * starMultiplier);
  stats.attack = Math.floor(stats.attack * starMultiplier);
  stats.defense = Math.floor(stats.defense * starMultiplier);

  // 3. Apply flat bonuses from items first
  for (const { item, template: itemTemplate } of equippedItems) {
    const allStats = [...itemTemplate.base_stats, ...item.substats];

    for (const mod of allStats) {
      if (!mod.is_percentage) {
        applyStatModifier(stats, mod);
      }
    }

    // Enhancement bonus (each level adds 3% of base stats)
    if (item.enhancement_level > 0) {
      const enhancementMultiplier = item.enhancement_level * 0.03;
      for (const baseMod of itemTemplate.base_stats) {
        if (!baseMod.is_percentage) {
          const bonusValue = Math.floor(baseMod.value * enhancementMultiplier);
          applyStatModifier(stats, { ...baseMod, value: bonusValue });
        }
      }
    }
  }

  // 4. Apply percentage bonuses from items
  for (const { item, template: itemTemplate } of equippedItems) {
    const allStats = [...itemTemplate.base_stats, ...item.substats];

    for (const mod of allStats) {
      if (mod.is_percentage) {
        applyStatModifier(stats, mod);
      }
    }
  }

  // 5. Apply synergy bonuses
  for (const synergy of synergies) {
    for (const bonus of synergy.bonuses) {
      applyStatModifier(stats, bonus);
    }
  }

  return stats;
}

/**
 * Apply a stat modifier to the stats object
 */
function applyStatModifier(stats: UnitStats, mod: StatModifier): void {
  const statKey = mod.stat === 'health' ? 'max_health' : mod.stat;

  if (!(statKey in stats)) return;

  const key = statKey as keyof UnitStats;

  if (mod.is_percentage) {
    stats[key] = Math.floor(stats[key] * (1 + mod.value / 100));
  } else {
    stats[key] += mod.value;
  }
}

/**
 * Calculate active synergies for a team
 */
export function calculateActiveSynergies(units: BattleUnitSnapshot[]): SynergyBonus[] {
  const factionCounts = new Map<Faction, number>();

  // Count units per faction
  for (const unit of units) {
    const count = factionCounts.get(unit.faction) || 0;
    factionCounts.set(unit.faction, count + 1);
  }

  // Determine active bonuses
  const activeSynergies: SynergyBonus[] = [];

  for (const [faction, count] of factionCounts) {
    const tiers = SYNERGY_BONUSES[faction];

    // Find highest qualifying tier
    let activeTier: typeof tiers[0] | null = null;
    for (const tier of tiers) {
      if (count >= tier.threshold) {
        activeTier = tier;
      }
    }

    if (activeTier) {
      activeSynergies.push({
        faction,
        count,
        tier: activeTier.threshold,
        bonuses: activeTier.bonuses,
      });
    }
  }

  return activeSynergies;
}

/**
 * Calculate damage dealt from attacker to defender
 */
export function calculateDamage(
  attackerStats: UnitStats,
  defenderStats: UnitStats,
  abilityPower: number,
  damageType: 'physical' | 'magical' | 'true',
  random: () => number
): { damage: number; isCrit: boolean } {
  // Base damage
  let baseDamage = attackerStats.attack * abilityPower;

  // Defense reduction (for physical/magical)
  if (damageType !== 'true') {
    const defenseReduction = defenderStats.defense / (defenderStats.defense + 100);
    baseDamage = baseDamage * (1 - defenseReduction);
  }

  // Crit check
  const isCrit = random() * 100 < attackerStats.crit_rate;
  if (isCrit) {
    baseDamage = baseDamage * (attackerStats.crit_damage / 100);
  }

  // Variance (+/- 5%)
  const variance = 0.95 + random() * 0.10;
  const finalDamage = Math.floor(baseDamage * variance);

  return { damage: Math.max(1, finalDamage), isCrit };
}

/**
 * Calculate healing amount
 */
export function calculateHealing(
  healerStats: UnitStats,
  baseValue: number,
  scalingStat: keyof UnitStats,
  scalingRatio: number
): number {
  const scalingValue = healerStats[scalingStat];
  return Math.floor(baseValue + scalingValue * scalingRatio);
}

/**
 * Calculate rank point change (ELO-based)
 */
export function calculateRankChange(
  playerRank: number,
  opponentRank: number,
  won: boolean
): number {
  const K = 32; // ELO K-factor
  const expected = 1 / (1 + Math.pow(10, (opponentRank - playerRank) / 400));
  const actual = won ? 1 : 0;
  return Math.round(K * (actual - expected));
}

/**
 * Calculate experience reward from battle
 */
export function calculateBattleExperience(
  playerLevel: number,
  opponentLevel: number,
  won: boolean
): number {
  const basExp = won ? 100 : 25;
  const levelDiff = opponentLevel - playerLevel;
  const levelMultiplier = Math.max(0.5, Math.min(2, 1 + levelDiff * 0.1));
  return Math.floor(basExp * levelMultiplier);
}

/**
 * Calculate scrap reward from battle
 */
export function calculateBattleScrap(
  won: boolean,
  battleMode: 'story' | 'arena' | 'friendly' | 'tournament'
): number {
  const baseReward = {
    story: won ? 50 : 10,
    arena: won ? 100 : 25,
    friendly: 10,
    tournament: won ? 500 : 100,
  };
  return baseReward[battleMode];
}
