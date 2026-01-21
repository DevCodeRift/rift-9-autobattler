import { createClient } from '@/lib/supabase/server';
import { TeamBuilder } from '@/components/team/TeamBuilder';

export default async function TeamPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  // Fetch player's units with templates
  const { data: playerUnits } = await supabase
    .from('player_units')
    .select(`
      *,
      template:unit_templates(*)
    `)
    .eq('player_id', user?.id);

  // Fetch player's active team
  const { data: activeTeam } = await supabase
    .from('player_teams')
    .select('*')
    .eq('player_id', user?.id)
    .eq('is_active', true)
    .single();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Team Builder</h1>
          <p className="text-gray-400">Arrange your units and activate synergies</p>
        </div>
      </div>

      <TeamBuilder
        units={playerUnits || []}
        activeTeam={activeTeam}
        playerId={user?.id || ''}
      />
    </div>
  );
}
