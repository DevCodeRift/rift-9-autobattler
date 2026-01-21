-- ============================================
-- SEED DATA: ABILITIES
-- ============================================

INSERT INTO abilities (id, name, description, type, energy_cost, cooldown_turns, target_type, effects) VALUES
-- Technomancer Abilities
('a0000001-0000-0000-0000-000000000001', 'Plasma Bolt', 'Fires a bolt of superheated plasma at an enemy', 'active', 20, 0, 'single_enemy',
 '[{"type": "damage", "base_value": 100, "scaling_stat": "attack", "scaling_ratio": 1.2, "damage_type": "magical"}]'),
('a0000001-0000-0000-0000-000000000002', 'Overcharge', 'Supercharges weapons, boosting attack', 'active', 30, 3, 'all_allies',
 '[{"type": "buff", "stat_affected": "attack", "base_value": 25, "scaling_stat": "attack", "scaling_ratio": 0, "duration_turns": 3}]'),
('a0000001-0000-0000-0000-000000000003', 'System Reboot', 'Restores health to self', 'active', 40, 4, 'self',
 '[{"type": "heal", "base_value": 200, "scaling_stat": "health", "scaling_ratio": 0.15}]'),

-- Void Walker Abilities
('a0000002-0000-0000-0000-000000000001', 'Void Strike', 'Channels void energy into a devastating attack', 'active', 25, 0, 'single_enemy',
 '[{"type": "damage", "base_value": 120, "scaling_stat": "attack", "scaling_ratio": 1.4, "damage_type": "magical"}]'),
('a0000002-0000-0000-0000-000000000002', 'Phase Shift', 'Increases speed by phasing partially into the void', 'active', 20, 2, 'self',
 '[{"type": "buff", "stat_affected": "speed", "base_value": 30, "scaling_stat": "speed", "scaling_ratio": 0, "duration_turns": 2}]'),
('a0000002-0000-0000-0000-000000000003', 'Dimensional Rift', 'Opens a rift that damages all enemies', 'ultimate', 60, 5, 'all_enemies',
 '[{"type": "damage", "base_value": 80, "scaling_stat": "attack", "scaling_ratio": 0.8, "damage_type": "magical"}]'),

-- Cyber Druid Abilities
('a0000003-0000-0000-0000-000000000001', 'Bio-Shock', 'Electrified thorns strike an enemy', 'active', 20, 0, 'single_enemy',
 '[{"type": "damage", "base_value": 90, "scaling_stat": "attack", "scaling_ratio": 1.0, "damage_type": "physical"}]'),
('a0000003-0000-0000-0000-000000000002', 'Regeneration Matrix', 'Heals all allies with nano-organic particles', 'active', 50, 4, 'all_allies',
 '[{"type": "heal", "base_value": 100, "scaling_stat": "health", "scaling_ratio": 0.1}]'),
('a0000003-0000-0000-0000-000000000003', 'Nature''s Barrier', 'Creates a protective shield', 'active', 35, 3, 'single_ally',
 '[{"type": "shield", "base_value": 150, "scaling_stat": "defense", "scaling_ratio": 1.5}]'),

-- Generic Abilities
('a0000004-0000-0000-0000-000000000001', 'Basic Attack', 'A standard attack', 'active', 0, 0, 'single_enemy',
 '[{"type": "damage", "base_value": 50, "scaling_stat": "attack", "scaling_ratio": 1.0, "damage_type": "physical"}]'),
('a0000004-0000-0000-0000-000000000002', 'Defensive Stance', 'Increases defense temporarily', 'passive', 0, 0, 'self',
 '[{"type": "buff", "stat_affected": "defense", "base_value": 10, "scaling_stat": "defense", "scaling_ratio": 0.1}]');

-- ============================================
-- SEED DATA: UNIT TEMPLATES
-- ============================================

