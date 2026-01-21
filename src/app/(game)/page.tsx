import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, Button, StatCard } from '@/components/ui';
import {
  Swords,
  Users,
  Hammer,
  Store,
  Trophy,
  Target,
  TrendingUp,
  Clock,
  ChevronRight,
  Sparkles,
  Shield,
  Zap,
} from 'lucide-react';

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

  const totalBattles = (player?.battles_won || 0) + (player?.battles_lost || 0);
  const winRate = totalBattles > 0
    ? Math.round((player.battles_won / totalBattles) * 100)
    : 0;

  // Get time of day for greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl">
        {/* Background layers */}
        <div className="absolute inset-0 bg-linear-to-br from-cyan-600/20 via-purple-600/20 to-pink-600/20" />
        <div className="absolute inset-0 bg-linear-to-t from-gray-900/80 to-transparent" />

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 p-8 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-3">
              <p className="text-cyan-400 text-sm font-medium tracking-wide uppercase">
                {greeting}, Commander
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Welcome back,{' '}
                <span className="text-gradient-primary">
                  {player?.username || 'Commander'}
                </span>
              </h1>
              <p className="text-gray-300 text-lg max-w-xl">
                Your units await your command. Lead them to victory in the arena
                or continue your campaign through the RIFT.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/battle">
                <Button size="lg" variant="glow" className="w-full sm:w-auto">
                  <Swords className="w-5 h-5" />
                  Enter Battle
                </Button>
              </Link>
              <Link href="/team">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <Users className="w-5 h-5" />
                  Manage Team
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Win Rate"
          value={`${winRate}%`}
          icon={<Target className="w-5 h-5" />}
          color="cyan"
        />
        <StatCard
          label="Victories"
          value={player?.battles_won || 0}
          icon={<Trophy className="w-5 h-5" />}
          color="green"
        />
        <StatCard
          label="Items Crafted"
          value={player?.items_crafted || 0}
          icon={<Hammer className="w-5 h-5" />}
          color="purple"
        />
        <StatCard
          label="Auction Sales"
          value={player?.auction_sales || 0}
          icon={<TrendingUp className="w-5 h-5" />}
          color="yellow"
        />
      </div>

      {/* Quick Actions Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Quick Actions</h2>
          <span className="text-sm text-gray-500">Jump right in</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/battle" className="group">
            <Card hover variant="glass" className="h-full">
              <CardContent className="flex items-center gap-4 py-5">
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-500/50 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative w-14 h-14 rounded-xl bg-linear-to-br from-cyan-500/30 to-cyan-600/30 border border-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Swords className="w-7 h-7 text-cyan-400" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white group-hover:text-cyan-400 transition-colors">
                    Enter Battle
                  </h3>
                  <p className="text-sm text-gray-400">PvE Campaign or Arena</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/team" className="group">
            <Card hover variant="glass" className="h-full">
              <CardContent className="flex items-center gap-4 py-5">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500/50 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative w-14 h-14 rounded-xl bg-linear-to-br from-purple-500/30 to-purple-600/30 border border-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Shield className="w-7 h-7 text-purple-400" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white group-hover:text-purple-400 transition-colors">
                    Manage Team
                  </h3>
                  <p className="text-sm text-gray-400">Build your squad</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/crafting" className="group">
            <Card hover variant="glass" className="h-full">
              <CardContent className="flex items-center gap-4 py-5">
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500/50 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative w-14 h-14 rounded-xl bg-linear-to-br from-emerald-500/30 to-emerald-600/30 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Zap className="w-7 h-7 text-emerald-400" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                    Crafting
                  </h3>
                  <p className="text-sm text-gray-400">Forge new gear</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/auction" className="group">
            <Card hover variant="glass" className="h-full">
              <CardContent className="flex items-center gap-4 py-5">
                <div className="relative">
                  <div className="absolute inset-0 bg-amber-500/50 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative w-14 h-14 rounded-xl bg-linear-to-br from-amber-500/30 to-amber-600/30 border border-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Store className="w-7 h-7 text-amber-400" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white group-hover:text-amber-400 transition-colors">
                    Auction House
                  </h3>
                  <p className="text-sm text-gray-400">Trade with players</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Battles - Takes 2 columns */}
        <Card variant="glass" className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <span className="block">Recent Battles</span>
                <span className="text-sm font-normal text-gray-400">Your latest combat history</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentBattles && recentBattles.length > 0 ? (
              <div className="space-y-3">
                {recentBattles.map((battle, index) => {
                  const isWinner = battle.winner_id === user?.id;
                  const isDraw = battle.result === 'draw';

                  return (
                    <div
                      key={battle.id}
                      className="group flex items-center justify-between p-4 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/30 hover:border-gray-600/50 transition-all animate-fade-in-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center gap-4">
                        {/* Result indicator */}
                        <div className={`
                          w-12 h-12 rounded-xl flex items-center justify-center
                          ${isDraw
                            ? 'bg-gray-500/20 border border-gray-500/30'
                            : isWinner
                              ? 'bg-green-500/20 border border-green-500/30'
                              : 'bg-red-500/20 border border-red-500/30'
                          }
                        `}>
                          {isDraw ? (
                            <span className="text-gray-400 text-lg font-bold">=</span>
                          ) : isWinner ? (
                            <Trophy className="w-5 h-5 text-green-400" />
                          ) : (
                            <Swords className="w-5 h-5 text-red-400" />
                          )}
                        </div>

                        <div>
                          <span className="text-white font-semibold capitalize block">
                            {battle.mode} Battle
                          </span>
                          <span className="text-gray-500 text-sm">
                            {new Date(battle.started_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className={`
                          px-3 py-1 rounded-full text-sm font-semibold
                          ${isDraw
                            ? 'bg-gray-500/20 text-gray-400'
                            : isWinner
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }
                        `}>
                          {isDraw ? 'Draw' : isWinner ? 'Victory' : 'Defeat'}
                        </span>
                        <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-400 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-gray-800/50 flex items-center justify-center mx-auto mb-4">
                  <Swords className="w-10 h-10 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No battles yet</h3>
                <p className="text-gray-400 mb-6">Start your journey and prove your worth!</p>
                <Link href="/battle">
                  <Button variant="glow">
                    <Swords className="w-4 h-4" />
                    Start Your First Battle
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Side panel */}
        <div className="space-y-6">
          {/* Daily Challenges Teaser */}
          <Card variant="glass">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Daily Challenges</h3>
                  <p className="text-xs text-gray-400">Coming Soon</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Complete daily missions to earn bonus rewards and exclusive items.
              </p>
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex-1 h-2 rounded-full bg-gray-700/50"
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card variant="glass">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="font-bold text-white">Quick Tip</h3>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                Build a balanced team with units from multiple factions to unlock
                powerful synergy bonuses. Check the Team Builder to see available synergies!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
