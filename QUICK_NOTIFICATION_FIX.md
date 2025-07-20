# 🔧 NOTIFICATION SYSTEM SETUP - Step by Step

## Current Issues Detected
1. ❌ **FunctionsHttpError**: Edge Function not deployed or failing
2. ❌ **Database Error**: notification_preferences table doesn't exist

## Quick Fix - Step by Step

### Step 1: Set Up Database Tables ⚡
**Go to Supabase Dashboard:**
1. Visit: https://app.supabase.com/project/fxeogbzwstepyyjgvkrq/sql
2. Copy and paste the entire contents of `email-notification-setup.sql`
3. Click **Run** to create the tables

### Step 2: Test Database Setup ✅
**Run this test in Supabase SQL Editor:**
```sql
-- Quick test to verify tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_name IN ('notification_preferences', 'notification_log');

-- Should return 2 rows if setup worked
```

### Step 3: Fix the Notification Preferences ⚡
After Step 1, try saving notification preferences again:
1. Go to `http://localhost:3001/dashboard`
2. Find "Notification Settings" 
3. Try saving - should work now!

### Step 4: Deploy Edge Function (Optional) 🚀
If you want email notifications to actually work:

**Option A: Manual Deployment**
1. Go to: https://app.supabase.com/project/fxeogbzwstepyyjgvkrq/functions
2. Click "Create a new function" 
3. Name: `expiry-notifications`
4. Copy code from `supabase/functions/expiry-notifications/index.ts`
5. Add environment variables in Settings → Edge Functions:
   - `SUPABASE_URL=https://fxeogbzwstepyyjgvkrq.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY=[Get from Settings → API]`

**Option B: Skip for Now**
- The notification preferences will still save without the Edge Function
- "Send Test Email" button will show helpful error message

## Immediate Priority ⚡

**RIGHT NOW: Just do Step 1**
- Copy `email-notification-setup.sql` to Supabase SQL Editor
- Run it
- Test saving notification preferences again

This will fix the main error you're seeing!

## Files You Need
- ✅ `email-notification-setup.sql` - Database setup
- ✅ `MANUAL_DEPLOYMENT_GUIDE.md` - Edge Function deployment
- ✅ Updated `NotificationSettings.tsx` - Better error messages

## Expected Result
After Step 1: ✅ Notification preferences save successfully
After Step 4: ✅ Test email button works
