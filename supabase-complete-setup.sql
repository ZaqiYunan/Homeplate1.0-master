-- Complete database setup for Homeplate application
-- This file combines all necessary SQL for the admin dashboard to work properly
-- Run this in your Supabase SQL Editor

-- Step 1: Core Schema
-- Create custom types
CREATE TYPE ingredient_category AS ENUM ('vegetable', 'fruit', 'protein', 'dairy', 'grain', 'spice', 'other');
CREATE TYPE storage_location AS ENUM ('pantry', 'refrigerator', 'freezer');
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other');
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  height INTEGER NOT NULL,
  weight INTEGER NOT NULL,
  age INTEGER,
  gender gender_type,
  role user_role DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create other tables
CREATE TABLE IF NOT EXISTS public.nutritional_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  calories INTEGER NOT NULL,
  protein INTEGER NOT NULL,
  carbs INTEGER NOT NULL,
  fat INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS public.stored_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category ingredient_category NOT NULL,
  location storage_location NOT NULL,
  quantity DECIMAL NOT NULL,
  unit TEXT NOT NULL,
  purchase_date DATE NOT NULL,
  expiry_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.preferred_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ingredient_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, ingredient_name)
);

CREATE TABLE IF NOT EXISTS public.meal_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_name TEXT NOT NULL,
  ingredients TEXT[] NOT NULL,
  instructions TEXT NOT NULL,
  url TEXT,
  calories INTEGER NOT NULL,
  protein INTEGER NOT NULL,
  carbs INTEGER NOT NULL,
  fat INTEGER NOT NULL,
  logged_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Enable RLS and Create Policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutritional_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE stored_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE preferred_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all user profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update all user profiles" ON user_profiles;

-- User profiles policies
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all user profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can update all user profiles" ON user_profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Step 3: Create Admin Function
CREATE OR REPLACE FUNCTION get_users_for_admin()
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  created_at TIMESTAMPTZ,
  role user_role,
  height INTEGER,
  weight INTEGER,
  profile_created_at TIMESTAMPTZ,
  has_profile BOOLEAN
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if the calling user is an admin
  IF NOT EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_profiles.user_id = auth.uid() AND user_profiles.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  -- Return ALL authenticated users with their profile data (if exists)
  RETURN QUERY
  SELECT 
    au.id as user_id,
    au.email::TEXT as email,
    au.created_at as created_at,
    COALESCE(up.role, 'user'::user_role) as role,
    COALESCE(up.height, 0) as height,
    COALESCE(up.weight, 0) as weight,
    up.created_at as profile_created_at,
    (up.user_id IS NOT NULL) as has_profile
  FROM auth.users au
  LEFT JOIN user_profiles up ON au.id = up.user_id
  WHERE au.deleted_at IS NULL  -- Only show non-deleted users
  ORDER BY au.created_at DESC;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_users_for_admin() TO authenticated;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Database setup completed successfully! You can now use the admin dashboard.';
  RAISE NOTICE 'To make a user an admin, run: UPDATE user_profiles SET role = ''admin'' WHERE user_id = ''USER_ID_HERE'';';
END $$;
