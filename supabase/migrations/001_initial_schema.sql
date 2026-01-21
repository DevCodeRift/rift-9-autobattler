-- ============================================
-- RIFT-9 AUTOBATTLER DATABASE SCHEMA
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PLAYERS
-- ============================================
CREATE TABLE players (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(30) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ DEFAULT NOW(),

    -- Currency
    credits INTEGER DEFAULT 0 CHECK (credits >= 0),
    scrap INTEGER DEFAULT 1000 CHECK (scrap >= 0),
    ether INTEGER DEFAULT 100 CHECK (ether >= 0),

    -- Progression
    commander_level INTEGER DEFAULT 1 CHECK (commander_level >= 1 AND commander_level <= 100),
    experience INTEGER DEFAULT 0 CHECK (experience >= 0),
    rank_points INTEGER DEFAULT 1000 CHECK (rank_points >= 0),
    rank_tier VARCHAR(20) DEFAULT 'bronze' CHECK (rank_tier IN ('bronze', 'silver', 'gold', 'platinum', 'diamond', 'mythic')),

    -- Stats
    battles_won INTEGER DEFAULT 0 CHECK (battles_won >= 0),
    battles_lost INTEGER DEFAULT 0 CHECK (battles_lost >= 0),
    items_crafted INTEGER DEFAULT 0 CHECK (items_crafted >= 0),
    auction_sales INTEGER DEFAULT 0 CHECK (auction_sales >= 0),

    -- Settings (JSONB)
    settings JSONB DEFAULT '{
        "battle_speed": "normal",
        "auto_sell_common": false,
        "notifications": {"outbid": true, "sale": true, "crafting_complete": true}
    }'::jsonb
);

-- ============================================
-- GAME DATA (Read-only templates)
-- ============================================

-- Abilities
CREATE TABLE abilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,

    type VARCHAR(20) NOT NULL CHECK (type IN ('active', 'passive', 'ultimate')),
    energy_cost INTEGER DEFAULT 0 CHECK (energy_cost >= 0),
    cooldown_turns INTEGER DEFAULT 0 CHECK (cooldown_turns >= 0),

    target_type VARCHAR(30) NOT NULL CHECK (target_type IN ('self', 'single_ally', 'single_enemy', 'all_allies', 'all_enemies', 'random')),
    effects JSONB NOT NULL DEFAULT '[]'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unit Templates
CREATE TABLE unit_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,

    faction VARCHAR(30) NOT NULL CHECK (faction IN ('technomancers', 'void_walkers', 'cyber_druids', 'astral_knights', 'quantum_witches', 'machine_spirits')),
    class VARCHAR(30) NOT NULL CHECK (class IN ('striker', 'guardian', 'support', 'controller', 'assassin', 'summoner')),
    rarity VARCHAR(20) NOT NULL CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),

    base_health INTEGER NOT NULL CHECK (base_health > 0),
    base_attack INTEGER NOT NULL CHECK (base_attack > 0),
    base_defense INTEGER NOT NULL CHECK (base_defense > 0),
    base_speed INTEGER NOT NULL CHECK (base_speed > 0),
    base_energy INTEGER NOT NULL CHECK (base_energy > 0),

    abilities UUID[] DEFAULT '{}',

    portrait_url TEXT,
    sprite_sheet_url TEXT,

    unlock_method VARCHAR(30) DEFAULT 'gacha' CHECK (unlock_method IN ('starter', 'gacha', 'crafting', 'event', 'achievement')),

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Item Templates
CREATE TABLE item_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,

    type VARCHAR(30) NOT NULL CHECK (type IN ('weapon', 'armor', 'accessory', 'consumable', 'material', 'blueprint')),
    slot VARCHAR(30) CHECK (slot IN ('weapon', 'armor', 'accessory') OR slot IS NULL),
    rarity VARCHAR(20) NOT NULL CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),

    base_stats JSONB DEFAULT '[]'::jsonb,
    effects JSONB DEFAULT '[]'::jsonb,

    required_level INTEGER DEFAULT 1 CHECK (required_level >= 1),
    required_class VARCHAR(30)[],

    sell_value INTEGER DEFAULT 10 CHECK (sell_value >= 0),
    is_tradeable BOOLEAN DEFAULT true,

    icon_url TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recipes
