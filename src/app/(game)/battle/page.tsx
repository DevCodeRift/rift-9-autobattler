import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import { Swords, Map, Trophy, Users } from 'lucide-react';

export default async function BattlePage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  // Check if player has an active team
  const { data: activeTeam } = await supabase
    .from('player_teams')
    .select('*')
    .eq('player_id', user?.id)
    .eq('is_active', true)
    .single();

  const teamSize = activeTeam
    ? Object.keys(activeTeam.unit_positions || {}).length
    : 0;

  const hasValidTeam = teamSize >= 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Battle Arena</h1>
        <p className="text-gray-400">Choose your battle mode and test your team</p>
      </div>

      {/* Team Status */}
      {!hasValidTeam && (
        <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-yellow-400 font-medium">No Active Team</p>
              <p className="text-sm text-gray-400">
                You need at least 1 unit in your team to battle.{' '}
                <Link href="/team" className="text-cyan-400 hover:underline">
                  Build your team
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Battle Modes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PvE Campaign */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="w-5 h-5 text-green-400" />
              Story Campaign
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <p className="text-gray-400 mb-4">
              Battle through the story stages to earn rewards, unlock new units,
              and discover the secrets of the RIFT-9 universe.
            </p>

            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-sm text-gray-400">Progress</span>
                <p className="text-lg font-bold text-white">Stage 1-1</p>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-400">Rewards</span>
                <p className="text-lg font-bold text-green-400">50-100 Scrap</p>
              </div>
            </div>

            <Link href="/battle/story">
              <Button className="w-full" disabled={!hasValidTeam}>
                <Map className="w-4 h-4 mr-2" />
                Enter Campaign
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* PvP Arena */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Swords className="w-5 h-5 text-cyan-400" />
              PvP Arena
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <p className="text-gray-400 mb-4">
              Battle against other players&apos; teams. Win to climb the ranks
              and earn exclusive rewards.
            </p>

            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-sm text-gray-400">Your Rank</span>
                <p className="text-lg font-bold text-white">Bronze</p>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-400">Rewards</span>
                <p className="text-lg font-bold text-cyan-400">75-150 Scrap</p>
              </div>
            </div>

            <Link href="/battle/arena">
              <Button variant="secondary" className="w-full" disabled={!hasValidTeam}>
                <Swords className="w-4 h-4 mr-2" />
                Enter Arena
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Battle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Quick Battle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 mb-4">
            Jump into a random battle against an AI opponent. Perfect for testing
            your team composition and strategies.
          </p>

          <Link href="/battle/quick">
            <Button variant="outline" disabled={!hasValidTeam}>
              Start Quick Battle
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Battles */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Battles</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 text-center py-8">
            Your battle history will appear here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
