-- Database schema for Homeplate application
-- Run this in your Supabase SQL editor

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

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create updated_at triggers
CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON user_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nutritional_goals_updated_at 
  BEFORE UPDATE ON nutritional_goals 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stored_ingredients_updated_at 
  BEFORE UPDATE ON stored_ingredients 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutritional_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE stored_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE preferred_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- User profiles policies
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile" ON user_profiles
  FOR DELETE USING (auth.uid() = user_id);

-- Nutritional goals policies
CREATE POLICY "Users can view their own goals" ON nutritional_goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goals" ON nutritional_goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals" ON nutritional_goals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals" ON nutritional_goals
  FOR DELETE USING (auth.uid() = user_id);

-- Stored ingredients policies
CREATE POLICY "Users can view their own ingredients" ON stored_ingredients
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ingredients" ON stored_ingredients
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ingredients" ON stored_ingredients
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ingredients" ON stored_ingredients
  FOR DELETE USING (auth.uid() = user_id);

-- Preferred ingredients policies
CREATE POLICY "Users can view their own preferred ingredients" ON preferred_ingredients
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferred ingredients" ON preferred_ingredients
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferred ingredients" ON preferred_ingredients
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own preferred ingredients" ON preferred_ingredients
  FOR DELETE USING (auth.uid() = user_id);

-- Meal logs policies
CREATE POLICY "Users can view their own meal logs" ON meal_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own meal logs" ON meal_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meal logs" ON meal_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meal logs" ON meal_logs
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_nutritional_goals_user_id ON nutritional_goals(user_id);
CREATE INDEX idx_stored_ingredients_user_id ON stored_ingredients(user_id);
CREATE INDEX idx_stored_ingredients_expiry_date ON stored_ingredients(expiry_date);
CREATE INDEX idx_preferred_ingredients_user_id ON preferred_ingredients(user_id);
CREATE INDEX idx_meal_logs_user_id ON meal_logs(user_id);
CREATE INDEX idx_meal_logs_logged_at ON meal_logs(logged_at DESC);
CREATE INDEX idx_meal_logs_user_logged_at ON meal_logs(user_id, logged_at DESC);
