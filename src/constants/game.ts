import type { Faction, Rarity, RankTier, StatModifier } from '@/types';

// ============================================
// SYNERGY BONUSES
// ============================================

export interface SynergyTier {
  threshold: number;
  bonuses: StatModifier[];
}

export const SYNERGY_BONUSES: Record<Faction, SynergyTier[]> = {
  technomancers: [
    { threshold: 2, bonuses: [{ stat: 'attack', value: 15, is_percentage: true }] },
    { threshold: 4, bonuses: [{ stat: 'attack', value: 30, is_percentage: true }] },
    { threshold: 6, bonuses: [{ stat: 'attack', value: 50, is_percentage: true }, { stat: 'crit_rate', value: 15, is_percentage: false }] },
  ],

  void_walkers: [
    { threshold: 2, bonuses: [{ stat: 'speed', value: 10, is_percentage: false }] },
    { threshold: 4, bonuses: [{ stat: 'speed', value: 25, is_percentage: false }, { stat: 'energy', value: 20, is_percentage: true }] },
  ],

  cyber_druids: [
    { threshold: 2, bonuses: [{ stat: 'health', value: 10, is_percentage: true }] },
    { threshold: 4, bonuses: [{ stat: 'health', value: 25, is_percentage: true }] },
    { threshold: 6, bonuses: [{ stat: 'health', value: 40, is_percentage: true }, { stat: 'defense', value: 20, is_percentage: true }] },
  ],

  astral_knights: [
    { threshold: 2, bonuses: [{ stat: 'defense', value: 20, is_percentage: true }] },
    { threshold: 4, bonuses: [{ stat: 'defense', value: 40, is_percentage: true }, { stat: 'health', value: 15, is_percentage: true }] },
  ],

  quantum_witches: [
    { threshold: 2, bonuses: [{ stat: 'crit_rate', value: 10, is_percentage: false }] },
    { threshold: 4, bonuses: [{ stat: 'crit_rate', value: 20, is_percentage: false }, { stat: 'crit_damage', value: 30, is_percentage: false }] },
  ],

  machine_spirits: [
    { threshold: 2, bonuses: [{ stat: 'energy', value: 20, is_percentage: true }] },
    { threshold: 4, bonuses: [{ stat: 'energy', value: 50, is_percentage: true }] },
  ],
};

// ============================================
// RARITY CONFIG
// ============================================

export const RARITY_CONFIG: Record<Rarity, {
  color: string;
  bgColor: string;
  borderColor: string;
  dropRate: number;
  substatRolls: number;
  maxEnhancement: number;
  materialQuantity: number;
}> = {
  common: {
    color: '#9CA3AF',
    bgColor: '#374151',
    borderColor: '#4B5563',
    dropRate: 60,
    substatRolls: 0,
    maxEnhancement: 5,
    materialQuantity: 1,
  },
  uncommon: {
    color: '#22C55E',
    bgColor: '#14532D',
    borderColor: '#166534',
    dropRate: 25,
    substatRolls: 1,
    maxEnhancement: 10,
    materialQuantity: 2,
  },
  rare: {
    color: '#3B82F6',
    bgColor: '#1E3A8A',
    borderColor: '#1D4ED8',
    dropRate: 10,
    substatRolls: 2,
    maxEnhancement: 12,
    materialQuantity: 3,
  },
  epic: {
    color: '#A855F7',
    bgColor: '#581C87',
    borderColor: '#7C3AED',
    dropRate: 4,
    substatRolls: 3,
    maxEnhancement: 15,
    materialQuantity: 5,
  },
  legendary: {
    color: '#F97316',
    bgColor: '#7C2D12',
    borderColor: '#EA580C',
    dropRate: 1,
    substatRolls: 4,
    maxEnhancement: 15,
    materialQuantity: 8,
  },
};

// ============================================
// RANK CONFIG
// ============================================

export const RANK_CONFIG: Record<RankTier, {
  minPoints: number;
  maxPoints: number;
  color: string;
  icon: string;
}> = {
  bronze: { minPoints: 0, maxPoints: 999, color: '#CD7F32', icon: '🥉' },
  silver: { minPoints: 1000, maxPoints: 1999, color: '#C0C0C0', icon: '🥈' },
  gold: { minPoints: 2000, maxPoints: 2999, color: '#FFD700', icon: '🥇' },
  platinum: { minPoints: 3000, maxPoints: 3999, color: '#E5E4E2', icon: '💎' },
  diamond: { minPoints: 4000, maxPoints: 4999, color: '#B9F2FF', icon: '💠' },
  mythic: { minPoints: 5000, maxPoints: Infinity, color: '#FF4500', icon: '🏆' },
};

