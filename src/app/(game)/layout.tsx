import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { GameNav } from '@/components/layout/GameNav';
import { PlayerHeader } from '@/components/layout/PlayerHeader';

export default async function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch player data
  const { data: player } = await supabase
    .from('players')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar Navigation */}
      <GameNav />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header with player info */}
        <PlayerHeader player={player} />

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
