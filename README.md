# 🎾 Pickleball Analytics

> The simplest way for pickleball clubs to track leagues, matches, and player stats.

## ✨ Features

- **Club Management** - Manage courts, facilities, and settings
- **Player Profiles** - Track skill levels (1.0-5.0) and performance
- **Match Logging** - Quick score entry in seconds
- **Player Stats** - Win/loss records, trends, head-to-head comparisons
- **Leaderboards** - Overall, skill-level, and monthly rankings
- **League Management** - Round-robin scheduling and standings
- **Multi-Tenant** - Each club is isolated with their own data
- **Role-Based Access** - Admin, organizers, and players

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Run database migrations
npx prisma db push

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📊 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.7
- **Database**: Prisma (SQLite dev / PostgreSQL prod)
- **Auth**: NextAuth v5
- **Styling**: Tailwind CSS v4
- **UI**: Shadcn UI
- **Payments**: Stripe (ready for integration)

## 🏗️ Project Structure

```
pickleball-analytics/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── (dashboard)/  # Protected routes
│   │   ├── api/          # API endpoints
│   │   └── layout.tsx
│   ├── components/       # React components
│   ├── lib/             # Utilities
│   └── prisma.ts        # Database client
├── prisma/
│   └── schema.prisma    # Database schema
└── docs/                # Documentation
```

## 🎯 Current Status

### ✅ Completed (From Template)

- [x] Authentication system
- [x] Multi-tenant architecture
- [x] Database setup
- [x] Stripe billing integration
- [x] Email system
- [x] Testing framework
- [x] CI/CD pipeline
- [x] Admin dashboard

### 🚧 In Progress (Pickleball Features)

- [ ] Database schema (Club, Court, Player, Match models)
- [ ] Club management UI
- [ ] Match logging interface
- [ ] Player stats dashboard
- [ ] League management
- [ ] Leaderboards

See [`docs/PICKLEBALL_MVP.md`](docs/PICKLEBALL_MVP.md) for full development plan.

## 📖 Documentation

- [Development Plan](docs/PICKLEBALL_MVP.md) - 3-week sprint plan
- [Database Schema](docs/PICKLEBALL_SCHEMA.md) - Data models
- [API Documentation](docs/API_DOCS.md) - Coming soon

## 💰 Pricing (Future)

- **Starter**: $99/month (50 players, 3 courts)
- **Pro**: $199/month (200 players, 8 courts, leagues)
- **Premium**: $299/month (unlimited everything)

## 🤝 Contributing

This is a commercial product. For inquiries, contact [your-email@example.com].

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

Built with ❤️ for the pickleball community
