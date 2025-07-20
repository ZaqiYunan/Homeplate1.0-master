# Debugging Notification Preferences Error

## Issue
`Error saving notification preferences: {}` in NotificationSettings.tsx

## Root Cause
The error was caused by a mismatch between the database column names and the component code:

### Database Schema (from email-notification-setup.sql):
- `email_notifications` 
- `days_before_expiry`
- `notification_time`

### Component was using:
- `email_notifications_enabled` ❌
- `expiry_reminder_days` ❌
- `notification_time` ✅

## Fix Applied
Updated `src/components/NotificationSettings.tsx` to use correct column names:

```typescript
// In savePreferences function:
.upsert({
  user_id: user.id,
  email_notifications: preferences.email_notifications_enabled,  // Fixed
  days_before_expiry: preferences.expiry_reminder_days,          // Fixed
  notification_time: preferences.notification_time
}, {
  onConflict: 'user_id'  // Added for proper upsert
})

// In fetchPreferences function:
setPreferences({
  email_notifications_enabled: data.email_notifications,  // Fixed
  expiry_reminder_days: data.days_before_expiry,         // Fixed
  notification_time: data.notification_time
});
```

## Testing Steps

### 1. Verify Database Setup
Run in Supabase SQL Editor:
```sql
-- Check table exists with correct columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'notification_preferences';
```

### 2. Test API Endpoints
```bash
# Test database structure
curl http://localhost:3001/api/test-database

# Test notification preferences (replace USER_ID)
curl http://localhost:3001/api/notification-preferences?user_id=USER_ID
```

### 3. Test in Browser
1. Go to `http://localhost:3001/admin` or wherever NotificationSettings is used
2. Try saving notification preferences
3. Check browser console for any remaining errors

### 4. Manual Database Test
Run `test-notification-preferences.sql` in Supabase SQL Editor

## Next Steps
1. ✅ Database tables exist (confirmed by API test)
2. ✅ Column name mismatch fixed
3. 🔄 Test the UI component
4. 🔄 Set up the Edge Function deployment

## Additional Notes
- The `onConflict: 'user_id'` parameter ensures proper upsert behavior
- RLS policies are working (confirmed by database test)
- All required tables exist and are accessible
