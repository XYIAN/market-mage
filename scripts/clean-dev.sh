#!/bin/bash

echo "🧹 Cleaning development environment..."

# Remove .next directory
echo "Removing .next directory..."
rm -rf .next

# Remove node_modules (optional, uncomment if needed)
# echo "Removing node_modules..."
# rm -rf node_modules
# npm install

# Clear npm cache
echo "Clearing npm cache..."
npm cache clean --force

# Clear Next.js cache
echo "Clearing Next.js cache..."
npx next clear

echo "✅ Development environment cleaned!"
echo "🚀 Run 'npm run dev' to start fresh" 