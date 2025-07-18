#!/bin/bash
# Fix for Next.js 15 client reference manifest issue on Vercel

echo "🔧 Fixing Next.js 15 client reference manifest..."

# Create missing client reference manifest files if they don't exist
mkdir -p .next/server/app/\(app\)
touch .next/server/app/\(app\)/page_client-reference-manifest.js

# Create empty manifest content
echo "module.exports = {};" > .next/server/app/\(app\)/page_client-reference-manifest.js

echo "✅ Client reference manifest fix applied"
