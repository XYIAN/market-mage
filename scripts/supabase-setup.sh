#!/bin/bash

# Supabase CLI Setup Script for Market-Mage
# This script helps you set up and manage your Supabase database

set -e

echo "🧙 Market-Mage Supabase Setup"
echo "=============================="

# Check if project ref is provided
if [ -z "$1" ]; then
    echo "❌ Error: Please provide your Supabase project reference ID"
    echo "Usage: ./scripts/supabase-setup.sh YOUR_PROJECT_REF"
    echo ""
    echo "To find your project ref:"
    echo "1. Go to https://app.supabase.com"
    echo "2. Select your project"
    echo "3. Look at the URL: https://app.supabase.com/project/abcdefghijklmnopqrst"
    echo "4. The 'abcdefghijklmnopqrst' part is your project ref"
    exit 1
fi

PROJECT_REF=$1

echo "🔗 Linking to Supabase project: $PROJECT_REF"
supabase link --project-ref $PROJECT_REF

echo "📊 Pushing database schema..."
supabase db push

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Start your development server: npm run dev"
echo "2. Go to http://localhost:3000/login"
echo "3. Create an account and test the watchlist functionality"
echo ""
echo "Useful commands:"
echo "- View local database: supabase db reset"
echo "- Generate new migration: supabase migration new migration_name"
echo "- Apply migrations: supabase db push"
echo "- View logs: supabase logs" 