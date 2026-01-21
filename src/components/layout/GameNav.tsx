'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Swords,
  Users,
  Package,
  Hammer,
  Store,
  User,
  Home,
  LogOut,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Tooltip } from '@/components/ui';

const navItems = [
  { href: '/game', label: 'Home', icon: Home, description: 'Dashboard & overview' },
  { href: '/battle', label: 'Battle', icon: Swords, description: 'PvE & PvP combat', highlight: true },
  { href: '/team', label: 'Team', icon: Users, description: 'Manage your squad' },
  { href: '/units', label: 'Units', icon: Sparkles, description: 'View all units' },
  { href: '/items', label: 'Items', icon: Package, description: 'Your inventory' },
  { href: '/crafting', label: 'Crafting', icon: Hammer, description: 'Create equipment' },
  { href: '/auction', label: 'Auction', icon: Store, description: 'Trade with players' },
  { href: '/profile', label: 'Profile', icon: User, description: 'Account settings' },
];

export function GameNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <nav className="fixed left-0 top-0 h-full w-64 flex flex-col z-40">
      {/* Background with glass effect */}
      <div className="absolute inset-0 bg-linear-to-b from-gray-900/95 via-gray-900/90 to-gray-950/95 backdrop-blur-xl" />
      <div className="absolute inset-0 bg-linear-to-b from-cyan-500/[0.02] to-purple-500/[0.02]" />
      <div className="absolute right-0 top-0 bottom-0 w-px bg-linear-to-b from-gray-700/50 via-gray-700/30 to-gray-700/50" />

      {/* Logo */}
      <div className="relative p-6">
        <Link href="/game" className="flex items-center gap-3 group">
          <div className="relative">
            {/* Logo glow */}
            <div className="absolute inset-0 bg-linear-to-br from-cyan-500 to-purple-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative w-11 h-11 rounded-xl bg-linear-to-br from-cyan-500 to-purple-500 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg tracking-tight">R9</span>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gradient-primary">
              RIFT-9
            </h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">
              Autobattler
            </p>
          </div>
        </Link>
      </div>

      {/* Divider */}
      <div className="relative mx-4 h-px bg-linear-to-r from-transparent via-gray-700/50 to-transparent" />

      {/* Navigation Items */}
      <div className="relative flex-1 py-4 overflow-y-auto no-scrollbar">
        <ul className="space-y-1 px-3">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href ||
              (item.href !== '/game' && pathname.startsWith(item.href));

            return (
              <li
                key={item.href}
                className="animate-fade-in-up opacity-0"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
              >
                <Tooltip content={item.description} position="right">
                  <Link
                    href={item.href}
                    className={cn(
                      'relative flex items-center gap-3 px-4 py-3 rounded-xl',
                      'transition-all duration-300 ease-out group',
                      isActive ? [
                        'bg-linear-to-r from-cyan-500/20 to-cyan-500/5',
                        'text-cyan-400',
                        'shadow-lg shadow-cyan-500/10',
                      ] : [
                        'text-gray-400',
                        'hover:text-white',
                        'hover:bg-white/5',
                      ]
                    )}
                  >
                    {/* Active indicator bar */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-linear-to-b from-cyan-400 to-cyan-600 rounded-full" />
                    )}

                    {/* Icon container */}
                    <div className={cn(
                      'relative flex items-center justify-center w-9 h-9 rounded-lg',
                      'transition-all duration-300',
                      isActive
                        ? 'bg-cyan-500/20'
                        : 'bg-gray-800/50 group-hover:bg-gray-700/50'
                    )}>
                      <Icon className={cn(
                        'w-5 h-5 transition-transform duration-300',
                        'group-hover:scale-110',
                        item.highlight && !isActive && 'text-amber-400'
                      )} />
                      {item.highlight && !isActive && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                      )}
                    </div>

                    {/* Label */}
                    <span className="font-medium flex-1">{item.label}</span>

                    {/* Hover arrow */}
                    <ChevronRight className={cn(
                      'w-4 h-4 transition-all duration-300',
                      'opacity-0 -translate-x-2',
                      'group-hover:opacity-50 group-hover:translate-x-0',
                      isActive && 'opacity-50 translate-x-0'
                    )} />
                  </Link>
                </Tooltip>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Bottom section */}
      <div className="relative">
        {/* Divider */}
        <div className="mx-4 h-px bg-linear-to-r from-transparent via-gray-700/50 to-transparent" />

        {/* Version info */}
        <div className="px-6 py-3">
          <p className="text-[10px] text-gray-600 uppercase tracking-wider">
            Version 0.1.0 Alpha
          </p>
        </div>

        {/* Logout Button */}
        <div className="p-3">
          <button
            onClick={handleLogout}
            className={cn(
              'flex items-center gap-3 w-full px-4 py-3 rounded-xl',
              'text-gray-400 hover:text-red-400',
              'bg-transparent hover:bg-red-500/10',
              'border border-transparent hover:border-red-500/20',
              'transition-all duration-300 group'
            )}
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-800/50 group-hover:bg-red-500/20 transition-colors">
              <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
            </div>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
