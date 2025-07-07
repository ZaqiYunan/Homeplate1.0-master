-- RLS and policies for Homeplate application
-- Run this AFTER the core schema

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutritional_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE stored_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE preferred_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_logs ENABLE ROW LEVEL SECURITY;

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
