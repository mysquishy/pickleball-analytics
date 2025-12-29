---
allowed-tools: all
description: Setup production-ready SaaS with auth, billing, and multi-tenancy
---

# /start-saas Command - SaaS Application Setup

Automatically set up and validate your production-ready SaaS application with authentication, billing, and multi-tenancy.

## What This Command Does

1. **Install Dependencies**
   - Run `npm install` with zero deprecation warnings
   - Verify all packages installed correctly
   - Check for security vulnerabilities

2. **Environment Configuration**
   - Create `.env.local` from `.env.example`
   - Guide through required environment variables
   - Validate critical config values

3. **Database Setup**
   - Initialize Prisma client
   - Run database migrations
   - Seed initial data (optional admin user)

4. **TypeScript Validation**
   - Run type checking across entire codebase
   - Ensure zero TypeScript errors
   - Validate API routes and components

5. **Initial Build**
   - Create production build to catch errors
   - Verify all routes compile
   - Check for build warnings

6. **Development Server**
   - Start Next.js dev server
   - Launch setup guide at /setup
   - Provide next steps for configuration

## Automated Steps

### Step 1: Dependency Installation

```bash
npm install
```

Expected result: **Zero deprecation warnings**
All packages install cleanly with no security vulnerabilities.

If errors occur:

- Clear npm cache: `npm cache clean --force`
- Delete node_modules: `rm -rf node_modules package-lock.json`
- Retry: `npm install`

### Step 2: Environment Setup

```bash
cp .env.example .env.local
```

**Required Environment Variables:**

```bash
# Database (SQLite for local, PostgreSQL for production)
DATABASE_URL="file:./prisma/db.sqlite"

# NextAuth (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Stripe (get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..." # Local: stripe listen

# Resend Email (get from https://resend.com/api-keys)
RESEND_API_KEY="re_..."

# OpenAI (optional, for AI chat feature)
OPENAI_API_KEY="sk-..."

# Sentry (optional, for error tracking)
SENTRY_DSN="https://..."
```

**Generate NEXTAUTH_SECRET:**

```bash
openssl rand -base64 32
```

### Step 3: Database Initialization

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database (development)
npx prisma db push

# Seed initial data (creates admin user)
npm run db:seed
```

**Default Admin User:**

- Email: `admin@example.com`
- Password: `admin123` (change immediately!)

**Open Prisma Studio (optional):**

```bash
npx prisma studio
```

Visit http://localhost:5555 to view/edit database

### Step 4: TypeScript Validation

```bash
npx tsc --noEmit
```

Expected: **Zero TypeScript errors**

Common fixes:

- Missing types: Ensure `types/next-auth.d.ts` exists
- Import errors: Check relative paths
- Session types: Verify auth configuration

### Step 5: Build Verification

```bash
npm run build
```

Expected output:

```
✓ Compiled successfully
Route (app)                Size      First Load JS
├ ○ /                      ...       ...
├ ƒ /dashboard            ...       ...
├ ƒ /admin                ...       ...
...
○ (Static)  prerendered
ƒ (Dynamic) server-rendered
```

All routes should compile without warnings.

### Step 6: Start Development Server

```bash
npm run dev
```

Server starts at: **http://localhost:3000**

## Validation Checklist

- [ ] Dependencies installed (zero deprecations)
- [ ] `.env.local` created with all required vars
- [ ] NEXTAUTH_SECRET generated
- [ ] Database initialized successfully
- [ ] Prisma client generated
- [ ] TypeScript compiles cleanly
- [ ] Build succeeds without warnings
- [ ] Dev server starts on port 3000
- [ ] Can access homepage at http://localhost:3000
- [ ] Setup guide accessible at http://localhost:3000/setup

## Configuration Guide

After setup completes, visit: **http://localhost:3000/setup**

The interactive setup guide will help you configure:

### 1. **Local Development** (Tab 1)

- ✅ SQLite database (already configured)
- ✅ NextAuth with localhost
- 🔄 Stripe test mode
- 🔄 Resend email (test mode)
- 🔄 OpenAI (optional)

### 2. **Production** (Tab 2)

- PostgreSQL database
- Vercel deployment
- Stripe live mode
- Custom domain
- Email domain verification

## Common Issues & Fixes

### Port 3000 already in use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

### Database connection fails

```bash
# Reset database
rm -rf prisma/db.sqlite*
npx prisma db push
npm run db:seed
```

### Prisma client errors

```bash
# Regenerate client
npx prisma generate
```

### TypeScript errors in auth

- Verify `types/next-auth.d.ts` declares organizationId
- Check `auth.ts` session callback returns correct types
- Ensure `lib/auth.ts` has proper return types

### Build fails with module errors

- Clear Next.js cache: `rm -rf .next`
- Rebuild: `npm run build`

### Stripe webhook errors (local testing)

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Forward webhooks to localhost
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Copy webhook secret to .env.local
# STRIPE_WEBHOOK_SECRET="whsec_..."
```

## Success Criteria

✅ All dependencies installed (zero warnings)
✅ Environment variables configured
✅ Database initialized and seeded
✅ Zero TypeScript errors
✅ Build completes successfully
✅ Dev server running on localhost:3000
✅ Setup guide accessible
✅ Can create account and login
✅ Admin dashboard accessible

## Next Steps After Setup

1. **Configure Services** (visit /setup):
   - Add Stripe test API keys
   - Add Resend API key for emails
   - (Optional) Add OpenAI API key
   - (Optional) Add Sentry DSN

2. **Test Authentication**:
   - Create new account at /signup
   - Verify email flow (check Resend dashboard)
   - Test login at /login
   - Access dashboard at /dashboard

3. **Test Billing** (with Stripe test mode):
   - Visit /pricing
   - Click upgrade to PRO
   - Use test card: `4242 4242 4242 4242`
   - Verify subscription in /dashboard/settings

4. **Test Multi-Tenancy**:
   - Create organization
   - Invite team member at /dashboard/settings
   - Test organization switching
   - Verify data isolation

5. **Customize Your SaaS**:
   - Modify landing page at `app/page.tsx`
   - Update pricing tiers in `lib/billing.ts`
   - Customize email templates in `emails/`
   - Add your features to `app/(dashboard)/`

## Pro Tips

- **Database Inspection**: Use `npx prisma studio` to view/edit data
- **Email Testing**: Check sent emails at https://resend.com/emails
- **Stripe Testing**: Use https://dashboard.stripe.com/test/webhooks for webhook logs
- **Hot Reload**: Changes auto-reload in dev mode
- **API Testing**: Use `/api/health` endpoint to verify server
- **Organization Switching**: Test with multiple browser profiles

## Deployment Preparation

When ready for production:

1. **Database Migration**:

   ```bash
   # Change DATABASE_URL to PostgreSQL
   # Run migration
   npx prisma migrate dev
   ```

2. **Environment Variables**:
   - Set all production values in Vercel/hosting platform
   - Use live Stripe keys
   - Update NEXTAUTH_URL to production domain

3. **Deploy**:

   ```bash
   # Vercel
   vercel

   # Or connect GitHub repo for auto-deploys
   ```

4. **Post-Deploy**:
   - Configure Stripe webhook endpoint (production)
   - Verify email domain in Resend
   - Test end-to-end flows in production
   - Monitor Sentry for errors

---

**🎉 Your production-ready SaaS is now set up!**
Visit http://localhost:3000/setup for detailed configuration guidance.
