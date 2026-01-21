# RIFT-9 Autobattler

A sci-fi and magic fusion MMORPG autobattler with auction house, crafting, and PvP battles. Built with Next.js 15 and Supabase, designed to be hosted on Vercel.

## Features

### Core Gameplay
- **Autobattle System**: Tick-based, server-authoritative combat with deterministic outcomes
- **Team Building**: 6-unit teams with front/back row positioning
- **Synergy System**: 3 unique factions with powerful synergy bonuses
  - Technomancers (Attack boost)
  - Void Walkers (Speed/Energy)
  - Cyber Druids (Health/Defense)

### Items & Crafting
- Equipment system with 3 slots (Weapon, Armor, Accessory)
- 5 rarity tiers (Common to Legendary)
- Substat rolling and item enhancement
- Time-based crafting queue

### Auction House
- Player-to-player item trading
- Buyout pricing system
- Search and filter functionality
- Transaction history

### Player Progression
- Commander levels (1-100)
- Multiple currencies (Scrap, Ether, Credits)
- Unit progression with levels and star ranks

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand, TanStack Query
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/rift-9-autobattler.git
cd rift-9-autobattler
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Edit `.env.local` with your Supabase credentials.

4. Set up the database:
- Create a new Supabase project
- Run the migrations in `supabase/migrations/` against your database

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (game)/            # Game pages (protected)
│   └── api/               # API routes
├── components/
│   ├── ui/                # Base UI components
│   ├── battle/            # Battle viewer
│   ├── team/              # Team builder
│   └── auction/           # Auction house
├── lib/
│   ├── battle/            # Battle engine
│   ├── supabase/          # Database clients
│   └── utils/             # Utility functions
├── hooks/                 # React hooks
├── stores/                # Zustand stores
├── types/                 # TypeScript types
└── constants/             # Game constants

supabase/
├── migrations/            # SQL schema
└── functions/             # Edge functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add your environment variables in the Vercel dashboard
4. Deploy!

### Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |

## License

MIT