CREATE TABLE recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,

    result_item_id UUID REFERENCES item_templates(id) ON DELETE CASCADE,
    result_quantity INTEGER DEFAULT 1 CHECK (result_quantity >= 1),

    ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,

    required_commander_level INTEGER DEFAULT 1 CHECK (required_commander_level >= 1),
    required_recipe_id UUID REFERENCES recipes(id) ON DELETE SET NULL,

    crafting_time_seconds INTEGER DEFAULT 60 CHECK (crafting_time_seconds >= 0),
    ether_cost INTEGER DEFAULT 10 CHECK (ether_cost >= 0),

    is_default_unlocked BOOLEAN DEFAULT false,
    discovery_source TEXT,

    rarity VARCHAR(20) NOT NULL CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PLAYER-OWNED DATA
-- ============================================

-- Player Units
CREATE TABLE player_units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES players(id) ON DELETE CASCADE NOT NULL,
    template_id UUID REFERENCES unit_templates(id) ON DELETE CASCADE NOT NULL,

    level INTEGER DEFAULT 1 CHECK (level >= 1 AND level <= 50),
    experience INTEGER DEFAULT 0 CHECK (experience >= 0),
    star_rank INTEGER DEFAULT 1 CHECK (star_rank >= 1 AND star_rank <= 5),

    weapon_id UUID,
    armor_id UUID,
    accessory_id UUID,

    nickname VARCHAR(30),
    is_favorite BOOLEAN DEFAULT false,

    acquired_at TIMESTAMPTZ DEFAULT NOW()
);

-- Player Items
CREATE TABLE player_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES players(id) ON DELETE CASCADE NOT NULL,
    template_id UUID REFERENCES item_templates(id) ON DELETE CASCADE NOT NULL,

    quantity INTEGER DEFAULT 1 CHECK (quantity >= 1),
    enhancement_level INTEGER DEFAULT 0 CHECK (enhancement_level >= 0 AND enhancement_level <= 15),
    substats JSONB DEFAULT '[]'::jsonb,

    equipped_to_unit_id UUID REFERENCES player_units(id) ON DELETE SET NULL,
    is_locked BOOLEAN DEFAULT false,
    is_listed BOOLEAN DEFAULT false,

    acquired_at TIMESTAMPTZ DEFAULT NOW(),
    acquired_from VARCHAR(30) DEFAULT 'unknown' CHECK (acquired_from IN ('battle', 'crafting', 'auction', 'gacha', 'reward', 'unknown'))
);

-- Add foreign keys for equipment slots
ALTER TABLE player_units
    ADD CONSTRAINT fk_weapon FOREIGN KEY (weapon_id) REFERENCES player_items(id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_armor FOREIGN KEY (armor_id) REFERENCES player_items(id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_accessory FOREIGN KEY (accessory_id) REFERENCES player_items(id) ON DELETE SET NULL;

-- Player Teams
CREATE TABLE player_teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES players(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(50) DEFAULT 'Team',

    unit_positions JSONB NOT NULL DEFAULT '{}'::jsonb,

    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Player Recipes
CREATE TABLE player_recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES players(id) ON DELETE CASCADE NOT NULL,
    recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,

    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    times_crafted INTEGER DEFAULT 0 CHECK (times_crafted >= 0),

    UNIQUE(player_id, recipe_id)
);

-- Crafting Jobs
CREATE TABLE crafting_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES players(id) ON DELETE CASCADE NOT NULL,
    recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,

    quantity INTEGER DEFAULT 1 CHECK (quantity >= 1),
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completes_at TIMESTAMPTZ NOT NULL,

    status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'claimed'))
);

-- ============================================
-- AUCTION HOUSE
-- ============================================