// ============================================
// FACTION CONFIG
// ============================================

export const FACTION_CONFIG: Record<Faction, {
  name: string;
  description: string;
  color: string;
  icon: string;
}> = {
  technomancers: {
    name: 'Technomancers',
    description: 'Masters of combining arcane magic with advanced technology',
    color: '#00D4FF',
    icon: '⚡',
  },
  void_walkers: {
    name: 'Void Walkers',
    description: 'Dimensional travelers who harness the power of the void',
    color: '#8B5CF6',
    icon: '🌀',
  },
  cyber_druids: {
    name: 'Cyber Druids',
    description: 'Nature guardians enhanced with cybernetic implants',
    color: '#10B981',
    icon: '🌿',
  },
  astral_knights: {
    name: 'Astral Knights',
    description: 'Holy warriors wielding plasma weapons and divine light',
    color: '#FBBF24',
    icon: '⚔️',
  },
  quantum_witches: {
    name: 'Quantum Witches',
    description: 'Sorcerers who manipulate probability and quantum states',
    color: '#EC4899',
    icon: '✨',
  },
  machine_spirits: {
    name: 'Machine Spirits',
    description: 'Sentient AI entities that have developed souls',
    color: '#6B7280',
    icon: '🤖',
  },
};

// ============================================
// CLASS CONFIG
// ============================================

export const CLASS_CONFIG: Record<string, {
  name: string;
  description: string;
  icon: string;
}> = {
  striker: {
    name: 'Striker',
    description: 'High damage dealers with aggressive playstyle',
    icon: '⚔️',
  },
  guardian: {
    name: 'Guardian',
    description: 'Durable tanks that protect allies',
    icon: '🛡️',
  },
  support: {
    name: 'Support',
    description: 'Healers and buffers that empower the team',
    icon: '💚',
  },
  controller: {
    name: 'Controller',
    description: 'Crowd control specialists and debuffers',
    icon: '🎯',
  },
  assassin: {
    name: 'Assassin',
    description: 'Single-target burst damage specialists',
    icon: '🗡️',
  },
  summoner: {
    name: 'Summoner',
    description: 'Creates additional units to fight alongside',
    icon: '👻',
  },
};

// ============================================
// SUBSTAT CONFIG
// ============================================

export const SUBSTAT_POOL = [
  { stat: 'health' as const, weight: 15 },
  { stat: 'attack' as const, weight: 15 },
  { stat: 'defense' as const, weight: 15 },
  { stat: 'speed' as const, weight: 10 },
  { stat: 'crit_rate' as const, weight: 10 },
  { stat: 'crit_damage' as const, weight: 10 },
  { stat: 'energy' as const, weight: 10 },
];

export const SUBSTAT_RANGES: Record<Rarity, { min: number; max: number }> = {
  common: { min: 0, max: 0 },
  uncommon: { min: 3, max: 5 },
  rare: { min: 5, max: 8 },
  epic: { min: 8, max: 12 },
  legendary: { min: 12, max: 18 },
};

// ============================================
// GAME SETTINGS
// ============================================

export const GAME_CONFIG = {
  // Team settings
  MAX_TEAM_SIZE: 6,
  FRONT_ROW_POSITIONS: [0, 1, 2],
  BACK_ROW_POSITIONS: [3, 4, 5],

  // Battle settings
  TICK_RATE_MS: 100,
  MAX_BATTLE_TICKS: 1000,
  BASE_CRIT_RATE: 5,
  BASE_CRIT_DAMAGE: 150,

  // Progression
  MAX_COMMANDER_LEVEL: 100,
  MAX_UNIT_LEVEL: 50,
  MAX_STAR_RANK: 5,
  LEVEL_STAT_MULTIPLIER: 0.05,  // +5% per level
  STAR_STAT_MULTIPLIER: 0.10,   // +10% per star

  // Economy
  LISTING_FEE_PERCENTAGE: 0.5,
  SALE_FEE_PERCENTAGE: 5,
  MIN_LISTING_FEE: 10,

  // Auction
  AUCTION_DURATIONS: [12, 24, 48] as const,
  MIN_BID_INCREMENT_PERCENTAGE: 5,

  // Crafting
  MAX_CRAFTING_QUEUE: 3,
};

// ============================================
// EXPERIENCE TABLE
// ============================================

export const COMMANDER_XP_TABLE: number[] = Array.from(
  { length: 100 },
  (_, i) => Math.floor(100 * Math.pow(1.15, i))
);

export const UNIT_XP_TABLE: number[] = Array.from(
  { length: 50 },
  (_, i) => Math.floor(50 * Math.pow(1.2, i))
);
