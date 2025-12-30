#!/bin/bash

# Pickleball Analytics - Database Setup Script

echo "🎾 Setting up Pickleball Analytics Database"
echo "=========================================="
echo ""
echo "Your Supabase project has been created!"
echo ""
echo "📍 Project URL: https://supabase.com/dashboard/project/kmjewkudbcicrncynzgf"
echo ""
echo "To get your DATABASE_URL:"
echo "1. Go to: https://supabase.com/dashboard/project/kmjewkudbcicrncynzgf/settings/database"
echo "2. Scroll down to 'Connection String'"
echo "3. Select 'URI' format"
echo "4. Copy the connection string"
echo "5. Replace [YOUR-PASSWORD] with: pickleballProd2025!"
echo ""
echo "Your DATABASE_URL will look like:"
echo "postgresql://postgres.kmjewkudbcicrncynzgf:pickleballProd2025!@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
echo ""
echo "Once you have your DATABASE_URL:"
echo "1. Create a .env.production.local file"
echo "2. Add your DATABASE_URL"
echo "3. Run: npx prisma db push"
echo ""
echo "Press Enter when you have your DATABASE_URL..."
read DATABASE_URL

if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL is required!"
    exit 1
fi

echo ""
echo "🔧 Setting up database schema..."

# Push schema to production
DATABASE_URL="$DATABASE_URL" npx prisma db push

echo ""
echo "✅ Database setup complete!"
echo ""
echo "Next steps:"
echo "1. Add DATABASE_URL to Vercel environment variables"
echo "2. Deploy your app"
echo "3. Test the connection"