-- Auction Listings
CREATE TABLE auction_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID REFERENCES players(id) ON DELETE CASCADE NOT NULL,

    item_id UUID REFERENCES player_items(id) ON DELETE CASCADE NOT NULL,
    item_template_id UUID REFERENCES item_templates(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER DEFAULT 1 CHECK (quantity >= 1),

    listing_type VARCHAR(20) NOT NULL CHECK (listing_type IN ('auction', 'buyout', 'both')),
    starting_price INTEGER DEFAULT 0 CHECK (starting_price >= 0),
    buyout_price INTEGER CHECK (buyout_price IS NULL OR buyout_price > 0),
    current_bid INTEGER DEFAULT 0 CHECK (current_bid >= 0),
    current_bidder_id UUID REFERENCES players(id) ON DELETE SET NULL,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    duration_hours INTEGER NOT NULL CHECK (duration_hours IN (12, 24, 48)),

    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'sold', 'expired', 'cancelled')),

    listing_fee INTEGER DEFAULT 0 CHECK (listing_fee >= 0),
    sale_fee_percentage INTEGER DEFAULT 5 CHECK (sale_fee_percentage >= 0 AND sale_fee_percentage <= 100)
);

-- Auction Bids
CREATE TABLE auction_bids (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID REFERENCES auction_listings(id) ON DELETE CASCADE NOT NULL,
    bidder_id UUID REFERENCES players(id) ON DELETE CASCADE NOT NULL,

    amount INTEGER NOT NULL CHECK (amount > 0),
    placed_at TIMESTAMPTZ DEFAULT NOW(),

    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'outbid', 'won', 'refunded'))
);

-- Auction Transactions
CREATE TABLE auction_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID REFERENCES auction_listings(id) ON DELETE SET NULL,
    seller_id UUID REFERENCES players(id) ON DELETE SET NULL NOT NULL,
    buyer_id UUID REFERENCES players(id) ON DELETE SET NULL NOT NULL,

    item_id UUID,
    item_template_id UUID REFERENCES item_templates(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL CHECK (quantity >= 1),

    sale_price INTEGER NOT NULL CHECK (sale_price > 0),
    sale_fee INTEGER NOT NULL CHECK (sale_fee >= 0),
    seller_received INTEGER NOT NULL CHECK (seller_received >= 0),

    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('bid_won', 'buyout')),
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BATTLES
-- ============================================

CREATE TABLE battles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    player1_id UUID REFERENCES players(id) ON DELETE SET NULL NOT NULL,
    player2_id UUID REFERENCES players(id) ON DELETE SET NULL,
    ai_opponent_id VARCHAR(50),

    mode VARCHAR(20) NOT NULL CHECK (mode IN ('story', 'arena', 'friendly', 'tournament')),

    player1_team JSONB NOT NULL,
    player2_team JSONB NOT NULL,

    winner_id UUID REFERENCES players(id) ON DELETE SET NULL,
    result VARCHAR(20) CHECK (result IN ('player1_win', 'player2_win', 'draw')),

    battle_log JSONB,
    total_ticks INTEGER,

    player1_rewards JSONB,
    player2_rewards JSONB,

    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    duration_seconds INTEGER,

    player1_rank_change INTEGER DEFAULT 0,
    player2_rank_change INTEGER DEFAULT 0
);

-- ============================================
-- INDEXES
-- ============================================

-- Player lookups
CREATE INDEX idx_players_username ON players(username);

-- Player owned data
CREATE INDEX idx_player_units_player ON player_units(player_id);
CREATE INDEX idx_player_units_template ON player_units(template_id);
CREATE INDEX idx_player_items_player ON player_items(player_id);
CREATE INDEX idx_player_items_template ON player_items(template_id);
CREATE INDEX idx_player_items_equipped ON player_items(equipped_to_unit_id) WHERE equipped_to_unit_id IS NOT NULL;
CREATE INDEX idx_player_teams_player ON player_teams(player_id);
CREATE INDEX idx_player_recipes_player ON player_recipes(player_id);

-- Crafting
CREATE INDEX idx_crafting_jobs_player ON crafting_jobs(player_id, status);
CREATE INDEX idx_crafting_jobs_completion ON crafting_jobs(completes_at) WHERE status = 'in_progress';

