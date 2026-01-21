import Link from 'next/link';
import { Button } from '@/components/ui';
import { Swords, Users, Store, Zap, ChevronRight, Sparkles, Shield, Trophy } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 overflow-hidden">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-indigo-500/5 rounded-full blur-[150px]" />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(6, 182, 212, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6, 182, 212, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      {/* Hero Section */}
      <div className="relative">
        {/* Navigation */}
        <nav className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-br from-cyan-500 to-purple-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative w-11 h-11 rounded-xl bg-linear-to-br from-cyan-500 to-purple-500 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg tracking-tight">R9</span>
              </div>
            </div>
            <div>
              <span className="text-xl font-bold text-gradient-primary">
                RIFT-9
              </span>
              <span className="block text-[10px] text-gray-500 uppercase tracking-wider">
                Autobattler
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="md">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button variant="glow" size="md">
                Play Free
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-8">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-400 font-medium">Now in Alpha</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-white">Where </span>
              <span className="text-gradient-primary">Sci-Fi</span>
              <br />
              <span className="text-white">Meets </span>
              <span className="bg-linear-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Magic
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Command your squad of technomancers, void walkers, and cyber druids in this
              strategic autobattler. Craft powerful gear, trade in the auction house, and
              dominate the arena.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <Link href="/register">
                <Button size="xl" variant="glow" className="text-lg">
                  <Swords className="w-5 h-5" />
                  Start Playing Free
                </Button>
              </Link>
              <Link href="#features">
                <Button size="xl" variant="outline" className="text-lg">
                  Learn More
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              {[
                { value: '18+', label: 'Unique Units' },
                { value: '3', label: 'Factions' },
                { value: '50+', label: 'Items' },
                { value: '∞', label: 'Strategies' },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className="text-center animate-fade-in-up opacity-0"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                >
                  <div className="text-4xl font-bold text-gradient-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-gray-500 text-sm uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="relative py-24">
        {/* Section background */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-gray-900/50 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Core Features
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Everything you need for the ultimate autobattler experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Swords,
                title: 'Strategic Battles',
                description: 'Position your units wisely and watch them fight automatically. Synergies and team composition matter!',
                color: 'cyan',
              },
              {
                icon: Users,
                title: 'Unique Factions',
                description: 'Technomancers, Void Walkers, Cyber Druids - each faction has unique abilities and synergy bonuses.',
                color: 'purple',
              },
              {
                icon: Zap,
                title: 'Crafting System',
                description: 'Gather materials from battles and craft powerful equipment to enhance your units.',
                color: 'green',
              },
              {
                icon: Store,
                title: 'Auction House',
                description: 'Trade items with other players in the marketplace. Find rare gear or sell your crafted items.',
                color: 'amber',
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              const colorClasses = {
                cyan: {
                  bg: 'from-cyan-500/20 to-cyan-500/5',
                  border: 'border-cyan-500/20 hover:border-cyan-500/40',
                  icon: 'bg-cyan-500/20 text-cyan-400',
                  glow: 'group-hover:shadow-cyan-500/20',
                },
                purple: {
                  bg: 'from-purple-500/20 to-purple-500/5',
                  border: 'border-purple-500/20 hover:border-purple-500/40',
                  icon: 'bg-purple-500/20 text-purple-400',
                  glow: 'group-hover:shadow-purple-500/20',
                },
                green: {
                  bg: 'from-emerald-500/20 to-emerald-500/5',
                  border: 'border-emerald-500/20 hover:border-emerald-500/40',
                  icon: 'bg-emerald-500/20 text-emerald-400',
                  glow: 'group-hover:shadow-emerald-500/20',
                },
                amber: {
                  bg: 'from-amber-500/20 to-amber-500/5',
                  border: 'border-amber-500/20 hover:border-amber-500/40',
                  icon: 'bg-amber-500/20 text-amber-400',
                  glow: 'group-hover:shadow-amber-500/20',
                },
              };
              const colors = colorClasses[feature.color as keyof typeof colorClasses];

              return (
                <div
                  key={feature.title}
                  className="group animate-fade-in-up opacity-0"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                >
                  <div
                    className={`
                      relative h-full p-6 rounded-2xl
                      bg-linear-to-br ${colors.bg}
                      border ${colors.border}
                      backdrop-blur-xl
                      transition-all duration-300
                      hover:-translate-y-1 hover:shadow-xl ${colors.glow}
                    `}
                  >
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-xl ${colors.icon} flex items-center justify-center mb-5`}>
                      <Icon className="w-7 h-7" />
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Factions Preview */}
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Choose Your Faction
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Each faction brings unique strengths and synergies to your team
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Technomancers',
                icon: '⚡',
                color: '#00d4ff',
                description: 'Masters of technology and arcane circuits. High damage output with energy manipulation.',
                bonus: '+15% Attack when 3+ units',
              },
              {
                name: 'Void Walkers',
                icon: '🌀',
                color: '#8b5cf6',
                description: 'Dimensional travelers who phase through reality. High speed and evasion specialists.',
                bonus: '+20% Speed when 3+ units',
              },
              {
                name: 'Cyber Druids',
                icon: '🌿',
                color: '#10b981',
                description: 'Guardians of the digital forest. Strong healing and defensive capabilities.',
                bonus: '+25% Defense when 3+ units',
              },
            ].map((faction, index) => (
              <div
                key={faction.name}
                className="group relative animate-fade-in-up opacity-0"
                style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
              >
                <div
                  className="relative h-full p-8 rounded-2xl border border-gray-700/50 bg-gray-900/50 backdrop-blur-xl overflow-hidden transition-all duration-500 hover:-translate-y-2"
                  style={{
                    boxShadow: `0 0 0 1px ${faction.color}10`,
                  }}
                >
                  {/* Glow effect on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at 50% 0%, ${faction.color}15 0%, transparent 70%)`,
                    }}
                  />

                  {/* Icon */}
                  <div className="relative mb-6">
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mx-auto transition-transform duration-300 group-hover:scale-110"
                      style={{
                        backgroundColor: `${faction.color}20`,
                        boxShadow: `0 0 40px ${faction.color}20`,
                      }}
                    >
                      {faction.icon}
                    </div>
                  </div>

                  <h3
                    className="text-2xl font-bold text-center mb-3 transition-colors"
                    style={{ color: faction.color }}
                  >
                    {faction.name}
                  </h3>
                  <p className="text-gray-400 text-center mb-6 leading-relaxed">
                    {faction.description}
                  </p>

                  {/* Synergy bonus */}
                  <div
                    className="px-4 py-2 rounded-lg text-center text-sm font-medium"
                    style={{
                      backgroundColor: `${faction.color}15`,
                      color: faction.color,
                    }}
                  >
                    <Shield className="w-4 h-4 inline mr-1" />
                    {faction.bonus}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative rounded-3xl overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-linear-to-br from-cyan-600/20 via-purple-600/20 to-pink-600/20" />
            <div className="absolute inset-0 bg-linear-to-t from-gray-900/90 to-gray-900/50" />

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-[60px]" />

            {/* Content */}
            <div className="relative z-10 p-12 md:p-16 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-amber-400 font-medium">Join the Arena</span>
              </div>

              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Ready to Command?
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of commanders in the RIFT-9 universe. Create your account
                and start building your ultimate team today.
              </p>
              <Link href="/register">
                <Button size="xl" variant="glow" className="text-lg">
                  <Sparkles className="w-5 h-5" />
                  Create Free Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-gray-800/50 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-linear-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">R9</span>
            </div>
            <span className="text-gray-400">RIFT-9 Autobattler</span>
          </div>
          <p className="text-gray-600 text-sm">
            © 2026 RIFT-9. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
