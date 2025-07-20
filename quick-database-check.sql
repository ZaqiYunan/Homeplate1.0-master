-- Quick test to check if our email notification tables exist
-- You can run this in the Supabase SQL editor

-- Check if notification_preferences table exists
SELECT 
  table_name, 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_name = 'notification_preferences'
ORDER BY ordinal_position;

-- Check if notification_log table exists  
SELECT 
  table_name, 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_name = 'notification_log'
ORDER BY ordinal_position;

-- Check if the helper function exists
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines 
WHERE routine_name = 'get_users_with_expiring_ingredients';

-- Check if stored_ingredients table has the columns we need
SELECT 
  column_name, 
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'stored_ingredients' 
  AND column_name IN ('expiry_date', 'user_id', 'name', 'quantity', 'unit')
ORDER BY ordinal_position;
