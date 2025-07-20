# 🔧 Edge Function Redeploy - Fix SQL Error

## Problem Identified ✅

**Error:** `failed to parse select parameter (*,user_profiles...le),auth.users!inner(email))`

**Cause:** An older version of the Edge Function is deployed with incorrect SQL syntax

**Solution:** Redeploy the current (fixed) version of the Edge Function

## Quick Fix Options

### Option 1: Redeploy via Supabase Dashboard (RECOMMENDED)

1. **Go to:** https://app.supabase.com/project/fxeogbzwstepyyjgvkrq/functions
2. **Click:** "New Function" or edit existing `expiry-notifications`
3. **Copy and paste** the ENTIRE content from `supabase/functions/expiry-notifications/index.ts`
4. **Save and Deploy**

### Option 2: Use Supabase CLI (If Available)

```bash
# Navigate to project root
cd "D:\Towgas\Semester 4\EXPO\Homeplate1.0-master-main"

# Deploy the function
npx supabase functions deploy expiry-notifications
```

## Current Function Content (Copy This) 📋

The current `supabase/functions/expiry-notifications/index.ts` is already fixed and clean.
It does NOT contain any SQL join syntax errors.

## Test After Deployment ✅

1. **Click "Send Test Email"** in admin panel
2. **Check browser console** - should see:
   ```
   ✅ Function working - debug mode
   📦 Found X expiring ingredients
   ```

## Why This Happened

The Edge Function was likely deployed with an earlier version that had complex SQL joins.
The current version uses simple `.select()` queries which are safe and work correctly.

## Expected Result

- ✅ "Send Test Email" button works
- ✅ No more SQL parsing errors
- ✅ Function returns debug information showing it's working
- ✅ Ready for database setup step

**Next Step:** After redeploying function → Run `email-notification-setup.sql` in database