INSERT INTO unit_templates (id, name, description, faction, class, rarity, base_health, base_attack, base_defense, base_speed, base_energy, abilities, unlock_method) VALUES
-- TECHNOMANCERS (6 units)
('10000001-0000-0000-0000-000000000001', 'Volt Adept', 'A novice technomancer learning to channel electrical magic', 'technomancers', 'striker', 'common', 800, 120, 60, 100, 100, ARRAY['a0000001-0000-0000-0000-000000000001', 'a0000004-0000-0000-0000-000000000001']::uuid[], 'starter'),
('10000001-0000-0000-0000-000000000002', 'Circuit Sage', 'Master of techno-arcane circuitry', 'technomancers', 'support', 'uncommon', 900, 80, 70, 90, 120, ARRAY['a0000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000003']::uuid[], 'gacha'),
('10000001-0000-0000-0000-000000000003', 'Plasma Knight', 'Warrior clad in plasma-infused armor', 'technomancers', 'guardian', 'rare', 1200, 100, 120, 80, 80, ARRAY['a0000001-0000-0000-0000-000000000001', 'a0000004-0000-0000-0000-000000000002']::uuid[], 'gacha'),
('10000001-0000-0000-0000-000000000004', 'Data Wraith', 'A ghostly figure of pure information', 'technomancers', 'assassin', 'rare', 700, 150, 50, 130, 90, ARRAY['a0000001-0000-0000-0000-000000000001', 'a0000002-0000-0000-0000-000000000002']::uuid[], 'crafting'),
('10000001-0000-0000-0000-000000000005', 'Neon Oracle', 'Prophet who reads the future in data streams', 'technomancers', 'controller', 'epic', 850, 110, 80, 110, 130, ARRAY['a0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000002']::uuid[], 'gacha'),
('10000001-0000-0000-0000-000000000006', 'Archon Prime', 'The ultimate fusion of magic and machine', 'technomancers', 'striker', 'legendary', 1000, 180, 100, 120, 150, ARRAY['a0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000002', 'a0000002-0000-0000-0000-000000000003']::uuid[], 'event'),

-- VOID WALKERS (6 units)
('20000001-0000-0000-0000-000000000001', 'Rift Scout', 'A dimensional explorer who moves between worlds', 'void_walkers', 'assassin', 'common', 650, 110, 50, 140, 90, ARRAY['a0000002-0000-0000-0000-000000000001', 'a0000002-0000-0000-0000-000000000002']::uuid[], 'starter'),
('20000001-0000-0000-0000-000000000002', 'Null Priest', 'Keeper of void secrets', 'void_walkers', 'support', 'uncommon', 750, 70, 60, 100, 140, ARRAY['a0000003-0000-0000-0000-000000000002', 'a0000004-0000-0000-0000-000000000001']::uuid[], 'gacha'),
('20000001-0000-0000-0000-000000000003', 'Entropy Blade', 'Swordsman whose blade cuts through reality', 'void_walkers', 'striker', 'rare', 800, 140, 70, 120, 100, ARRAY['a0000002-0000-0000-0000-000000000001', 'a0000002-0000-0000-0000-000000000002']::uuid[], 'gacha'),
('20000001-0000-0000-0000-000000000004', 'Phase Guardian', 'Protector who exists in multiple dimensions', 'void_walkers', 'guardian', 'rare', 1100, 90, 110, 90, 100, ARRAY['a0000003-0000-0000-0000-000000000003', 'a0000004-0000-0000-0000-000000000002']::uuid[], 'crafting'),
('20000001-0000-0000-0000-000000000005', 'Cosmic Horror', 'Entity from beyond the stars', 'void_walkers', 'controller', 'epic', 900, 100, 90, 100, 150, ARRAY['a0000002-0000-0000-0000-000000000001', 'a0000002-0000-0000-0000-000000000003']::uuid[], 'gacha'),
('20000001-0000-0000-0000-000000000006', 'Void Sovereign', 'Master of all dimensional rifts', 'void_walkers', 'striker', 'legendary', 950, 170, 90, 150, 160, ARRAY['a0000002-0000-0000-0000-000000000001', 'a0000002-0000-0000-0000-000000000002', 'a0000002-0000-0000-0000-000000000003']::uuid[], 'event'),

