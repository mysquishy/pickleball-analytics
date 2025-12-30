# ✅ Pre-Deployment Checklist

Use this checklist to ensure everything is ready before deploying to production.

## 🔐 Security & Configuration

- [ ] Generate secure `NEXTAUTH_SECRET` (done: `m2fU/IPYYQbOGKMdbetsjwRZ0qrnkyfoprzVRiEXWcc=`)
- [ ] Update `.env` with production values
- [ ] Set up production database (PostgreSQL)
- [ ] Configure Stripe (get API keys)
- [ ] Configure Resend (for emails)
- [ ] Set up OAuth providers (optional)
- [ ] Review and remove any test API keys

## 📊 Database

- [ ] Choose PostgreSQL provider (Supabase/Neon/Railway)
- [ ] Create production database
- [ ] Get connection string (DATABASE_URL)
- [ ] Test connection locally first
- [ ] Run `npx prisma db push` to verify schema
- [ ] Set up automated backups

## 💳 Stripe Setup

- [ ] Create Stripe account
- [ ] Create 3 products (Hobby $99, Pro $149, Enterprise $299)
- [ ] Get Price IDs for all products
- [ ] Set up webhook endpoint
- [ ] Configure webhook events:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
- [ ] Get webhook signing secret
- [ ] Test checkout flow in test mode

## 📧 Email Setup

- [ ] Create Resend account
- [ ] Verify domain DNS records
- [ ] Create API key
- [ ] Set `EMAIL_FROM` address
- [ ] Send test email
- [ ] Set up email templates:
  - Welcome email
  - Subscription confirmation
  - Match notifications
  - Weekly stats digest

## 🚀 Vercel Deployment

- [ ] Create Vercel account
- [ ] Connect GitHub repository
- [ ] Configure project settings
- [ ] Add all environment variables
- [ ] Set custom domain (optional)
- [ ] Deploy to preview environment first
- [ ] Test all features in preview
- [ ] Deploy to production

## 🧪 Testing Checklist

### Core Features

- [ ] User signup/login
- [ ] Organization creation
- [ ] Club creation
- [ ] Court management
- [ ] Player registration
- [ ] Match logging (singles)
- [ ] Match logging (doubles)
- [ ] Leaderboard viewing
- [ ] Player profile stats
- [ ] League creation
- [ ] League standings

### Authentication

- [ ] Login works
- [ ] Logout works
- [ ] Session persistence
- [ ] Protected routes redirect correctly
- [ ] OAuth providers (if configured)

### Billing

- [ ] Stripe checkout loads
- [ ] Plan selection works
- [ ] Payment processes correctly
- [ ] Webhook receives events
- [ ] Subscription activates
- [ ] Customer portal works

### Multi-Tenant (CRITICAL!)

- [ ] Users can only see their org's clubs
- [ ] Cross-org data access is blocked
- [ ] Role-based permissions work
- [ ] API enforces organization boundaries

## 📈 Monitoring Setup

- [ ] Set up error tracking (Sentry)
- [ ] Set up analytics (PostHog)
- [ ] Configure logging
- [ ] Set up uptime monitoring
- [ ] Create alerts for critical failures

## 📝 Documentation

- [ ] Update README with production URL
- [ ] Document all API keys (securely)
- [ ] Create runbook for common issues
- [ ] Document backup/restore procedures
- [ ] Write troubleshooting guide

## 🎯 Launch Readiness

### Pre-Launch

- [ ] Test with 5 beta users
- [ ] Fix critical bugs
- [ ] Load test (100 concurrent users)
- [ ] Security review
- [ ] Performance optimization

### Launch Day

- [ ] Set up DNS (if custom domain)
- [ ] Configure CDN
- [ ] Enable SSL (automatic with Vercel)
- [ ] Test all user flows
- [ ] Monitor error rates
- [ ] Be ready to rollback

### Post-Launch

- [ ] Monitor for 48 hours
- [ ] Respond to support requests
- [ ] Fix critical bugs immediately
- [ ] Gather user feedback
- [ ] Plan next sprint

---

## 🚨 Critical Stop Signs

**DO NOT DEPLOY if:**

- ❌ Multi-tenant tests fail
- ❌ Database connection fails
- ❌ Stripe webhooks don't work
- ❌ Environment variables are missing
- ❌ Build errors in production
- ❌ Auth isn't working
- ❌ Stats calculations are wrong

---

## 📞 Emergency Contacts

- Vercel Support: https://vercel.com/support
- Stripe Support: https://stripe.com/contact
- Supabase Support: https://supabase.com/support
- Next.js Docs: https://nextjs.org/docs

---

## 💡 Pro Tips

1. **Deploy to Preview First**: Always test in Vercel preview environment before production
2. **Keep Local Backup**: `npx prisma db pull` before any major changes
3. **Monitor Costs**: Set up budget alerts in Vercel and database providers
4. **Version Everything**: Tag releases in git for easy rollbacks
5. **Test Rollback**: Know how to revert `vercel rollback --to <deployment-url>`

---

**When all items are checked, you're ready to launch!** 🎉
