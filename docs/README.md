# Documentation Index

Complete guide to the SaaS boilerplate project. All documentation is consolidated in this `docs/` directory.

## 📚 Table of Contents

### Getting Started

1. **[README.md](../README.md)** - Project overview, features, and quick start
2. **[LANDING_PAGE.md](./LANDING_PAGE.md)** - How to customize the landing page (46 TODOs)

### Development Guides

3. **[SRC_REFACTOR.md](./SRC_REFACTOR.md)** - Project structure and `src/` directory organization
4. **[TYPESCRIPT_ISSUES.md](./TYPESCRIPT_ISSUES.md)** - TypeScript configuration and known issues
5. **[GIT_HOOKS.md](./GIT_HOOKS.md)** - Git hooks setup and pre-commit configuration

### Features

6. **[NEW_FEATURES.md](./NEW_FEATURES.md)** - Production-ready features added to the boilerplate

### Behavioral Guidelines

7. **[CLAUDE.md](../CLAUDE.md)** - AI assistant behavioral directives (for Claude Code users)

---

## Quick Navigation

### By Topic

#### Architecture & Structure

- [SRC_REFACTOR.md](./SRC_REFACTOR.md) - Directory layout, file organization
- [TYPESCRIPT_ISSUES.md](./TYPESCRIPT_ISSUES.md) - Type safety, strict mode

#### Features

- [NEW_FEATURES.md](./NEW_FEATURES.md) - Testing, analytics, CI/CD, feature flags
- [LANDING_PAGE.md](./LANDING_PAGE.md) - Homepage customization guide

#### Development Workflow

- [GIT_HOOKS.md](./GIT_HOOKS.md) - Pre-commit hooks, linting, formatting
- [TYPESCRIPT_ISSUES.md](./TYPESCRIPT_ISSUES.md) - Type checking workflow

#### Customization

- [LANDING_PAGE.md](./LANDING_PAGE.md) - Branding, copy, images, testimonials

---

## 🚀 Quick Start

1. **New to this project?** Start with [README.md](../README.md)
2. **Customizing the landing page?** See [LANDING_PAGE.md](./LANDING_PAGE.md)
3. **Understanding the codebase?** Read [SRC_REFACTOR.md](./SRC_REFACTOR.md)
4. **Adding features?** Check [NEW_FEATURES.md](./NEW_FEATURES.md)

---

## 📖 Documentation Summary

| File                     | Purpose                    | Audience    |
| ------------------------ | -------------------------- | ----------- |
| **README.md**            | Project overview           | Everyone    |
| **LANDING_PAGE.md**      | Landing page customization | Developers  |
| **SRC_REFACTOR.md**      | Project structure          | Developers  |
| **TYPESCRIPT_ISSUES.md** | TypeScript config          | Developers  |
| **GIT_HOOKS.md**         | Git workflow               | Developers  |
| **NEW_FEATURES.md**      | Feature list               | Everyone    |
| **CLAUDE.md**            | AI behavior                | Claude Code |

---

## 🔍 Common Tasks

### Customize Your SaaS

1. **Branding**
   - Update logo in `src/app/page.tsx:13`
   - See [LANDING_PAGE.md](./LANDING_PAGE.md)

2. **Content**
   - Update copy in `src/app/page.tsx`
   - 46 TODO placeholders to customize
   - Step-by-step guide in [LANDING_PAGE.md](./LANDING_PAGE.md)

3. **Features**
   - All production features documented in [NEW_FEATURES.md](./NEW_FEATURES.md)
   - Testing, analytics, CI/CD, feature flags, API docs

### Understand the Codebase

1. **Project Structure**
   - `src/` based layout (see [SRC_REFACTOR.md](./SRC_REFACTOR.md))
   - Feature-based organization
   - Co-located tests

2. **Type Safety**
   - Strict TypeScript enabled
   - Zero type errors
   - See [TYPESCRIPT_ISSUES.md](./TYPESCRIPT_ISSUES.md)

3. **Development Workflow**
   - Git hooks for quality (see [GIT_HOOKS.md](./GIT_HOOKS.md))
   - Automated linting, formatting, type checking

---

## 📝 Maintenance

### Adding Documentation

When adding new documentation:

1. Create markdown file in `docs/`
2. Add link to this index (`docs/README.md`)
3. Update relevant section above
4. Keep descriptions concise

### Updating Documentation

- Keep files focused on single topic
- Use code examples for clarity
- Update as features evolve
- Remove outdated information

---

## 🎯 Key Files Reference

### Configuration Files (Root)

```
├── package.json          # Dependencies & scripts
├── tsconfig.json         # TypeScript config
├── next.config.js        # Next.js config
├── tailwind.config.js    # Tailwind CSS config
├── jest.config.js        # Jest testing config
├── playwright.config.ts  # E2E testing config
├── .env.example          # Environment variables template
└── prisma/schema.prisma  # Database schema
```

### Source Code (`src/`)

```
src/
├── app/                  # Next.js App Router
│   ├── (auth)/          # Auth routes
│   ├── (dashboard)/     # Protected routes
│   ├── api/             # API endpoints
│   └── page.tsx         # Landing page
├── components/          # React components
├── lib/                 # Utilities & helpers
├── emails/              # Email templates
├── types/               # TypeScript types
├── auth.ts              # NextAuth config
└── middleware.ts        # Next.js middleware
```

See [SRC_REFACTOR.md](./SRC_REFACTOR.md) for complete structure.

---

## 🤝 Contributing

When contributing:

1. Read [CLAUDE.md](../CLAUDE.md) for behavioral guidelines
2. Follow existing code patterns
3. Update relevant documentation
4. Test your changes (see [GIT_HOOKS.md](./GIT_HOOKS.md))

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**Last updated:** 2025-12-29

**Project version:** 1.1.0
