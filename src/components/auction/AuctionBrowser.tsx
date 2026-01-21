'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge, RarityBadge, Modal } from '@/components/ui';
import { ListingCard } from './ListingCard';
import { CreateListingModal } from './CreateListingModal';
import { createClient } from '@/lib/supabase/client';
import { formatCurrency, formatTimeRemaining } from '@/lib/utils';
import { RARITY_CONFIG } from '@/constants/game';
import type { AuctionListing, ItemTemplate, PlayerItem, Rarity } from '@/types';
import { Search, Filter, Plus, ShoppingBag, Tag, History } from 'lucide-react';

interface AuctionBrowserProps {
  listings: Array<AuctionListing & {
    item_template: ItemTemplate;
    seller: { username: string };
  }>;
  myListings: Array<AuctionListing & { item_template: ItemTemplate }>;
  myItems: Array<PlayerItem & { template: ItemTemplate }>;
  playerId: string;
}

type Tab = 'browse' | 'my-listings' | 'sell';

export function AuctionBrowser({ listings, myListings, myItems, playerId }: AuctionBrowserProps) {
  const [activeTab, setActiveTab] = useState<Tab>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRarity, setSelectedRarity] = useState<Rarity | 'all'>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PlayerItem & { template: ItemTemplate } | null>(null);

  // Filter listings
  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.item_template.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesRarity = selectedRarity === 'all' || listing.item_template.rarity === selectedRarity;
    const matchesType = selectedType === 'all' || listing.item_template.type === selectedType;

    return matchesSearch && matchesRarity && matchesType;
  });

  const handleBuyout = async (listingId: string, price: number) => {
    const supabase = createClient();

    try {
      // In a real app, this would call an API endpoint that handles the transaction
      console.log('Buying listing:', listingId, 'for', price);
      // Refresh the page to see updated listings
      window.location.reload();
    } catch (error) {
      console.error('Failed to buy item:', error);
    }
  };

  const handleCreateListing = (item: PlayerItem & { template: ItemTemplate }) => {
    setSelectedItem(item);
    setShowCreateModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-700 pb-2">
        <button
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'browse'
              ? 'bg-cyan-500/20 text-cyan-400'
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('browse')}
        >
          <ShoppingBag className="w-4 h-4 inline mr-2" />
          Browse
        </button>
        <button
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'my-listings'
              ? 'bg-cyan-500/20 text-cyan-400'
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('my-listings')}
        >
          <Tag className="w-4 h-4 inline mr-2" />
          My Listings ({myListings.filter(l => l.status === 'active').length})
        </button>
        <button
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'sell'
              ? 'bg-cyan-500/20 text-cyan-400'
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('sell')}
        >
          <Plus className="w-4 h-4 inline mr-2" />
          Sell Items
        </button>
      </div>

      {/* Browse Tab */}
      {activeTab === 'browse' && (
        <>
          {/* Search and Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="w-4 h-4" />}
              />
            </div>

            <select
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              value={selectedRarity}
              onChange={(e) => setSelectedRarity(e.target.value as Rarity | 'all')}
            >
              <option value="all">All Rarities</option>
              <option value="common">Common</option>
              <option value="uncommon">Uncommon</option>
              <option value="rare">Rare</option>
              <option value="epic">Epic</option>
              <option value="legendary">Legendary</option>
            </select>

            <select
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="weapon">Weapons</option>
              <option value="armor">Armor</option>
              <option value="accessory">Accessories</option>
              <option value="material">Materials</option>
            </select>
          </div>

          {/* Listings Grid */}
          {filteredListings.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-400">No listings found matching your criteria.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredListings.map(listing => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onBuyout={() => listing.buyout_price && handleBuyout(listing.id, listing.buyout_price)}
                  isOwn={listing.seller_id === playerId}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* My Listings Tab */}
      {activeTab === 'my-listings' && (
        <div className="space-y-4">
          {myListings.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-400 mb-4">You don&apos;t have any listings yet.</p>
                <Button onClick={() => setActiveTab('sell')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Listing
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {myListings.map(listing => (
                <Card key={listing.id} className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Item Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{listing.item_template.name}</span>
                        <RarityBadge rarity={listing.item_template.rarity} />
                      </div>
                      <p className="text-sm text-gray-400">
                        Quantity: {listing.quantity}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-lg font-bold text-yellow-400">
                        {formatCurrency(listing.buyout_price || 0, 'scrap')}
                      </p>
                      <p className="text-xs text-gray-400">
                        {listing.status === 'active'
                          ? `Expires ${formatTimeRemaining(listing.expires_at)}`
                          : listing.status.toUpperCase()
                        }
                      </p>
                    </div>

                    {/* Status Badge */}
                    <Badge
                      className={
                        listing.status === 'active'
                          ? 'bg-green-500/20 text-green-400'
                          : listing.status === 'sold'
                          ? 'bg-cyan-500/20 text-cyan-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }
                    >
                      {listing.status}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sell Tab */}
      {activeTab === 'sell' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Select an Item to Sell</CardTitle>
            </CardHeader>
            <CardContent>
              {myItems.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  You don&apos;t have any items available to sell.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {myItems
                    .filter(item => item.template.is_tradeable)
                    .map(item => (
                      <div
                        key={item.id}
                        className="p-3 rounded-lg border border-gray-700 bg-gray-800/50 hover:border-cyan-500/50 cursor-pointer transition-colors"
                        onClick={() => handleCreateListing(item)}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{
                              backgroundColor: RARITY_CONFIG[item.template.rarity].bgColor,
                            }}
                          >
                            <span className="text-xl">
                              {item.template.type === 'weapon' ? '⚔️' :
                               item.template.type === 'armor' ? '🛡️' :
                               item.template.type === 'accessory' ? '💍' :
                               item.template.type === 'material' ? '🔮' : '📦'}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-white truncate">
                              {item.template.name}
                            </h4>
                            <div className="flex items-center gap-2">
                              <RarityBadge rarity={item.template.rarity} />
                              {item.quantity > 1 && (
                                <span className="text-xs text-gray-400">x{item.quantity}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create Listing Modal */}
      {selectedItem && (
        <CreateListingModal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedItem(null);
          }}
          item={selectedItem}
          playerId={playerId}
        />
      )}
    </div>
  );
}
