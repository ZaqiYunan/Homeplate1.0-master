-- Debug queries to check email notification setup
-- Run these one by one in Supabase SQL Editor

-- 1. Check if you have any stored ingredients
SELECT 
  'Total ingredients' as check_type,
  COUNT(*) as count
FROM stored_ingredients;

-- 2. Check ingredients with expiry dates
SELECT 
  'Ingredients with expiry dates' as check_type,
  COUNT(*) as count
FROM stored_ingredients 
WHERE expiry_date IS NOT NULL;

-- 3. Check for expiring ingredients (next 3 days)
SELECT 
  'Expiring in next 3 days' as check_type,
  COUNT(*) as count
FROM stored_ingredients 
WHERE expiry_date IS NOT NULL
  AND expiry_date >= CURRENT_DATE
  AND expiry_date <= CURRENT_DATE + INTERVAL '3 days';

-- 4. List actual expiring ingredients
SELECT 
  si.name,
  si.expiry_date,
  si.expiry_date - CURRENT_DATE as days_until_expiry,
  u.email as user_email
FROM stored_ingredients si
JOIN auth.users u ON u.id = si.user_id
WHERE si.expiry_date IS NOT NULL
  AND si.expiry_date >= CURRENT_DATE
  AND si.expiry_date <= CURRENT_DATE + INTERVAL '3 days'
ORDER BY si.expiry_date;

-- 5. Check notification preferences
SELECT 
  'Users with notification preferences' as check_type,
  COUNT(*) as count
FROM notification_preferences;

-- 6. Check if you're an admin
SELECT 
  up.role,
  u.email,
  'Your role and email' as info
FROM user_profiles up
JOIN auth.users u ON u.id = up.user_id
WHERE up.user_id = auth.uid();

-- 7. Test the helper function
SELECT * FROM get_users_with_expiring_ingredients(3);
