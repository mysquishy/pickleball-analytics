# 🚀 Production Deployment Guide

This guide will walk you through deploying Pickleball Analytics to production on Vercel.

## Prerequisites

- [ ] GitHub account with repo pushed
- [ ] Vercel account (sign up at vercel.com)
- [ ] PostgreSQL database (Supabase, Neon, or Railway recommended)
- [ ] Domain name (optional, can use Vercel's default)

---

## Step 1: Set Up Production Database

### Option A: Supabase (Recommended - Free Tier Available)

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Set database password (save it!)
4. Choose region closest to your users
5. Wait for project to be created
6. Go to Settings → Database
7. Copy the "Connection string" (URI format)
8. Replace `[YOUR-PASSWORD]` with your database password

Your DATABASE_URL will look like:

```
postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
```

### Option B: Neon (Serverless PostgreSQL)

1. Go to [neon.tech](https://neon.tech)
2. Click "Create Project"
3. Choose region
4. Copy the connection string
5. Format: `postgresql://user:password@epxyz.us-east-2.aws.neon.tech/neondb`

### Option C: Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Provision PostgreSQL"
3. Copy the DATABASE_URL from variables

---

## Step 2: Set Up Stripe (Required for Billing)

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Get API keys from "Developers" → "API keys"
3. Copy these keys:
   - **Publishable key** (`pk_live_...`)
   - **Secret key** (`sk_live_...`)
4. Create products/prices:
   - Go to "Products" → "Add product"
   - Create "Hobby Plan" ($99/month)
   - Create "Pro Plan" ($149/month)
   - Create "Enterprise Plan" ($299/month)
   - Copy each Price ID

5. Set up webhook:
   - Go to "Developers" → "Webhooks" → "Add endpoint"
   - URL: `https://your-domain.vercel.app/api/webhooks/stripe`
   - Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy the webhook signing secret

---

## Step 3: Set Up Resend (Required for Emails)

1. Go to [resend.com](https://resend.com)
2. Sign up/login
3. Go to "API Keys"
4. Create API key
5. Add your domain & verify DNS records
6. Set `EMAIL_FROM` to something like `noreply@yourdomain.com`

---

## Step 4: Deploy to Vercel

### Method A: Deploy via Vercel Dashboard (Easiest)

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure project:

#### Framework Preset

- **Framework**: Next.js
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

#### Environment Variables

Add these in Vercel (Settings → Environment Variables):

```bash
# Required
DATABASE_URL="your-postgres-connection-string"
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="m2fU/IPYYQbOGKMdbetsjwRZ0qrnkyfoprzVRiEXWcc="
NEXT_PUBLIC_APP_URL="https://your-app.vercel.app"

# Stripe
STRIPE_SECRET_KEY="sk_live_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_HOBBY_PRICE_ID="price_..."
STRIPE_PRO_PRICE_ID="price_..."
STRIPE_ENTERPRISE_PRICE_ID="price_..."

# Email
RESEND_API_KEY="re_..."
EMAIL_FROM="noreply@yourdomain.com"
```

5. Click "Deploy"
6. Wait for deployment (~2-3 minutes)
7. Visit your URL: `https://your-app.vercel.app`

### Method B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Production deploy
vercel --prod
```

---

## Step 5: Set Up Custom Domain (Optional)

1. In Vercel dashboard, go to "Settings" → "Domains"
2. Add your domain (e.g., `pickleball.yourdomain.com`)
3. Update DNS records:
   - **Type**: `CNAME`
   - **Name**: `pickleball` (or `@` for root domain)
   - **Value**: `cname.vercel-dns.com`

OR for A record:

- **Type**: `A`
- **Name**: `@`
- **Value**: `76.76.21.21`

4. Wait for DNS propagation (can take 24-48 hours)

---

## Step 6: Run Database Migrations

Vercel will auto-run migrations, but to verify:

```bash
# Push schema to production database
DATABASE_URL="your-production-url" npx prisma db push

# Or run migrations
DATABASE_URL="your-production-url" npx prisma migrate deploy
```

---

## Step 7: Post-Deployment Checklist

- [ ] Visit your site and test signup
- [ ] Create an organization
- [ ] Create a club
- [ ] Add players
- [ ] Log a match
- [ ] View leaderboard
- [ ] Test Stripe checkout
- [ ] Verify emails are sent
- [ ] Check error logs in Vercel dashboard
- [ ] Set up monitoring (Sentry, PostHog)

---

## Step 8: Configure OAuth (Optional)

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `https://your-domain.com/api/auth/callback/google`
6. Copy Client ID and Secret

### GitHub OAuth

1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. "New OAuth App"
3. Homepage URL: `https://your-domain.com`
4. Callback URL: `https://your-domain.com/api/auth/callback/github`
5. Copy Client ID and generate Client Secret

---

## Troubleshooting

### Database Connection Errors

**Error**: "Connection refused"

**Solution**:

- Verify DATABASE_URL is correct
- Check database allows external connections
- Ensure SSL is enabled (most PostgreSQL providers require it)

### Build Errors

**Error**: "Module not found"

**Solution**:

```bash
rm -rf node_modules .next
npm install
```

### Stripe Webhook Failures

**Error**: "No signatures found matching the expected signature"

**Solution**:

- Verify STRIPE_WEBHOOK_SECRET matches exactly
- Ensure webhook endpoint is live: `https://your-domain.com/api/webhooks/stripe`

### Environment Variables Not Working

**Solution**:

- In Vercel, go to Settings → Environment Variables
- Make sure to select all environments (Production, Preview, Development)
- Redeploy after adding variables

---

## Monitoring & Logs

### Vercel Dashboard

- **Deployments**: View build logs
- **Functions**: View serverless function logs
- **Analytics**: Traffic, performance

### Database

- **Supabase**: Dashboard → Database logs
- **Neon**: Dashboard → Logs
- **Railway**: Project → Logs

### Error Tracking (Sentry)

- Install Sentry SDK
- Set `SENTRY_DSN` environment variable
- View errors at `sentry.io`

---

## Backup & Recovery

### Database Backups (Supabase)

- Settings → Database → Backups
- Automated daily backups included
- Manual backups anytime

### Disaster Recovery

1. Export database regularly:

```bash
npx prisma db pull
```

2. Keep `.env` files backed up securely

3. Document all API keys and credentials

---

## Scaling Considerations

### When to Scale:

- **100+ concurrent users**: Upgrade database
- **1000+ matches/week**: Add caching
- **10,000+ players**: Optimize queries, add indexes

### Performance Tips:

- Enable Vercel Edge Functions for static pages
- Use PostgreSQL connection pooling
- Add Redis for session caching
- Implement CDN for static assets

---

## Cost Estimates

### Infrastructure (Monthly):

- **Vercel Hobby**: $0 (Free tier - 100GB bandwidth)
- **Vercel Pro**: $20 (Recommended for production)
- **Supabase**: $0 (Free tier - 500MB)
- **Supabase Pro**: $25 (Recommended)
- **Neon**: $0 (Free tier - 3 projects)
- **Railway**: $5 (Basic PostgreSQL)

### Total Monthly Cost: **$0-50** for MVP

### Recommended Budget: **$50-100/month** for production

---

## Next Steps After Deployment:

1. **Monitor for 1 week** - Check error rates, performance
2. **Beta testing** - Invite 5-10 clubs to test
3. **Gather feedback** - Talk to users, fix issues
4. **Launch marketing** - Blog posts, social media
5. **Iterate** - Fix bugs, add requested features

---

## Support

If you encounter issues:

- Check [Vercel docs](https://vercel.com/docs)
- Check [Prisma docs](https://www.prisma.io/docs)
- Check [Next.js docs](https://nextjs.org/docs)
- Review deployment logs in Vercel dashboard

Good luck! 🚀
