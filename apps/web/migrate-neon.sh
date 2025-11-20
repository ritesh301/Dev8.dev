#!/bin/bash
# Migration script for Neon database
# Run this from a network that can access Neon (not your current one that's blocked)

echo "Running Prisma migrations on Neon database..."
echo "DATABASE_URL should be set in environment or .env file"

# Deploy existing migrations
pnpm db:deploy

if [ $? -eq 0 ]; then
  echo "✅ Migrations applied successfully!"
else
  echo "❌ Migration failed. Check your network connection and DATABASE_URL"
  exit 1
fi
