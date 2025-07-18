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

**IMPORTANT**: Run the SQL files in this exact order to set up your database:

### Step 1: Core Schema
Navigate to your Supabase dashboard > SQL Editor and run the contents of `supabase-schema-core.sql`:
- Creates the basic tables and types
- Sets up the table structure

### Step 2: RLS Policies  
Run the contents of `supabase-schema-rls.sql`:
- Enables Row Level Security
- Creates policies for user data access
- **Includes admin policies to fix PGRST116 errors**

### Step 3: Admin Functions
Run the contents of `supabase-admin-functions.sql`:
- Creates secure admin functions
- Enables safe access to user data for admins
- **Required for admin dashboard functionality**

### Step 4: Complete Schema (Alternative)
If you prefer, you can run `supabase-schema.sql` which includes everything above, but then you'll need to manually add the admin functions.

## 5. Admin User Setup

To make a user an admin:

1. First, the user must sign up normally through your app
2. Go to Supabase dashboard > SQL Editor
3. Run this query to make them an admin:

```sql
UPDATE user_profiles 
SET role = 'admin' 
WHERE user_id = 'USER_ID_HERE';
```

Replace `USER_ID_HERE` with the actual user ID from the auth.users table.

## 6. Troubleshooting

### PGRST116 Error (JSON object requested, multiple or no rows returned)
This error typically occurs when:
- RLS policies are blocking admin access to user data
- The admin functions are not properly installed
- The user doesn't have admin privileges

**Solution**: Ensure you've run all SQL files in order and set up an admin user properly.

## 7. Run the Application

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
