-- Quick test script to verify notification preferences table
-- Run this in Supabase SQL Editor to check if everything works

-- 1. First, let's see the table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'notification_preferences'
ORDER BY ordinal_position;

-- 2. Check if any notification preferences exist
SELECT COUNT(*) as total_preferences FROM notification_preferences;

-- 3. Test inserting a sample preference (replace 'test-user-id' with a real user ID from auth.users)
-- First, let's see what users exist:
SELECT id, email FROM auth.users LIMIT 5;

-- 4. Test the RLS policies by checking what the current user can see
SELECT 
  np.*,
  u.email as user_email
FROM notification_preferences np
LEFT JOIN auth.users u ON u.id = np.user_id;

-- 5. Test manual insert (replace with actual user ID)
/*
INSERT INTO notification_preferences (
  user_id, 
  email_notifications, 
  days_before_expiry, 
  notification_time
) VALUES (
  'your-user-id-here',
  true,
  3,
  '09:00:00'
) ON CONFLICT (user_id) DO UPDATE SET
  email_notifications = EXCLUDED.email_notifications,
  days_before_expiry = EXCLUDED.days_before_expiry,
  notification_time = EXCLUDED.notification_time;
*/
