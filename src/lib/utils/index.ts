export { cn } from './cn';

// Format large numbers with abbreviations
export function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + 'K';
  }
  return num.toString();
}

// Format currency with icon
export function formatCurrency(amount: number, type: 'scrap' | 'ether' | 'credits'): string {
  const icons = {
    scrap: '⚙️',
    ether: '✨',
    credits: '💎',
  };
  return `${icons[type]} ${formatNumber(amount)}`;
}

// Format time remaining
export function formatTimeRemaining(targetDate: Date | string): string {
  const target = new Date(targetDate);
  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) return 'Expired';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}

// Format duration in seconds to readable string
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

// Seeded random number generator for deterministic battles
export function seededRandom(seed: number): () => number {
  return function() {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
}

// Weighted random selection
export function weightedRandom<T extends { weight: number }>(
  items: T[],
  random: () => number = Math.random
): T {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let randomValue = random() * totalWeight;

  for (const item of items) {
    randomValue -= item.weight;
    if (randomValue <= 0) {
      return item;
    }
  }

  return items[items.length - 1];
}

// Calculate percentage
export function percentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

// Clamp a number between min and max
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