-- CYBER DRUIDS (6 units)
('30000001-0000-0000-0000-000000000001', 'Mech-Sprout', 'A young plant-machine hybrid', 'cyber_druids', 'support', 'common', 900, 70, 80, 80, 110, ARRAY['a0000003-0000-0000-0000-000000000002', 'a0000004-0000-0000-0000-000000000001']::uuid[], 'starter'),
('30000001-0000-0000-0000-000000000002', 'Chrome Beastmaster', 'Commands cybernetic forest creatures', 'cyber_druids', 'summoner', 'uncommon', 800, 90, 70, 90, 120, ARRAY['a0000003-0000-0000-0000-000000000001', 'a0000003-0000-0000-0000-000000000002']::uuid[], 'gacha'),
('30000001-0000-0000-0000-000000000003', 'Titanwood Sentinel', 'Ancient tree awakened with technology', 'cyber_druids', 'guardian', 'rare', 1400, 80, 140, 60, 80, ARRAY['a0000003-0000-0000-0000-000000000003', 'a0000004-0000-0000-0000-000000000002']::uuid[], 'gacha'),
('30000001-0000-0000-0000-000000000004', 'Nano-Thorn', 'Assassin grown from nano-organic matter', 'cyber_druids', 'assassin', 'rare', 700, 130, 60, 125, 95, ARRAY['a0000003-0000-0000-0000-000000000001', 'a0000002-0000-0000-0000-000000000002']::uuid[], 'crafting'),
('30000001-0000-0000-0000-000000000005', 'Grove Architect', 'Shapes the battlefield with living constructs', 'cyber_druids', 'controller', 'epic', 1000, 85, 100, 85, 130, ARRAY['a0000003-0000-0000-0000-000000000002', 'a0000003-0000-0000-0000-000000000003']::uuid[], 'gacha'),
('30000001-0000-0000-0000-000000000006', 'World Tree Avatar', 'Living embodiment of the cyber-forest', 'cyber_druids', 'guardian', 'legendary', 1800, 100, 150, 70, 140, ARRAY['a0000003-0000-0000-0000-000000000001', 'a0000003-0000-0000-0000-000000000002', 'a0000003-0000-0000-0000-000000000003']::uuid[], 'achievement');

-- ============================================
-- SEED DATA: ITEM TEMPLATES
-- ============================================

INSERT INTO item_templates (id, name, description, type, slot, rarity, base_stats, sell_value, is_tradeable, icon_url) VALUES
-- WEAPONS
('b0000001-0000-0000-0000-000000000001', 'Rusty Laser Pistol', 'A worn but functional energy weapon', 'weapon', 'weapon', 'common', '[{"stat": "attack", "value": 10, "is_percentage": false}]', 10, true, '/items/weapons/laser_pistol_common.png'),
('b0000001-0000-0000-0000-000000000002', 'Plasma Blade', 'A sword of condensed plasma', 'weapon', 'weapon', 'uncommon', '[{"stat": "attack", "value": 25, "is_percentage": false}, {"stat": "crit_rate", "value": 3, "is_percentage": false}]', 50, true, '/items/weapons/plasma_blade.png'),
('b0000001-0000-0000-0000-000000000003', 'Void-Touched Staff', 'A staff infused with void energy', 'weapon', 'weapon', 'rare', '[{"stat": "attack", "value": 40, "is_percentage": false}, {"stat": "energy", "value": 15, "is_percentage": true}]', 200, true, '/items/weapons/void_staff.png'),
('b0000001-0000-0000-0000-000000000004', 'Quantum Gauntlets', 'Gloves that manipulate probability', 'weapon', 'weapon', 'epic', '[{"stat": "attack", "value": 60, "is_percentage": false}, {"stat": "crit_rate", "value": 10, "is_percentage": false}, {"stat": "crit_damage", "value": 20, "is_percentage": false}]', 800, true, '/items/weapons/quantum_gauntlets.png'),
('b0000001-0000-0000-0000-000000000005', 'Cosmic Annihilator', 'Legendary weapon of immense power', 'weapon', 'weapon', 'legendary', '[{"stat": "attack", "value": 100, "is_percentage": false}, {"stat": "attack", "value": 15, "is_percentage": true}, {"stat": "crit_rate", "value": 15, "is_percentage": false}]', 5000, true, '/items/weapons/cosmic_annihilator.png'),

