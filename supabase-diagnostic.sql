-- Diagnostic script to check admin dashboard setup
-- Run this in your Supabase SQL Editor to diagnose issues

-- Check 1: Do the required tables exist?
SELECT 'Table Check' as check_type, 
       table_name, 
       'EXISTS' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('user_profiles', 'nutritional_goals', 'stored_ingredients', 'preferred_ingredients', 'meal_logs')
ORDER BY table_name;

-- Check 2: Does the admin function exist?
SELECT 'Function Check' as check_type,
       routine_name as function_name,
       'EXISTS' as status
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name = 'get_users_for_admin';

-- Check 3: Are there any user profiles?
SELECT 'Data Check' as check_type,
       'user_profiles' as table_name,
       COUNT(*) as row_count
FROM user_profiles;

-- Check 4: Are there any admin users?
SELECT 'Admin Check' as check_type,
       'admin_users' as description,
       COUNT(*) as admin_count
FROM user_profiles 
WHERE role = 'admin';

-- Check 5: Show current user ID (if authenticated)
SELECT 'Current User' as check_type,
       'auth_uid' as description,
       auth.uid() as current_user_id;

-- Check 6: Show all user profiles (for debugging)
SELECT 'User Profiles' as check_type,
       user_id,
       role,
       created_at
FROM user_profiles
ORDER BY created_at DESC
LIMIT 10;

-- Check 7: Test the admin function (will fail if you're not admin)
-- Uncomment the line below to test the function:
-- SELECT * FROM get_users_for_admin() LIMIT 5;

-- Instructions:
-- 1. If tables don't exist: Run supabase-complete-setup.sql
-- 2. If function doesn't exist: Run supabase-admin-functions.sql
-- 3. If no admin users exist: Run this to make yourself admin:
--    UPDATE user_profiles SET role = 'admin' WHERE user_id = 'YOUR_USER_ID_HERE';
-- 4. If you don't have a user profile: Sign up in your app first
