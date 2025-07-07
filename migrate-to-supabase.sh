#!/bin/bash

# HomePlate Migration Script: Firebase to Supabase
# This script helps automate the migration process

echo "🚀 HomePlate Migration: Firebase to Supabase"
echo "=============================================="

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found. Creating from template..."
    cp .env.local.example .env.local
    echo "✅ Created .env.local from template"
    echo "❗ Please update .env.local with your Supabase credentials before continuing"
    echo "   - NEXT_PUBLIC_SUPABASE_URL"
    echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo ""
    read -p "Press Enter when you have updated .env.local..."
fi

# Check if Supabase dependencies are installed
if ! npm list @supabase/supabase-js &> /dev/null; then
    echo "📦 Installing Supabase dependencies..."
    npm install @supabase/supabase-js
    echo "✅ Supabase dependencies installed"
else
    echo "✅ Supabase dependencies already installed"
fi

# Backup existing files
echo "💾 Creating backup of existing files..."
BACKUP_DIR="migration-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Backup critical files
if [ -f "src/contexts/AuthContext.tsx" ]; then
    cp "src/contexts/AuthContext.tsx" "$BACKUP_DIR/"
    echo "✅ Backed up AuthContext.tsx"
fi

if [ -f "src/contexts/AppContext.tsx" ]; then
    cp "src/contexts/AppContext.tsx" "$BACKUP_DIR/"
    echo "✅ Backed up AppContext.tsx"
fi

if [ -f "src/components/Header.tsx" ]; then
    cp "src/components/Header.tsx" "$BACKUP_DIR/"
    echo "✅ Backed up Header.tsx"
fi

if [ -f "src/app/(app)/layout.tsx" ]; then
    cp "src/app/(app)/layout.tsx" "$BACKUP_DIR/"
    echo "✅ Backed up app layout.tsx"
fi

if [ -f "src/app/(auth)/login/page.tsx" ]; then
    cp "src/app/(auth)/login/page.tsx" "$BACKUP_DIR/"
    echo "✅ Backed up login page.tsx"
fi

if [ -f "src/app/(auth)/signup/page.tsx" ]; then
    cp "src/app/(auth)/signup/page.tsx" "$BACKUP_DIR/"
    echo "✅ Backed up signup page.tsx"
fi

echo "✅ Backup completed in $BACKUP_DIR"

# Prompt for manual steps
echo ""
echo "📋 Manual Steps Required:"
echo "========================"
echo "1. 🗄️  Run the SQL schema in your Supabase project:"
echo "   - Go to your Supabase project dashboard"
echo "   - Navigate to SQL Editor"
echo "   - Copy and paste the contents of 'supabase-schema.sql'"
echo "   - Execute the SQL"
echo ""
echo "2. 🔄 Update your application files:"
echo "   - Replace imports in your components to use Supabase contexts"
echo "   - Update layout files to use Supabase providers"
echo "   - Update authentication pages"
echo ""
echo "3. 🧪 Test the migration:"
echo "   - Create a test user"
echo "   - Test all functionality"
echo "   - Check database in Supabase dashboard"
echo ""

# Ask if user wants to continue with automated updates
echo "🤖 Automated File Updates:"
echo "=========================="
read -p "Do you want to automatically update files to use Supabase? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔄 Updating files to use Supabase..."
    
    # Update layout to use Supabase
    if [ -f "src/app/(app)/supabase-layout.tsx" ]; then
        cp "src/app/(app)/supabase-layout.tsx" "src/app/(app)/layout.tsx"
        echo "✅ Updated app layout to use Supabase"
    fi
    
    # Update login page
    if [ -f "src/app/(auth)/login/supabase-page.tsx" ]; then
        cp "src/app/(auth)/login/supabase-page.tsx" "src/app/(auth)/login/page.tsx"
        echo "✅ Updated login page to use Supabase"
    fi
    
    # Update signup page
    if [ -f "src/app/(auth)/signup/supabase-page.tsx" ]; then
        cp "src/app/(auth)/signup/supabase-page.tsx" "src/app/(auth)/signup/page.tsx"
        echo "✅ Updated signup page to use Supabase"
    fi
    
    # Update Header component
    if [ -f "src/components/SupabaseHeader.tsx" ]; then
        cp "src/components/SupabaseHeader.tsx" "src/components/Header.tsx"
        echo "✅ Updated Header component to use Supabase"
    fi
    
    echo "✅ Automated updates completed"
else
    echo "⏭️  Skipping automated updates"
fi

echo ""
echo "🎉 Migration preparation complete!"
echo "=================================="
echo ""
echo "Next steps:"
echo "1. Review the MIGRATION_GUIDE.md for detailed instructions"
echo "2. Run the SQL schema in your Supabase project"
echo "3. Update your .env.local with Supabase credentials"
echo "4. Test the application: npm run dev"
echo "5. Check database operations in Supabase dashboard"
echo ""
echo "If you encounter issues, restore from backup: $BACKUP_DIR"
echo ""
echo "Happy migrating! 🚀"