-- ARMOR
('b0000002-0000-0000-0000-000000000001', 'Scrap Vest', 'Makeshift armor from salvage', 'armor', 'armor', 'common', '[{"stat": "defense", "value": 10, "is_percentage": false}]', 10, true, '/items/armor/scrap_vest.png'),
('b0000002-0000-0000-0000-000000000002', 'Bio-Mesh Suit', 'Living armor that adapts to damage', 'armor', 'armor', 'uncommon', '[{"stat": "defense", "value": 20, "is_percentage": false}, {"stat": "health", "value": 50, "is_percentage": false}]', 50, true, '/items/armor/bio_mesh.png'),
('b0000002-0000-0000-0000-000000000003', 'Phase Plate', 'Armor that partially phases out of reality', 'armor', 'armor', 'rare', '[{"stat": "defense", "value": 35, "is_percentage": false}, {"stat": "speed", "value": 10, "is_percentage": false}]', 200, true, '/items/armor/phase_plate.png'),
('b0000002-0000-0000-0000-000000000004', 'Nanite Exoskeleton', 'Self-repairing nano armor', 'armor', 'armor', 'epic', '[{"stat": "defense", "value": 55, "is_percentage": false}, {"stat": "health", "value": 200, "is_percentage": false}, {"stat": "health", "value": 10, "is_percentage": true}]', 800, true, '/items/armor/nanite_exo.png'),
('b0000002-0000-0000-0000-000000000005', 'Void Dragon Scale', 'Scales from a creature beyond dimensions', 'armor', 'armor', 'legendary', '[{"stat": "defense", "value": 80, "is_percentage": false}, {"stat": "defense", "value": 15, "is_percentage": true}, {"stat": "health", "value": 500, "is_percentage": false}]', 5000, true, '/items/armor/void_scale.png'),

-- ACCESSORIES
('b0000003-0000-0000-0000-000000000001', 'Power Cell', 'Basic energy storage device', 'accessory', 'accessory', 'common', '[{"stat": "energy", "value": 10, "is_percentage": false}]', 10, true, '/items/accessories/power_cell.png'),
('b0000003-0000-0000-0000-000000000002', 'Haste Module', 'Increases reaction speed', 'accessory', 'accessory', 'uncommon', '[{"stat": "speed", "value": 15, "is_percentage": false}]', 50, true, '/items/accessories/haste_module.png'),
('b0000003-0000-0000-0000-000000000003', 'Critical Core', 'Enhances strike precision', 'accessory', 'accessory', 'rare', '[{"stat": "crit_rate", "value": 8, "is_percentage": false}, {"stat": "crit_damage", "value": 15, "is_percentage": false}]', 200, true, '/items/accessories/crit_core.png'),
('b0000003-0000-0000-0000-000000000004', 'Lifeforce Amplifier', 'Boosts vital energy', 'accessory', 'accessory', 'epic', '[{"stat": "health", "value": 300, "is_percentage": false}, {"stat": "health", "value": 12, "is_percentage": true}]', 800, true, '/items/accessories/lifeforce_amp.png'),
('b0000003-0000-0000-0000-000000000005', 'Infinity Loop', 'A ring from outside time', 'accessory', 'accessory', 'legendary', '[{"stat": "speed", "value": 30, "is_percentage": false}, {"stat": "energy", "value": 50, "is_percentage": true}, {"stat": "crit_rate", "value": 10, "is_percentage": false}]', 5000, true, '/items/accessories/infinity_loop.png'),

-- MATERIALS
('b0000004-0000-0000-0000-000000000001', 'Scrap Metal', 'Common salvage material', 'material', NULL, 'common', '[]', 5, true, '/items/materials/scrap.png'),
('b0000004-0000-0000-0000-000000000002', 'Energy Crystal', 'Condensed energy in crystal form', 'material', NULL, 'uncommon', '[]', 20, true, '/items/materials/energy_crystal.png'),
('b0000004-0000-0000-0000-000000000003', 'Void Essence', 'Pure essence from the void', 'material', NULL, 'rare', '[]', 100, true, '/items/materials/void_essence.png'),
('b0000004-0000-0000-0000-000000000004', 'Quantum Fragment', 'A shard of unstable matter', 'material', NULL, 'epic', '[]', 500, true, '/items/materials/quantum_fragment.png'),
('b0000004-0000-0000-0000-000000000005', 'Cosmic Dust', 'Dust from dying stars', 'material', NULL, 'legendary', '[]', 2000, true, '/items/materials/cosmic_dust.png'),
('b0000004-0000-0000-0000-000000000006', 'Bio-Circuit', 'Living technological component', 'material', NULL, 'uncommon', '[]', 25, true, '/items/materials/bio_circuit.png'),
('b0000004-0000-0000-0000-000000000007', 'Nano-Seed', 'Self-replicating nano machines', 'material', NULL, 'rare', '[]', 150, true, '/items/materials/nano_seed.png');

-- ============================================
-- SEED DATA: RECIPES
-- ============================================

