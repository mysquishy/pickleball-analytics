# 📦 Supabase Database Setup - Complete Guide

Your Supabase project has been created! 🎉

**Project Details:**

- **Name**: pickleball-analytics
- **Reference ID**: `kmjewkudbcicrncynzgf`
- **Dashboard**: https://supabase.com/dashboard/project/kmjewkudbcicrncynzgf
- **Region**: East US (North Virginia)
- **Password**: `pickleballProd2025!`

---

## Step 1: Get Your Database Connection String

1. Open your Supabase dashboard: https://supabase.com/dashboard/project/kmjewkudbcicrncynzgf
2. Click on **Settings** (left sidebar) → **Database**
3. Scroll down to **Connection String** section
4. Select **URI** tab
5. Copy the connection string
6. Replace `[YOUR-PASSWORD]` with `pickleballProd2025!`

Your connection string should look like:

```
postgresql://postgres.kmjewkudbcicrncynzgf:pickleballProd2025!@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

⚠️ **Important**: Make sure you're using the **Direct connection** (pooler) string for Prisma!

---

## Step 2: Update Your Environment File

Once you have the correct connection string, update `.env.production.local`:

```bash
DATABASE_URL="your-exact-connection-string-here"
```

---

## Step 3: Push Database Schema

Run this command to create all tables:

```bash
DATABASE_URL="your-connection-string" npx prisma db push
```

You should see output like:

```
✔ Schema loaded from prisma/schema.prisma
✔ Datasource "db": PostgreSQL database
...
🚀  Done!
```

---

## Step 4: Verify Database Setup

```bash
DATABASE_URL="your-connection-string" npx prisma studio
```

This will open Prisma Studio showing all your tables:

- Organization
- Club
- Court
- Player
- Match
- PlayerMatch
- League
- LeagueMembership
- (And all auth tables)

---

## Step 5: Seed Production Database (Optional)

If you want sample data in production:

```bash
DATABASE_URL="your-connection-string" npx prisma db seed
```

---

## Common Issues & Solutions

### Issue: "Tenant or user not found"

**Cause**: Database is still initializing (can take 2-3 minutes)

**Solution**:

1. Wait 2-3 minutes
2. Verify password is correct: `pickleballProd2025!`
3. Make sure you're using pooler URL: `aws-0-us-east-1.pooler.supabase.com`

### Issue: "Connection refused"

**Cause**: Wrong connection string format

**Solution**: Use the **URI** format, not "Transaction" or "Session"

### Issue: "SSL required"

**Cause**: Supabase requires SSL

**Solution**: Add `?sslmode=require` to your DATABASE_URL

---

## Next Steps After Database Setup

1. ✅ Database schema pushed
2. ⏭️ Deploy to Vercel
3. ⏭️ Add Stripe configuration
4. ⏭️ Test all features

---

## Quick Reference

- **Dashboard**: https://supabase.com/dashboard/project/kmjewkudbcicrncynzgf
- **Database**: https://supabase.com/dashboard/project/kmjewkudbcicrncynzgf/database
- **SQL Editor**: https://supabase.com/dashboard/project/kmjewkudbcicrncynzgf/sql/new
- **API Settings**: https://supabase.com/dashboard/project/kmjewkudbcicrncynzgf/settings/api
- **Authentication**: https://supabase.com/dashboard/project/kmjewkudbcicrncynzgf/auth/users

---

## Database Backups

Supabase automatically backs up your database daily:

- View backups: Settings → Database → Backups
- Manual backup: SQL Editor → Export schema and data
- Point-in-time recovery: Available in Pro plan

---

## Connection Pooling

For production, use the pooler URL:

- **Port 6543**: Transaction mode (default)
- **Port 5432**: Session mode (for Prisma)

Your connection string should use port **6543** for best performance.

---

Need help? Check the [Supabase Docs](https://supabase.com/docs) or ask me! 🚀
