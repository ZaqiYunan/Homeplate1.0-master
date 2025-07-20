# Manual Edge Function Deployment Guide

Since we're having CLI installation issues, here's how to deploy the Edge Function manually through the Supabase dashboard:

## Step 1: Access Supabase Dashboard
1. Go to https://app.supabase.com/project/fxeogbzwstepyyjgvkrq
2. Navigate to **Edge Functions** in the left sidebar
3. Click **Create a new function**

## Step 2: Create the Function
1. **Function name**: `expiry-notifications`
2. **Template**: Choose "HTTP Request"
3. Copy the code from `supabase/functions/expiry-notifications/index.ts`

## Step 3: Set Environment Variables
Go to **Settings** → **Edge Functions** → **Environment variables** and add:

```
SUPABASE_URL=https://fxeogbzwstepyyjgvkrq.supabase.co
SUPABASE_SERVICE_ROLE_KEY=[Get this from Settings → API → service_role key]
```

## Step 4: Deploy the Function
1. Click **Deploy function**
2. Wait for deployment to complete
3. Test the function using the **Invoke** button

## Step 5: Set up Scheduling (Optional)
Since we can't use CLI for cron jobs, we'll use these alternatives:

### Option A: GitHub Actions (Recommended)
Create `.github/workflows/email-notifications.yml`:

```yaml
name: Daily Email Notifications
on:
  schedule:
    - cron: '0 9 * * *'  # Daily at 9 AM UTC
  workflow_dispatch:  # Allow manual trigger

jobs:
  send-notifications:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Email Notifications
        run: |
          curl -X POST \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}" \
            -H "Content-Type: application/json" \
            https://fxeogbzwstepyyjgvkrq.supabase.co/functions/v1/expiry-notifications
```

### Option B: External Cron Service
Use services like:
- **cron-job.org** (free)
- **EasyCron** 
- **UptimeRobot** (monitoring + cron)

URL to call: `https://fxeogbzwstepyyjgvkrq.supabase.co/functions/v1/expiry-notifications`

## Step 6: Test the Complete System
1. Run the database setup: `email-notification-setup.sql`
2. Add test data: `setup-test-data.sql`
3. Test the browser script: `browser-test-email-notifications.js`
4. Manually invoke the Edge Function
5. Check the `notification_log` table for results

## Troubleshooting
- If function fails, check the **Logs** tab in Edge Functions
- Verify environment variables are set correctly
- Ensure database tables exist with proper RLS policies
- Test with the manual trigger component in your admin dashboard
