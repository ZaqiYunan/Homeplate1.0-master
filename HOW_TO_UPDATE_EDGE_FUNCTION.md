# 🔧 How to Update Edge Function

## Method 1: Supabase Dashboard (RECOMMENDED - Easiest)

### Step 1: Go to Functions Page
1. **Open:** https://app.supabase.com/project/fxeogbzwstepyyjgvkrq/functions
2. **Find:** `expiry-notifications` function in the list
3. **Click:** on the function name to open it

### Step 2: Edit the Function
1. **Click:** "Edit Function" or the code editor area
2. **Select All:** Ctrl+A (or Cmd+A on Mac) to select all existing code
3. **Delete:** All the old code
4. **Copy & Paste:** The entire content from your local file:
   - File: `supabase/functions/expiry-notifications/index.ts`
   - Copy everything from line 1 to the end

### Step 3: Deploy
1. **Click:** "Deploy" button
2. **Wait:** For deployment to complete (usually 10-30 seconds)
3. **Success:** You'll see "Function deployed successfully"

## Method 2: Supabase CLI (If you have it installed)

### Step 1: Navigate to Project
```bash
cd "D:\Towgas\Semester 4\EXPO\Homeplate1.0-master-main"
```

### Step 2: Deploy Function
```bash
npx supabase functions deploy expiry-notifications
```

### Step 3: Verify
```bash
npx supabase functions list
```

## Method 3: Manual Copy-Paste (Quick)

### Step 1: Copy Current Function Code
1. **Open:** `supabase/functions/expiry-notifications/index.ts` in VS Code
2. **Select All:** Ctrl+A
3. **Copy:** Ctrl+C

### Step 2: Paste in Supabase Dashboard
1. **Go to:** https://app.supabase.com/project/fxeogbzwstepyyjgvkrq/functions
2. **Click:** `expiry-notifications` function
3. **Clear:** existing code in the editor
4. **Paste:** Ctrl+V your copied code
5. **Click:** "Deploy"

## Verification Steps

### After updating, test the function:

1. **Go to your app's notification settings**
2. **Click:** "Send Test Email" button
3. **Check browser console** for updated behavior
4. **Expected:** New logging messages and functionality

### Check Function Logs:
1. **In Supabase Dashboard:** Functions → expiry-notifications → Logs tab
2. **Look for:** Recent execution logs
3. **Verify:** Function is running with new code

## What Changes After Update

**Before Update (Current):**
- Function returns "debug mode" message
- Logs what WOULD be sent

**After Update (With Email Service):**
- Function actually sends emails (if you add email service)
- Logs real email attempts
- Records successes/failures in database

## Next Steps After Function Update

1. **Test immediately** with "Send Test Email"
2. **Add email service** (Resend API key) if you want real emails
3. **Check notification logs** in database to see recorded attempts

## Troubleshooting

**If deployment fails:**
- Check for syntax errors in your code
- Ensure all imports are correct
- Look at the error message in Supabase dashboard

**If function doesn't work after update:**
- Check function logs in Supabase dashboard
- Verify environment variables are set
- Test with browser console open to see errors

## Quick Start: Use Method 1 (Dashboard)

**The easiest way is Method 1 - just copy and paste in the Supabase dashboard!**
