'use client';

import { useState } from 'react';
import { Modal, Button, Input, RarityBadge } from '@/components/ui';
import { createClient } from '@/lib/supabase/client';
import { GAME_CONFIG, RARITY_CONFIG } from '@/constants/game';
import type { PlayerItem, ItemTemplate } from '@/types';

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: PlayerItem & { template: ItemTemplate };
  playerId: string;
}

export function CreateListingModal({ isOpen, onClose, item, playerId }: CreateListingModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(item.template.sell_value * 2);
  const [duration, setDuration] = useState<12 | 24 | 48>(24);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listingFee = Math.max(GAME_CONFIG.MIN_LISTING_FEE, Math.floor(price * (GAME_CONFIG.LISTING_FEE_PERCENTAGE / 100)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const supabase = createClient();

    try {
      // Validate
      if (quantity > item.quantity) {
        throw new Error('Not enough items');
      }

      if (price < 1) {
        throw new Error('Price must be at least 1');
      }

      // Create listing
      const { error: listingError } = await supabase.from('auction_listings').insert({
        seller_id: playerId,
        item_id: item.id,
        item_template_id: item.template_id,
        quantity,
        listing_type: 'buyout',
        buyout_price: price,
        current_bid: 0,
        duration_hours: duration,
        expires_at: new Date(Date.now() + duration * 60 * 60 * 1000).toISOString(),
        listing_fee: listingFee,
        sale_fee_percentage: GAME_CONFIG.SALE_FEE_PERCENTAGE,
      });

      if (listingError) throw listingError;

      // Mark item as listed
      const { error: updateError } = await supabase
        .from('player_items')
        .update({ is_listed: true })
        .eq('id', item.id);

      if (updateError) throw updateError;

      // Close modal and refresh
      onClose();
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create listing');
    } finally {
      setIsLoading(false);
    }
  };

  const rarityConfig = RARITY_CONFIG[item.template.rarity];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Listing" size="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Item Preview */}
        <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg">
          <div
            className="w-14 h-14 rounded-lg flex items-center justify-center text-2xl"
            style={{ backgroundColor: rarityConfig.bgColor }}
          >
            {item.template.type === 'weapon' ? '⚔️' :
             item.template.type === 'armor' ? '🛡️' :
             item.template.type === 'accessory' ? '💍' :
             item.template.type === 'material' ? '🔮' : '📦'}
          </div>
          <div>
            <h3 className="font-bold text-white">{item.template.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <RarityBadge rarity={item.template.rarity} />
              <span className="text-sm text-gray-400">
                Available: {item.quantity}
              </span>
            </div>
          </div>
        </div>

        {/* Quantity (for stackable items) */}
        {item.quantity > 1 && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Quantity to Sell
            </label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.min(item.quantity, Math.max(1, parseInt(e.target.value) || 1)))}
              min={1}
              max={item.quantity}
            />
          </div>
        )}

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Buyout Price (Scrap)
          </label>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(Math.max(1, parseInt(e.target.value) || 1))}
            min={1}
          />
          <p className="text-xs text-gray-400 mt-1">
            Suggested: {item.template.sell_value * 2} - {item.template.sell_value * 5} Scrap
          </p>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Duration
          </label>
          <div className="grid grid-cols-3 gap-2">
            {([12, 24, 48] as const).map((hours) => (
              <button
                key={hours}
                type="button"
                className={`p-2 rounded-lg border transition-colors ${
                  duration === hours
                    ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400'
                    : 'border-gray-700 text-gray-400 hover:border-gray-600'
                }`}
                onClick={() => setDuration(hours)}
              >
                {hours} hours
              </button>
            ))}
          </div>
        </div>

        {/* Fee Summary */}
        <div className="p-4 bg-gray-800/50 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Listing Fee</span>
            <span className="text-white">-{listingFee} Scrap</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Sale Fee ({GAME_CONFIG.SALE_FEE_PERCENTAGE}%)</span>
            <span className="text-white">
              -{Math.floor(price * (GAME_CONFIG.SALE_FEE_PERCENTAGE / 100))} Scrap
            </span>
          </div>
          <div className="flex justify-between text-sm pt-2 border-t border-gray-700">
            <span className="text-gray-400">You&apos;ll Receive</span>
            <span className="text-green-400 font-bold">
              {price - Math.floor(price * (GAME_CONFIG.SALE_FEE_PERCENTAGE / 100))} Scrap
            </span>
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading} className="flex-1">
            List for {price} Scrap
          </Button>
        </div>
      </form>
    </Modal>
  );
}
