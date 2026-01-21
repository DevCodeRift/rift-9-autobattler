// ============================================
// ENUMS AND CONSTANTS
// ============================================

export type Faction =
  | 'technomancers'      // Tech + Arcane magic users
  | 'void_walkers'       // Space/dimensional travelers
  | 'cyber_druids'       // Nature + cybernetics
  | 'astral_knights'     // Holy warriors with plasma weapons
  | 'quantum_witches'    // Probability manipulation
  | 'machine_spirits';   // AI entities with souls

export type UnitClass =
  | 'striker'            // High damage, low defense
  | 'guardian'           // Tank, protects allies
  | 'support'            // Healer/buffer
  | 'controller'         // Crowd control, debuffs
  | 'assassin'           // Single-target burst
  | 'summoner';          // Creates additional units

export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export type RankTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'mythic';

export type ItemType =
  | 'weapon'
  | 'armor'
  | 'accessory'
  | 'consumable'
  | 'material'
  | 'blueprint';

export type EquipmentSlot = 'weapon' | 'armor' | 'accessory';

export type BattleMode = 'story' | 'arena' | 'friendly' | 'tournament';

export type AbilityType = 'active' | 'passive' | 'ultimate';

export type TargetType =
  | 'self'
  | 'single_ally'
  | 'single_enemy'
  | 'all_allies'
  | 'all_enemies'
  | 'random';

export type EffectType =
  | 'damage'
  | 'heal'
  | 'buff'
  | 'debuff'
  | 'summon'
  | 'shield';

export type DamageType = 'physical' | 'magical' | 'true';

export type StatName =
  | 'health'
  | 'attack'
  | 'defense'
  | 'speed'
  | 'energy'
  | 'crit_rate'
  | 'crit_damage';

// ============================================
// PLAYER TYPES
// ============================================

export interface PlayerSettings {
  battle_speed: 'slow' | 'normal' | 'fast';
  auto_sell_common: boolean;
  notifications: {
    outbid: boolean;
    sale: boolean;
    crafting_complete: boolean;
  };
}

export interface Player {
  id: string;
  username: string;
  email: string;
  created_at: string;
  last_login: string;

  // Currency
  credits: number;        // Premium currency
  scrap: number;          // Common currency
  ether: number;          // Crafting currency

  // Progression
  commander_level: number;
  experience: number;
  rank_points: number;
  rank_tier: RankTier;

  // Stats
  battles_won: number;
  battles_lost: number;
  items_crafted: number;
  auction_sales: number;

  // Settings
  settings: PlayerSettings;
}

// ============================================
// UNIT TYPES
// ============================================

export interface AbilityEffect {
  type: EffectType;
  stat_affected?: StatName;
  base_value: number;
  scaling_stat: StatName;
  scaling_ratio: number;
  duration_turns?: number;
  damage_type?: DamageType;
}

export interface Ability {
  id: string;
  name: string;
  description: string;
  type: AbilityType;
  energy_cost: number;
  cooldown_turns: number;
  target_type: TargetType;
  effects: AbilityEffect[];
}

export interface UnitTemplate {
  id: string;
  name: string;
  description: string;

  faction: Faction;
  class: UnitClass;
  rarity: Rarity;

  base_health: number;
  base_attack: number;
  base_defense: number;
  base_speed: number;
  base_energy: number;

  abilities: string[];  // Ability IDs

  portrait_url: string;
  sprite_sheet_url: string;

  unlock_method: 'starter' | 'gacha' | 'crafting' | 'event' | 'achievement';
}

export interface PlayerUnit {
  id: string;
  player_id: string;
  template_id: string;
  template?: UnitTemplate;

  level: number;
  experience: number;
  star_rank: number;

  weapon_id: string | null;
  armor_id: string | null;
  accessory_id: string | null;

  nickname: string | null;
  is_favorite: boolean;

  acquired_at: string;
}

// ============================================
// ITEM TYPES
// ============================================

export interface StatModifier {
  stat: StatName;
  value: number;
  is_percentage: boolean;
}

export interface ItemEffect {
  trigger: 'on_equip' | 'on_attack' | 'on_hit' | 'on_kill' | 'on_turn_start' | 'on_low_health';
  effect_type: string;
  parameters: Record<string, number | string>;
}

export interface ItemTemplate {
  id: string;
  name: string;
  description: string;

  type: ItemType;
  slot: EquipmentSlot | null;
  rarity: Rarity;

  base_stats: StatModifier[];
  effects: ItemEffect[];

  required_level: number;
  required_class: UnitClass[] | null;

  sell_value: number;
  is_tradeable: boolean;

  icon_url: string;
}

export interface PlayerItem {
  id: string;
  player_id: string;
  template_id: string;
  template?: ItemTemplate;

  quantity: number;
  enhancement_level: number;
  substats: StatModifier[];

  equipped_to_unit_id: string | null;
  is_locked: boolean;
  is_listed: boolean;

