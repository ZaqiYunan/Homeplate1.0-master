# Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Sign up or log in with your account
3. Click "New Project"
4. Choose your organization
5. Enter a project name (e.g., "homeplate")
6. Create a database password (save this securely)
7. Select a region closest to you
8. Click "Create new project"

## 2. Get Your Environment Variables

Once your project is created:

1. Go to your project dashboard
2. Click on "Settings" in the sidebar
3. Click on "API" in the settings menu
4. Copy the following values:
   - **Project URL** (this is your `NEXT_PUBLIC_SUPABASE_URL`)
   - **anon/public key** (this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

## 3. Update Your .env.local File

Replace the placeholder values in `.env.local` with your actual values:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

## 4. Set Up Database Schema

Your app expects the following tables in Supabase:

### user_profiles table
```sql
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user',
    dietary_restrictions TEXT[],
    allergies TEXT[],
    preferred_cuisine TEXT[],
    cooking_skill_level TEXT,
    nutritional_goals JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);
```

### ingredients table
```sql
CREATE TABLE ingredients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT,
    quantity DECIMAL,
    unit TEXT,
    expiry_date DATE,
    nutritional_info JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### recipes table
```sql
CREATE TABLE recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    ingredients TEXT[] NOT NULL,
    instructions TEXT[] NOT NULL,
    prep_time INTEGER,
    cook_time INTEGER,
    servings INTEGER,
    difficulty TEXT,
    cuisine_type TEXT,
    dietary_tags TEXT[],
    nutritional_info JSONB,
    rating DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 5. Set Up Authentication

1. In your Supabase dashboard, go to "Authentication" → "Settings"
2. Configure your site URL: `http://localhost:3001` (for development)
3. Add redirect URLs: `http://localhost:3001/auth/callback`

### For Google OAuth (optional):
1. Go to "Authentication" → "Providers"
2. Enable "Google"
3. Add your Google OAuth credentials
4. Add the Google Client ID to your `.env.local`:
   ```
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
   ```

## 6. Run the Application

After setting up everything:

1. Make sure your `.env.local` file has the correct values
2. Run `npm run dev`
3. Visit `http://localhost:3001`

## Database Setup Commands

You can run these SQL commands in the Supabase SQL editor:

1. Go to your Supabase dashboard
2. Click on "SQL Editor"
3. Create a new query
4. Copy and paste the table creation commands above
5. Run the query

## Row Level Security (RLS)

For security, enable RLS on your tables:

```sql
-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own ingredients" ON ingredients FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own ingredients" ON ingredients FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own recipes" ON recipes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own recipes" ON recipes FOR ALL USING (auth.uid() = user_id);
```
