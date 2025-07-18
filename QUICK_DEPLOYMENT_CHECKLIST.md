# 🚀 Quick Vercel Deployment Checklist

## Before You Start (5 minutes)

- [ ] **Push code to GitHub** (or GitLab/Bitbucket)
- [ ] **Have Supabase credentials** ready
- [ ] **Vercel account** created (free tier is fine)

## Deployment Steps (10 minutes)

### 1. Import to Vercel
- [ ] Go to https://vercel.com → New Project
- [ ] Connect GitHub account
- [ ] Select your Homeplate repository
- [ ] Framework: Next.js (auto-detected)
- [ ] Click "Deploy"

### 2. Add Environment Variables
**In Vercel Dashboard → Settings → Environment Variables:**

```bash
# Copy these EXACT values:
NEXT_PUBLIC_SUPABASE_URL=https://fxeogbzwstepyyjgvkrq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4ZW9nYnp3c3RlcHl5amd2a3JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3NTg4NjEsImV4cCI6MjA2NzMzNDg2MX0.PoHq60wxyfqTw8_WsFhFZBqnq6z_34tET6q8JllMLWE
NEXT_PUBLIC_GOOGLE_CLIENT_ID=978728010500-np6rjedukgboso3u3a48rkd5evsa563k.apps.googleusercontent.com
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=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
GOOGLE_API_KEY=AIzaSyBsbgI0yEK7NoMrx1-uQSzGe2zp_AmJo4g
GEMINI_API_KEY=AIzaSyBsbgI0yEK7NoMrx1-uQSzGe2zp_AmJo4g
```

### 3. Redeploy
- [ ] After adding env vars → Redeploy from Vercel dashboard

### 4. Update Supabase Settings
- [ ] Go to: https://app.supabase.com/project/fxeogbzwstepyyjgvkrq/auth/settings
- [ ] Add your Vercel URL to:
  - **Site URL:** `https://your-app-name.vercel.app`
  - **Redirect URLs:** `https://your-app-name.vercel.app/auth/callback`

## Testing Checklist (5 minutes)

- [ ] **Homepage loads** without errors
- [ ] **Login/signup works** (test Google OAuth)
- [ ] **Dashboard loads** with user data
- [ ] **Add ingredient** functionality works
- [ ] **Notification settings** can be saved
- [ ] **Admin panel** accessible (if you have admin role)

## Common Issues & Quick Fixes

### Build Failed?
- **Check:** Package.json dependencies
- **Run locally:** `npm run build` to test

### Auth Not Working?
- **Check:** Environment variables are exact matches
- **Verify:** Supabase redirect URLs include your Vercel domain

### Database Connection Failed?
- **Check:** NEXT_PUBLIC_SUPABASE_URL is correct
- **Verify:** Anon key is properly set

### Edge Functions Not Working?
- **Note:** Edge Functions stay in Supabase, not deployed to Vercel
- **Check:** Functions are deployed in Supabase dashboard

## Success! 🎉

Your app should be live at: `https://your-app-name.vercel.app`

**Features that work out of the box:**
- ✅ User authentication (Google OAuth)
- ✅ Ingredient management
- ✅ Recipe suggestions
- ✅ Notification preferences
- ✅ Admin dashboard
- ✅ Responsive design
- ✅ Global CDN delivery
- ✅ Automatic HTTPS

**Next steps:**
1. Test all features thoroughly
2. Share the URL with users
3. Set up custom domain (optional)
4. Configure email notifications with Resend (optional)

**Estimated total time: 20 minutes** ⏱️
