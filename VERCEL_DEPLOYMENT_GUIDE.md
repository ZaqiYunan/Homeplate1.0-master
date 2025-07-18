# 🚀 Deploy Homeplate to Vercel - Complete Guide

## Prerequisites Checklist

Before deploying, ensure you have:
- ✅ **GitHub account** with your code pushed to a repository
- ✅ **Vercel account** (free tier available)
- ✅ **Supabase project** already set up (you have this: fxeogbzwstepyyjgvkrq)
- ✅ **Environment variables** ready

## Step 1: Prepare Your Repository

### 1.1 Push to GitHub (if not already done)
```bash
# Initialize git (if not done)
git init
git add .
git commit -m "Initial commit - Homeplate app"

# Add your GitHub repository
git remote add origin https://github.com/yourusername/homeplate-app.git
git push -u origin main
```

### 1.2 Create Vercel Configuration
Create a `vercel.json` file in your project root:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "regions": ["sin1"],
  "functions": {
    "src/app/api/**": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization"
        }
      ]
    }
  ]
}
```

## Step 2: Deploy to Vercel

### 2.1 Import Project to Vercel
1. **Go to:** https://vercel.com
2. **Click:** "New Project"
3. **Connect GitHub:** Import your repository
4. **Select:** Your Homeplate repository
5. **Framework:** Next.js (auto-detected)

### 2.2 Configure Build Settings
- **Framework Preset:** Next.js
- **Root Directory:** `./` (keep default)
- **Build Command:** `npm run build` (keep default)
- **Output Directory:** `.next` (keep default)
- **Install Command:** `npm install` (keep default)

## Step 3: Environment Variables Setup

### 3.1 Add Environment Variables in Vercel
In Vercel dashboard → Project Settings → Environment Variables:

**Required Variables:**
```bash
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google OAuth (for authentication)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret

# AI Configuration (for recipe generation)
GOOGLE_API_KEY=your_google_ai_api_key
GEMINI_API_KEY=your_gemini_api_key
```

**Optional Variables (for enhanced features):**
```bash
# Email Notifications (if you set up Resend)
RESEND_API_KEY=your-resend-api-key-here

# Analytics (optional)
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your-analytics-id

# Firebase (if using Firebase features)
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=homeplate-r14jn.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=homeplate-r14jn
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=homeplate-r14jn.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=821509879437
NEXT_PUBLIC_FIREBASE_APP_ID=1:821509879437:web:c8ff8a35b84d53ca5e54c4
```

### 3.2 Environment Setup Tips
- **Environments:** Add to Production, Preview, and Development
- **Security:** Never expose service role keys in NEXT_PUBLIC_ variables
- **Testing:** Start with Production environment first

## Step 4: Configure Domain & URL Settings

### 4.1 Update Supabase URLs
1. **Go to:** https://app.supabase.com/project/fxeogbzwstepyyjgvkrq/auth/settings
2. **Add your Vercel domains to:**
   - **Site URL:** `https://your-app-name.vercel.app`
   - **Redirect URLs:** `https://your-app-name.vercel.app/auth/callback`

### 4.2 Custom Domain (Optional)
If you have a custom domain:
1. **Vercel Dashboard:** Domains → Add Domain
2. **Update Supabase:** Use your custom domain in auth settings

## Step 5: Deploy & Test

### 5.1 First Deployment
1. **Click:** "Deploy" in Vercel
2. **Wait:** For build to complete (usually 2-5 minutes)
3. **Success:** You'll get a `.vercel.app` URL

### 5.2 Test Key Features
After deployment, test:
- ✅ **Homepage loads** without errors
- ✅ **Authentication works** (login/signup)
- ✅ **Database connection** (can view/add ingredients)
- ✅ **API endpoints** work (test notification settings)
- ✅ **Email notifications** (if configured)

## Step 6: Production Optimizations

### 6.1 Performance Settings
```json
// Add to next.config.ts
const nextConfig = {
  // Optimize images
  images: {
    domains: ['your-domain.com'],
    formats: ['image/webp'],
  },
  
  // Enable compression
  compress: true,
  
  // Optimize builds
  swcMinify: true,
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};
```

### 6.2 Add Analytics (Optional)
```bash
npm install @vercel/analytics
```

### 6.3 Error Monitoring
Consider adding Sentry or Vercel monitoring for production error tracking.

## Step 7: Troubleshooting Common Issues

### 7.1 Build Errors
**Error:** "Module not found"
**Solution:** Check package.json dependencies, run `npm install` locally

**Error:** "Environment variable not found"
**Solution:** Add all required variables in Vercel dashboard

### 7.2 Runtime Errors
**Error:** "Supabase connection failed"
**Solution:** Verify NEXT_PUBLIC_SUPABASE_URL and anon key

**Error:** "Authentication redirect fails"
**Solution:** Add Vercel domain to Supabase auth settings

### 7.3 Function Timeouts
**Error:** "Function exceeded timeout"
**Solution:** Increase timeout in vercel.json or optimize API calls

## Step 8: Continuous Deployment

### 8.1 Automatic Deployments
- **Main branch:** Auto-deploys to production
- **Feature branches:** Create preview deployments
- **Pull requests:** Generate preview URLs for testing

### 8.2 Deployment Hooks
Set up webhooks for:
- **Database changes:** Redeploy when schema updates
- **Content updates:** Trigger builds from CMS

## Success Checklist

After deployment, you should have:
- ✅ **Live app** at `https://your-app.vercel.app`
- ✅ **SSL certificate** (automatic)
- ✅ **Fast global CDN** delivery
- ✅ **Automatic scaling** 
- ✅ **Preview deployments** for testing
- ✅ **Analytics dashboard** in Vercel
- ✅ **Error monitoring** and logs

## Next Steps

1. **Test thoroughly** on mobile and desktop
2. **Set up monitoring** for performance
3. **Configure custom domain** if desired
4. **Add error tracking** for production
5. **Set up backup strategies** for data

## Quick Commands

```bash
# Local development
npm run dev

# Build for production (test locally)
npm run build
npm run start

# Deploy manually (if needed)
vercel --prod

# Check logs
vercel logs your-project-name
```

**🎉 Your Homeplate app is now live on Vercel!** 

The app will be accessible globally with automatic HTTPS, CDN distribution, and serverless scaling. Perfect for a food management application! 🚀