-- Auction house
CREATE INDEX idx_auction_listings_status ON auction_listings(status, expires_at);
CREATE INDEX idx_auction_listings_seller ON auction_listings(seller_id);
CREATE INDEX idx_auction_listings_template ON auction_listings(item_template_id);
CREATE INDEX idx_auction_listings_active ON auction_listings(status, item_template_id, buyout_price) WHERE status = 'active';
CREATE INDEX idx_auction_bids_listing ON auction_bids(listing_id);
CREATE INDEX idx_auction_bids_bidder ON auction_bids(bidder_id);
CREATE INDEX idx_auction_transactions_seller ON auction_transactions(seller_id);
CREATE INDEX idx_auction_transactions_buyer ON auction_transactions(buyer_id);

-- Battles
CREATE INDEX idx_battles_player1 ON battles(player1_id);
CREATE INDEX idx_battles_player2 ON battles(player2_id);
CREATE INDEX idx_battles_mode ON battles(mode, started_at);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE crafting_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE auction_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE auction_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE auction_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE battles ENABLE ROW LEVEL SECURITY;

-- Players can view and update their own profile
CREATE POLICY "Users can view own player" ON players
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own player" ON players
    FOR UPDATE USING (auth.uid() = id);

-- Players can manage their own units
CREATE POLICY "Users can view own units" ON player_units
    FOR SELECT USING (auth.uid() = player_id);

CREATE POLICY "Users can insert own units" ON player_units
    FOR INSERT WITH CHECK (auth.uid() = player_id);

CREATE POLICY "Users can update own units" ON player_units
    FOR UPDATE USING (auth.uid() = player_id);

CREATE POLICY "Users can delete own units" ON player_units
    FOR DELETE USING (auth.uid() = player_id);

-- Players can manage their own items
CREATE POLICY "Users can view own items" ON player_items
    FOR SELECT USING (auth.uid() = player_id);

CREATE POLICY "Users can insert own items" ON player_items
    FOR INSERT WITH CHECK (auth.uid() = player_id);

CREATE POLICY "Users can update own items" ON player_items
    FOR UPDATE USING (auth.uid() = player_id);

CREATE POLICY "Users can delete own items" ON player_items
    FOR DELETE USING (auth.uid() = player_id);

-- Players can manage their own teams
CREATE POLICY "Users can manage own teams" ON player_teams
    FOR ALL USING (auth.uid() = player_id);

-- Players can manage their own recipes
CREATE POLICY "Users can manage own recipes" ON player_recipes
    FOR ALL USING (auth.uid() = player_id);

-- Players can manage their own crafting jobs
CREATE POLICY "Users can manage own crafting jobs" ON crafting_jobs
    FOR ALL USING (auth.uid() = player_id);

-- Auction listings visible to all authenticated users
CREATE POLICY "Authenticated users can view active listings" ON auction_listings
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create own listings" ON auction_listings
    FOR INSERT WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can update own listings" ON auction_listings
    FOR UPDATE USING (auth.uid() = seller_id);

-- Auction bids
CREATE POLICY "Users can view own bids" ON auction_bids
    FOR SELECT USING (auth.uid() = bidder_id);

CREATE POLICY "Users can create bids" ON auction_bids
    FOR INSERT WITH CHECK (auth.uid() = bidder_id);

-- Auction transactions
CREATE POLICY "Users can view own transactions" ON auction_transactions
    FOR SELECT USING (auth.uid() = seller_id OR auth.uid() = buyer_id);

-- Battles
CREATE POLICY "Users can view own battles" ON battles
    FOR SELECT USING (auth.uid() = player1_id OR auth.uid() = player2_id);

CREATE POLICY "Users can create battles" ON battles
    FOR INSERT WITH CHECK (auth.uid() = player1_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to create a new player profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO players (id, username)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', 'Commander_' || LEFT(NEW.id::text, 8))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create player on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update last_login
CREATE OR REPLACE FUNCTION update_last_login()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE players SET last_login = NOW() WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- ENABLE REALTIME
-- ============================================

ALTER PUBLICATION supabase_realtime ADD TABLE auction_listings;
ALTER PUBLICATION supabase_realtime ADD TABLE crafting_jobs;
ALTER PUBLICATION supabase_realtime ADD TABLE battles;
