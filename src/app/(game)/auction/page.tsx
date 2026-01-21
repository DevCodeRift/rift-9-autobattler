import { createClient } from '@/lib/supabase/server';
import { AuctionBrowser } from '@/components/auction/AuctionBrowser';

export default async function AuctionPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  // Fetch active listings
  const { data: listings } = await supabase
    .from('auction_listings')
    .select(`
      *,
      item_template:item_templates(*),
      seller:players(username)
    `)
    .eq('status', 'active')
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(50);

  // Fetch player's own listings
  const { data: myListings } = await supabase
    .from('auction_listings')
    .select(`
      *,
      item_template:item_templates(*)
    `)
    .eq('seller_id', user?.id)
    .in('status', ['active', 'sold', 'expired'])
    .order('created_at', { ascending: false })
    .limit(20);

  // Fetch player's items for selling
  const { data: myItems } = await supabase
    .from('player_items')
    .select(`
      *,
      template:item_templates(*)
    `)
    .eq('player_id', user?.id)
    .eq('is_listed', false)
    .is('equipped_to_unit_id', null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Auction House</h1>
        <p className="text-gray-400">Buy and sell items with other players</p>
      </div>

      <AuctionBrowser
        listings={listings || []}
        myListings={myListings || []}
        myItems={myItems || []}
        playerId={user?.id || ''}
      />
    </div>
  );
}