INSERT INTO recipes (id, name, description, result_item_id, result_quantity, ingredients, required_commander_level, crafting_time_seconds, ether_cost, is_default_unlocked, rarity) VALUES
-- Weapon Recipes
('c0000001-0000-0000-0000-000000000001', 'Craft Rusty Laser Pistol', 'Basic weapon crafting', 'b0000001-0000-0000-0000-000000000001', 1, '[{"item_id": "b0000004-0000-0000-0000-000000000001", "quantity": 5}]', 1, 60, 10, true, 'common'),
('c0000001-0000-0000-0000-000000000002', 'Craft Plasma Blade', 'Forge a plasma blade', 'b0000001-0000-0000-0000-000000000002', 1, '[{"item_id": "b0000004-0000-0000-0000-000000000001", "quantity": 10}, {"item_id": "b0000004-0000-0000-0000-000000000002", "quantity": 3}]', 5, 300, 25, true, 'uncommon'),
('c0000001-0000-0000-0000-000000000003', 'Craft Void-Touched Staff', 'Infuse a staff with void energy', 'b0000001-0000-0000-0000-000000000003', 1, '[{"item_id": "b0000004-0000-0000-0000-000000000002", "quantity": 5}, {"item_id": "b0000004-0000-0000-0000-000000000003", "quantity": 2}]', 10, 900, 50, false, 'rare'),
('c0000001-0000-0000-0000-000000000004', 'Craft Quantum Gauntlets', 'Master-level weapon crafting', 'b0000001-0000-0000-0000-000000000004', 1, '[{"item_id": "b0000004-0000-0000-0000-000000000003", "quantity": 5}, {"item_id": "b0000004-0000-0000-0000-000000000004", "quantity": 2}]', 20, 3600, 150, false, 'epic'),

-- Armor Recipes
('c0000002-0000-0000-0000-000000000001', 'Craft Scrap Vest', 'Basic armor crafting', 'b0000002-0000-0000-0000-000000000001', 1, '[{"item_id": "b0000004-0000-0000-0000-000000000001", "quantity": 5}]', 1, 60, 10, true, 'common'),
('c0000002-0000-0000-0000-000000000002', 'Craft Bio-Mesh Suit', 'Living armor crafting', 'b0000002-0000-0000-0000-000000000002', 1, '[{"item_id": "b0000004-0000-0000-0000-000000000001", "quantity": 8}, {"item_id": "b0000004-0000-0000-0000-000000000006", "quantity": 3}]', 5, 300, 25, true, 'uncommon'),
('c0000002-0000-0000-0000-000000000003', 'Craft Phase Plate', 'Dimensional armor', 'b0000002-0000-0000-0000-000000000003', 1, '[{"item_id": "b0000004-0000-0000-0000-000000000002", "quantity": 4}, {"item_id": "b0000004-0000-0000-0000-000000000003", "quantity": 2}]', 10, 900, 50, false, 'rare'),

-- Accessory Recipes
('c0000003-0000-0000-0000-000000000001', 'Craft Power Cell', 'Basic energy device', 'b0000003-0000-0000-0000-000000000001', 1, '[{"item_id": "b0000004-0000-0000-0000-000000000001", "quantity": 3}, {"item_id": "b0000004-0000-0000-0000-000000000002", "quantity": 1}]', 1, 60, 10, true, 'common'),
('c0000003-0000-0000-0000-000000000002', 'Craft Haste Module', 'Speed enhancement', 'b0000003-0000-0000-0000-000000000002', 1, '[{"item_id": "b0000004-0000-0000-0000-000000000002", "quantity": 3}, {"item_id": "b0000004-0000-0000-0000-000000000006", "quantity": 2}]', 5, 300, 25, true, 'uncommon'),
('c0000003-0000-0000-0000-000000000003', 'Craft Critical Core', 'Precision enhancement', 'b0000003-0000-0000-0000-000000000003', 1, '[{"item_id": "b0000004-0000-0000-0000-000000000003", "quantity": 2}, {"item_id": "b0000004-0000-0000-0000-000000000007", "quantity": 1}]', 10, 900, 50, false, 'rare'),

-- Material Processing
('c0000004-0000-0000-0000-000000000001', 'Process Energy Crystal', 'Convert scrap to crystals', 'b0000004-0000-0000-0000-000000000002', 1, '[{"item_id": "b0000004-0000-0000-0000-000000000001", "quantity": 10}]', 3, 180, 15, true, 'uncommon'),
('c0000004-0000-0000-0000-000000000002', 'Process Void Essence', 'Refine void materials', 'b0000004-0000-0000-0000-000000000003', 1, '[{"item_id": "b0000004-0000-0000-0000-000000000002", "quantity": 5}]', 8, 600, 40, false, 'rare');