  acquired_at: string;
  acquired_from: 'battle' | 'crafting' | 'auction' | 'gacha' | 'reward' | 'unknown';
}

// ============================================
// CRAFTING TYPES
// ============================================

export interface RecipeIngredient {
  item_id: string;
  quantity: number;
  item_template?: ItemTemplate;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;

  result_item_id: string;
  result_quantity: number;
  result_item?: ItemTemplate;

  ingredients: RecipeIngredient[];

  required_commander_level: number;
  required_recipe_id: string | null;

  crafting_time_seconds: number;
  ether_cost: number;

  is_default_unlocked: boolean;
  discovery_source: string | null;

  rarity: Rarity;
}

export interface PlayerRecipe {
  id: string;
  player_id: string;
  recipe_id: string;
  recipe?: Recipe;
  unlocked_at: string;
  times_crafted: number;
}

export interface CraftingJob {
  id: string;
  player_id: string;
  recipe_id: string;
  recipe?: Recipe;

  quantity: number;
  started_at: string;
  completes_at: string;

  status: 'in_progress' | 'completed' | 'claimed';
}

// ============================================
// AUCTION TYPES
// ============================================

export interface AuctionListing {
  id: string;
  seller_id: string;
  seller?: Player;

  item_id: string;
  item_template_id: string;
  item?: PlayerItem;
  item_template?: ItemTemplate;
  quantity: number;

  listing_type: 'auction' | 'buyout' | 'both';
  starting_price: number;
  buyout_price: number | null;
  current_bid: number;
  current_bidder_id: string | null;

  created_at: string;
  expires_at: string;
  duration_hours: 12 | 24 | 48;

  status: 'active' | 'sold' | 'expired' | 'cancelled';

  listing_fee: number;
  sale_fee_percentage: number;
}

export interface AuctionBid {
  id: string;
  listing_id: string;
  bidder_id: string;
  bidder?: Player;

  amount: number;
  placed_at: string;

  status: 'active' | 'outbid' | 'won' | 'refunded';
}

export interface AuctionTransaction {
  id: string;
  listing_id: string;
  seller_id: string;
  buyer_id: string;

  item_id: string;
  item_template_id: string;
  item_template?: ItemTemplate;
  quantity: number;

  sale_price: number;
  sale_fee: number;
  seller_received: number;

  transaction_type: 'bid_won' | 'buyout';
  completed_at: string;
}

// ============================================
// BATTLE TYPES
// ============================================

export interface UnitStats {
  max_health: number;
  attack: number;
  defense: number;
  speed: number;
  energy: number;
  crit_rate: number;
  crit_damage: number;
}

export interface SynergyBonus {
  faction: Faction;
  count: number;
  tier: number;
  bonuses: StatModifier[];
}

export interface ItemSnapshot {
  id: string;
  template_id: string;
  name: string;
  enhancement_level: number;
  substats: StatModifier[];
}

export interface BattleUnitSnapshot {
  unit_id: string;
  template_id: string;
  name: string;
  level: number;
  star_rank: number;
  position: number;  // 0-5 grid position
  faction: Faction;
  class: UnitClass;

  final_stats: UnitStats;
  abilities: string[];
  equipped_items: ItemSnapshot[];
}

export interface BattleTeamSnapshot {
  player_id: string;
  units: BattleUnitSnapshot[];
  synergies_active: SynergyBonus[];
}

export interface BattleEvent {
  type: 'attack' | 'ability' | 'damage' | 'heal' | 'buff' | 'debuff' | 'death' | 'summon';
  source_unit_id: string;
  target_unit_ids: string[];
  ability_id?: string;
  values: Record<string, number>;
  timestamp_ms: number;
}

export interface BattleTick {
  tick_number: number;
  events: BattleEvent[];
}

export interface BattleRewards {
  experience: number;
  scrap: number;
  ether: number;
  items: string[];  // Item template IDs
  rank_points: number;
}

export interface Battle {
  id: string;

  player1_id: string;
  player2_id: string | null;
  ai_opponent_id: string | null;

  mode: BattleMode;

  player1_team: BattleTeamSnapshot;
  player2_team: BattleTeamSnapshot;

  winner_id: string | null;
  result: 'player1_win' | 'player2_win' | 'draw' | null;

  battle_log: BattleTick[];
  total_ticks: number;

  player1_rewards: BattleRewards;
  player2_rewards: BattleRewards;

  started_at: string;
  ended_at: string | null;
  duration_seconds: number | null;

  player1_rank_change: number;
  player2_rank_change: number;
}

// ============================================
// TEAM TYPES
// ============================================

export interface PlayerTeam {
  id: string;
  player_id: string;
  name: string;

  unit_positions: Record<number, string>;  // position -> unit_id

  is_active: boolean;
  created_at: string;
}

// ============================================
// API TYPES
// ============================================

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  total_pages: number;
}

export interface ApiError {
  code: string;
  message: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}
