# HomePlate Migration Script: Firebase to Supabase
# PowerShell version for Windows

Write-Host "🚀 HomePlate Migration: Firebase to Supabase" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green

# Check if .env.local exists
if (!(Test-Path ".env.local")) {
    Write-Host "⚠️  .env.local not found. Creating from template..." -ForegroundColor Yellow
    Copy-Item ".env.local.example" ".env.local"
    Write-Host "✅ Created .env.local from template" -ForegroundColor Green
    Write-Host "❗ Please update .env.local with your Supabase credentials before continuing" -ForegroundColor Red
    Write-Host "   - NEXT_PUBLIC_SUPABASE_URL" -ForegroundColor Yellow
    Write-Host "   - NEXT_PUBLIC_SUPABASE_ANON_KEY" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter when you have updated .env.local"
}

# Check if Supabase dependencies are installed
$supabaseInstalled = npm list @supabase/supabase-js 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "📦 Installing Supabase dependencies..." -ForegroundColor Blue
    npm install @supabase/supabase-js
    Write-Host "✅ Supabase dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✅ Supabase dependencies already installed" -ForegroundColor Green
}

# Backup existing files
Write-Host "💾 Creating backup of existing files..." -ForegroundColor Blue
$backupDir = "migration-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

# Backup critical files
$filesToBackup = @(
    "src/contexts/AuthContext.tsx",
    "src/contexts/AppContext.tsx",
    "src/components/Header.tsx",
    "src/app/(app)/layout.tsx",
    "src/app/(auth)/login/page.tsx",
    "src/app/(auth)/signup/page.tsx"
)

foreach ($file in $filesToBackup) {
    if (Test-Path $file) {
        $fileName = Split-Path $file -Leaf
        Copy-Item $file "$backupDir/$fileName"
        Write-Host "✅ Backed up $fileName" -ForegroundColor Green
    }
}

Write-Host "✅ Backup completed in $backupDir" -ForegroundColor Green

# Prompt for manual steps
Write-Host ""
Write-Host "📋 Manual Steps Required:" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host "1. 🗄️  Run the SQL schema in your Supabase project:" -ForegroundColor Yellow
Write-Host "   - Go to your Supabase project dashboard" -ForegroundColor White
Write-Host "   - Navigate to SQL Editor" -ForegroundColor White
Write-Host "   - Copy and paste the contents of 'supabase-schema.sql'" -ForegroundColor White
Write-Host "   - Execute the SQL" -ForegroundColor White
Write-Host ""
Write-Host "2. 🔄 Update your application files:" -ForegroundColor Yellow
Write-Host "   - Replace imports in your components to use Supabase contexts" -ForegroundColor White
Write-Host "   - Update layout files to use Supabase providers" -ForegroundColor White
Write-Host "   - Update authentication pages" -ForegroundColor White
Write-Host ""
Write-Host "3. 🧪 Test the migration:" -ForegroundColor Yellow
Write-Host "   - Create a test user" -ForegroundColor White
Write-Host "   - Test all functionality" -ForegroundColor White
Write-Host "   - Check database in Supabase dashboard" -ForegroundColor White
Write-Host ""

# Ask if user wants to continue with automated updates
Write-Host "🤖 Automated File Updates:" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
$response = Read-Host "Do you want to automatically update files to use Supabase? (y/n)"

if ($response -match '^[Yy]$') {
    Write-Host "🔄 Updating files to use Supabase..." -ForegroundColor Blue
    
    # Update layout to use Supabase
    if (Test-Path "src/app/(app)/supabase-layout.tsx") {
        Copy-Item "src/app/(app)/supabase-layout.tsx" "src/app/(app)/layout.tsx"
        Write-Host "✅ Updated app layout to use Supabase" -ForegroundColor Green
    }
    
    # Update login page
    if (Test-Path "src/app/(auth)/login/supabase-page.tsx") {
        Copy-Item "src/app/(auth)/login/supabase-page.tsx" "src/app/(auth)/login/page.tsx"
        Write-Host "✅ Updated login page to use Supabase" -ForegroundColor Green
    }
    
    # Update signup page
    if (Test-Path "src/app/(auth)/signup/supabase-page.tsx") {
        Copy-Item "src/app/(auth)/signup/supabase-page.tsx" "src/app/(auth)/signup/page.tsx"
        Write-Host "✅ Updated signup page to use Supabase" -ForegroundColor Green
    }
    
    # Update Header component
    if (Test-Path "src/components/SupabaseHeader.tsx") {
        Copy-Item "src/components/SupabaseHeader.tsx" "src/components/Header.tsx"
        Write-Host "✅ Updated Header component to use Supabase" -ForegroundColor Green
    }
    
    Write-Host "✅ Automated updates completed" -ForegroundColor Green
} else {
    Write-Host "⏭️  Skipping automated updates" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Migration preparation complete!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Review the MIGRATION_GUIDE.md for detailed instructions" -ForegroundColor White
Write-Host "2. Run the SQL schema in your Supabase project" -ForegroundColor White
Write-Host "3. Update your .env.local with Supabase credentials" -ForegroundColor White
Write-Host "4. Test the application: npm run dev" -ForegroundColor White
Write-Host "5. Check database operations in Supabase dashboard" -ForegroundColor White
Write-Host ""
Write-Host "If you encounter issues, restore from backup: $backupDir" -ForegroundColor Yellow
Write-Host ""
Write-Host "Happy migrating! 🚀" -ForegroundColor Green
