-- Core schema for Homeplate application
-- Run this in parts if needed

-- Create custom types
CREATE TYPE ingredient_category AS ENUM ('vegetable', 'fruit', 'protein', 'dairy', 'grain', 'spice', 'other');
CREATE TYPE storage_location AS ENUM ('pantry', 'refrigerator', 'freezer');
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other');
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- Create user_profiles table
CREATE TABLE public.user_profiles (
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

-- Create nutritional_goals table
CREATE TABLE public.nutritional_goals (
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

-- Create stored_ingredients table
CREATE TABLE public.stored_ingredients (
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

-- Create preferred_ingredients table
CREATE TABLE public.preferred_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ingredient_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, ingredient_name)
);

-- Create meal_logs table
CREATE TABLE public.meal_logs (
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
