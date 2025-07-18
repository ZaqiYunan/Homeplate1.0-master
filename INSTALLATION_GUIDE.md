# 🏠 HomePlate - Setup Guide

## 📋 Prerequisites

Before you begin, make sure you have the following installed on your system:

- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)
- A **Google account** (for AI features)
- A **Supabase account** (free tier available)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/ZaqiYunan/Homeplate1.0-master.git

# Navigate to project directory
cd Homeplate1.0-master-2

# Install dependencies
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```bash
# Copy the example environment file
cp .env.example .env.local
```

Your `.env.local` should contain:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Google AI Configuration (for AI features)
GOOGLE_API_KEY=your-google-ai-api-key
GEMINI_API_KEY=your-google-ai-api-key

# Optional: Firebase (if using Firebase auth)
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
```

## 🗄️ Database Setup (Supabase)

### Step 1: Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Choose organization and enter project name
4. Set a secure database password
5. Select your preferred region
6. Click "Create new project"

### Step 2: Get Your Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values to your `.env.local`:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 3: Set Up Database Schema

**⚠️ IMPORTANT: Run these SQL files in the exact order below:**

1. **Core Schema** - Run `supabase-schema-core.sql`:
   ```sql
   -- Creates tables: user_profiles, nutritional_goals, stored_ingredients, etc.
   ```

2. **RLS Policies** - Run `supabase-schema-rls.sql`:
   ```sql
   -- Enables Row Level Security and user access policies
   ```

3. **Admin Functions** - Run `supabase-admin-functions.sql`:
   ```sql
   -- Creates admin functions for user management
   ```

To run these:
1. Go to Supabase Dashboard → **SQL Editor**
2. Create a new query
3. Copy and paste each file's content
4. Click "Run" for each file

## 🤖 AI Features Setup (Google Gemini)

### Step 1: Get Google AI API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key to your `.env.local`

### Step 2: Enable AI Features

The app includes these AI features:
- **Recipe Recommendations** - Smart recipe suggestions based on available ingredients
- **Ingredient Specification Search** - Natural language queries about ingredients
- **Expiry Date Prediction** - AI-powered expiry date estimation
- **Personalized Nutrition Goals** - Custom nutrition targets

## 🔧 Development Setup

### Install Dependencies

```bash
# Install all required packages
npm install

# Apply any necessary patches
npm run postinstall
```

### Run the Application

```bash
# Start development server
npm run dev

# Start with AI development tools (optional)
npm run genkit:dev
```

The application will be available at: `http://localhost:3000`

### Build for Production

```bash
# Create production build
npm run build

# Start production server
npm run start
```

## 🔐 Authentication Setup

The app supports multiple authentication methods:

### Supabase Auth (Recommended)
- Email/Password authentication
- Google OAuth integration
- Automatic user profile creation

### Firebase Auth (Alternative)
If you prefer Firebase:
1. Create a Firebase project
2. Enable Authentication
3. Add your Firebase config to `.env.local`

## 👥 Admin Setup

### Create Admin User

1. Register a normal user account
2. In Supabase Dashboard → **Table Editor** → **user_profiles**
3. Find your user record and change `role` from `'user'` to `'admin'`
4. Admin features will be available at `/admin`

### Admin Features
- User management
- System statistics
- Database monitoring tools

## 📁 Project Structure

```
Homeplate1.0-master-2/
├── src/
│   ├── app/                  # Next.js app router pages
│   │   ├── (app)/           # Main application pages
│   │   │   ├── dashboard/   # User dashboard
│   │   │   ├── recipes/     # Recipe search & recommendations
│   │   │   ├── ingredients/ # Ingredient explorer with AI search
│   │   │   ├── storage/     # Ingredient storage management
│   │   │   ├── nutrition/   # Nutrition tracking
│   │   │   └── admin/       # Admin dashboard
│   │   └── (auth)/          # Authentication pages
│   ├── components/          # Reusable UI components
│   ├── contexts/           # React context providers
│   ├── lib/                # Utility functions and configurations
│   ├── hooks/              # Custom React hooks
│   └── ai/                 # AI flows and configurations
│       └── flows/          # Genkit AI flows
├── supabase-*.sql         # Database schema files
└── *.md                   # Documentation files
```

## 🧪 Testing the Setup

### Test Database Connection
Visit `/config-test` to verify your Supabase connection.

### Test Authentication
Visit `/auth-test` to test the authentication flow.

### Test AI Features
1. Go to `/ingredients`
2. Click on "AI Search" tab
3. Try searching: "Tell me about spinach nutrition"

## 🚨 Common Issues & Solutions

### 1. Database Connection Issues
```
Error: Invalid Supabase URL or Key
```
**Solution:** Double-check your `.env.local` file and ensure Supabase credentials are correct.

### 2. AI Features Not Working
```
Error: Google AI API key not configured
```
**Solution:** Add your Google AI API key to `.env.local`.

### 3. Admin Dashboard Access Denied
```
Error: Access denied to admin features
```
**Solution:** Set your user role to 'admin' in the user_profiles table.

### 4. Build Errors
```
Module not found errors
```
**Solution:** 
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📱 Features Overview

### 🔍 **Recipe Search with AI**
- Smart recipe recommendations based on available ingredients
- Cuisine filtering (Western, Asian, Indonesian)
- "Use My Storage" mode for ingredient-based suggestions

### 🥬 **Ingredient Management**
- Add, edit, delete ingredients in your storage
- AI-powered expiry date prediction
- Detailed ingredient information database

### 📊 **Nutrition Tracking**
- Track daily calorie and macronutrient intake
- Personalized nutrition goals with AI
- Visual progress tracking

### 🔎 **AI Ingredient Search**
- Natural language queries about any ingredient
- Comprehensive nutritional information
- Cooking tips and storage advice

### 👨‍💼 **Admin Dashboard**
- User management system
- System analytics and monitoring
- Database administration tools

## 🆘 Getting Help

If you encounter any issues:

1. **Check the documentation files:**
   - `SUPABASE_SETUP.md` - Database setup
   - `MIGRATION_GUIDE.md` - Migration instructions
   - `ERROR_RESOLUTION_GUIDE.md` - Common error fixes

2. **Test pages available:**
   - `/config-test` - Configuration testing
   - `/auth-test` - Authentication testing
   - `/admin` - Admin tools (requires admin role)

3. **Contact the development team:**
   - GitHub: [Create an issue](https://github.com/ZaqiYunan/Homeplate1.0-master/issues)
   - Email: [Your team email]

## 🎉 You're Ready!

Once you've completed these steps, you should have:
- ✅ A working Next.js application
- ✅ Configured Supabase database
- ✅ AI features enabled
- ✅ Authentication working
- ✅ All features accessible

Visit `http://localhost:3000` and start exploring HomePlate! 🍽️

---

**Happy Cooking! 👨‍🍳👩‍🍳**
