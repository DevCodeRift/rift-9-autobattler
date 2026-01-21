'use client';

import { Card, Button, RarityBadge } from '@/components/ui';
import { formatCurrency, formatTimeRemaining } from '@/lib/utils';
import { RARITY_CONFIG } from '@/constants/game';
import type { AuctionListing, ItemTemplate } from '@/types';
import { Clock, User } from 'lucide-react';

interface ListingCardProps {
  listing: AuctionListing & {
    item_template: ItemTemplate;
    seller?: { username: string };
  };
  onBuyout: () => void;
  isOwn: boolean;
}

export function ListingCard({ listing, onBuyout, isOwn }: ListingCardProps) {
  const { item_template, seller } = listing;
  const rarityConfig = RARITY_CONFIG[item_template.rarity];

  return (
    <Card
      rarity={item_template.rarity}
      className="overflow-hidden"
    >
      {/* Item Header */}
      <div
        className="p-4 flex items-center gap-3"
        style={{ backgroundColor: `${rarityConfig.color}10` }}
      >
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
          style={{ backgroundColor: rarityConfig.bgColor }}
        >
          {item_template.type === 'weapon' ? '⚔️' :
           item_template.type === 'armor' ? '🛡️' :
           item_template.type === 'accessory' ? '💍' :
           item_template.type === 'material' ? '🔮' : '📦'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white truncate">{item_template.name}</h3>
          <RarityBadge rarity={item_template.rarity} />
        </div>
      </div>

      {/* Item Details */}
      <div className="p-4 space-y-3">
        {/* Description */}
        <p className="text-sm text-gray-400 line-clamp-2">
          {item_template.description}
        </p>

        {/* Stats Preview */}
        {item_template.base_stats.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item_template.base_stats.slice(0, 2).map((stat, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-1 bg-gray-800 rounded text-green-400"
              >
                +{stat.value}{stat.is_percentage ? '%' : ''} {stat.stat}
              </span>
            ))}
            {item_template.base_stats.length > 2 && (
              <span className="text-xs px-2 py-1 bg-gray-800 rounded text-gray-400">
                +{item_template.base_stats.length - 2} more
              </span>
            )}
          </div>
        )}

        {/* Quantity */}
        {listing.quantity > 1 && (
          <p className="text-sm text-gray-400">
            Quantity: <span className="text-white">{listing.quantity}</span>
          </p>
        )}

        {/* Price */}
        <div className="pt-2 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Price</span>
            <span className="text-xl font-bold text-yellow-400">
              {formatCurrency(listing.buyout_price || 0, 'scrap')}
            </span>
          </div>
        </div>

        {/* Seller & Time */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span>{seller?.username || 'Unknown'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{formatTimeRemaining(listing.expires_at)}</span>
          </div>
        </div>

        {/* Buy Button */}
        {!isOwn && (
          <Button
            className="w-full"
            onClick={onBuyout}
            disabled={!listing.buyout_price}
          >
            Buy Now
          </Button>
        )}

        {isOwn && (
          <div className="text-center text-sm text-gray-400">
            This is your listing
          </div>
        )}
      </div>
    </Card>
  );
}
