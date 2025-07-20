# 🚀 Step-by-Step: Add Real Email Sending with Resend

## Step 1: Get Resend API Key (FREE)

### 1.1 Sign up for Resend
1. **Go to:** https://resend.com
2. **Click:** "Get Started" or "Sign Up"
3. **Create account** with your email
4. **Verify** your email address

### 1.2 Get API Key
1. **Go to:** Resend Dashboard → API Keys
2. **Click:** "Create API Key"
3. **Name:** "Homeplate Notifications"
4. **Copy** the API key (starts with `re_`)

## Step 2: Add API Key to Supabase

### 2.1 Go to Supabase Functions Settings
1. **Open:** https://app.supabase.com/project/fxeogbzwstepyyjgvkrq/settings/functions
2. **Scroll to:** "Environment Variables" section

### 2.2 Add Environment Variable
1. **Click:** "Add new variable"
2. **Name:** `RESEND_API_KEY`
3. **Value:** Paste your Resend API key
4. **Click:** "Save"

## Step 3: Update Edge Function

### 3.1 Copy New Function Code
1. **Open:** The file `index-with-resend.ts` I just created
2. **Select All:** Ctrl+A
3. **Copy:** Ctrl+C

### 3.2 Update in Supabase Dashboard
1. **Go to:** https://app.supabase.com/project/fxeogbzwstepyyjgvkrq/functions
2. **Click:** `expiry-notifications` function
3. **Select all existing code** and delete it
4. **Paste:** the new code (Ctrl+V)
5. **Click:** "Deploy" button
6. **Wait:** for "Function deployed successfully"

## Step 4: Test Real Email Sending

### 4.1 Test the Function
1. **Go to your app's notification settings**
2. **Click:** "Send Test Email"
3. **Check:** Browser console for success messages

### 4.2 Check Your Email
1. **Open:** your email inbox
2. **Look for:** email from `notifications@resend.dev`
3. **Subject:** "🚨 X ingredient(s) expiring soon!"

### 4.3 Verify in Logs
1. **Supabase Dashboard:** Functions → expiry-notifications → Logs
2. **Look for:** "✅ Email sent to [your-email] - Email ID: xxx"

## What the Updated Function Does

### With RESEND_API_KEY Set:
- ✅ **Sends real emails** using Resend API
- ✅ **Beautiful HTML emails** with ingredient lists
- ✅ **Professional sender** (notifications@resend.dev)
- ✅ **Tracks email IDs** for delivery confirmation

### Without RESEND_API_KEY:
- ✅ **Simulation mode** - logs what would be sent
- ✅ **Same testing** as before
- ✅ **No errors** - graceful fallback

## Advanced: Use Your Own Domain (Optional)

### If you have a domain name:
1. **Add domain** to Resend dashboard
2. **Verify DNS** records
3. **Change `from` field** in function:
   ```typescript
   from: 'notifications@yourdomain.com'
   ```

### Without domain:
- **Use:** `notifications@resend.dev` (works immediately)
- **Free tier:** 100 emails/day, 3,000/month

## Email Template Features

The updated function sends **HTML emails** with:
- 🚨 **Eye-catching subject** with emoji
- 📋 **Bullet list** of expiring ingredients
- 📅 **Expiry dates** clearly shown
- 💎 **Professional formatting**
- 📱 **Mobile-friendly** design

## Testing Scenarios

### Test 1: No Expiring Ingredients
- **Expected:** "No expiring ingredients found"
- **Email:** None sent

### Test 2: With Expiring Ingredients
- **Expected:** Real email sent to your address
- **Content:** List of ingredients expiring in 1-3 days

### Test 3: Check Database Logs
- **Go to:** Supabase → Table Editor → notification_log
- **See:** Records of email attempts with timestamps

## Troubleshooting

### Email Not Received?
1. **Check spam folder**
2. **Verify API key** in Supabase environment variables
3. **Check function logs** for error messages
4. **Test with different email** address

### Function Errors?
1. **Check browser console** for detailed errors
2. **View function logs** in Supabase dashboard
3. **Verify environment variable** name is exactly `RESEND_API_KEY`

## Success Indicators

✅ **Browser console shows:** "✅ Email sent to [email] - Email ID: xxx"
✅ **Email received** in your inbox
✅ **Function logs show** successful API calls
✅ **Database logs** record email attempts

## Next Steps After Setup

1. **Test immediately** with the "Send Test Email" button
2. **Add test ingredients** with expiry dates 1-3 days away
3. **Schedule automatic emails** (daily at 9 AM via Supabase cron)
4. **Customize email template** if desired

**You're ready to send real emails!** 🎉
