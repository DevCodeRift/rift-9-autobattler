import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import { Swords, Users, Hammer, Store, Trophy, Calendar } from 'lucide-react';

export default async function GameHomePage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  // Fetch player stats
  const { data: player } = await supabase
    .from('players')
    .select('*')
    .eq('id', user?.id)
    .single();

  // Fetch recent battles
  const { data: recentBattles } = await supabase
    .from('battles')
    .select('*')
    .or(`player1_id.eq.${user?.id},player2_id.eq.${user?.id}`)
    .order('started_at', { ascending: false })
    .limit(5);

  const winRate = player
    ? Math.round((player.battles_won / Math.max(1, player.battles_won + player.battles_lost)) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 border border-gray-700 p-8">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {player?.username || 'Commander'}!
          </h1>
          <p className="text-gray-300">
            Ready for your next battle? Your units await your command.
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/battle">
          <Card hover className="h-full border-cyan-500/30 hover:border-cyan-500/60">
            <CardContent className="flex items-center gap-4 py-6">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <Swords className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-bold text-white">Enter Battle</h3>
                <p className="text-sm text-gray-400">PvE Campaign or Arena</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/team">
          <Card hover className="h-full border-purple-500/30 hover:border-purple-500/60">
            <CardContent className="flex items-center gap-4 py-6">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="font-bold text-white">Manage Team</h3>
                <p className="text-sm text-gray-400">Build your squad</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/crafting">
          <Card hover className="h-full border-green-500/30 hover:border-green-500/60">
            <CardContent className="flex items-center gap-4 py-6">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <Hammer className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="font-bold text-white">Crafting</h3>
                <p className="text-sm text-gray-400">Create new gear</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/auction">
          <Card hover className="h-full border-yellow-500/30 hover:border-yellow-500/60">
            <CardContent className="flex items-center gap-4 py-6">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <Store className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="font-bold text-white">Auction House</h3>
                <p className="text-sm text-gray-400">Trade with others</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Stats and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Player Stats */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              Your Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Win Rate</span>
                <span className="text-white font-bold">{winRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Battles Won</span>
                <span className="text-green-400 font-bold">{player?.battles_won || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Battles Lost</span>
                <span className="text-red-400 font-bold">{player?.battles_lost || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Items Crafted</span>
                <span className="text-white font-bold">{player?.items_crafted || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Auction Sales</span>
                <span className="text-white font-bold">{player?.auction_sales || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Battles */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              Recent Battles
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentBattles && recentBattles.length > 0 ? (
              <div className="space-y-3">
                {recentBattles.map((battle) => {
                  const isWinner = battle.winner_id === user?.id;
                  const isPlayer1 = battle.player1_id === user?.id;

                  return (
                    <div
                      key={battle.id}
                      className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            battle.result === 'draw'
                              ? 'bg-gray-400'
                              : isWinner
                              ? 'bg-green-400'
                              : 'bg-red-400'
                          }`}
                        />
                        <div>
                          <span className="text-white font-medium capitalize">
                            {battle.mode} Battle
                          </span>
                          <span className="text-gray-400 text-sm ml-2">
                            {new Date(battle.started_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          battle.result === 'draw'
                            ? 'text-gray-400'
                            : isWinner
                            ? 'text-green-400'
                            : 'text-red-400'
                        }`}
                      >
                        {battle.result === 'draw' ? 'Draw' : isWinner ? 'Victory' : 'Defeat'}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">No battles yet. Start your journey!</p>
                <Link href="/battle">
                  <Button>Start Battle</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
