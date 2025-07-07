# Admin Role Setup Instructions

## Setting Up the First Admin User

Since role-based access control is now implemented, you'll need to manually set the first admin user in your Supabase database.

### Option 1: Using Supabase Dashboard SQL Editor

1. Go to your Supabase Dashboard
2. Navigate to the SQL Editor
3. Run the following SQL command (replace with your actual user email):

```sql
-- Update user role to admin (replace 'your-email@example.com' with your actual email)
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'), 
  '{role}', 
  '"admin"'
)
WHERE email = 'your-email@example.com';

-- Also update the user_profiles table
UPDATE user_profiles 
SET role = 'admin' 
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'your-email@example.com'
);
```

### Option 2: Using SQL (if you have direct database access)

```sql
-- First, find your user ID
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Then update the user_profiles table with your user ID
UPDATE user_profiles 
SET role = 'admin' 
WHERE user_id = 'your-user-id-here';
```

### Option 3: Using the Supabase CLI

If you have the Supabase CLI installed:

```bash
supabase sql --db-url "your-database-url" --file admin-setup.sql
```

Where `admin-setup.sql` contains:
```sql
UPDATE user_profiles 
SET role = 'admin' 
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'your-email@example.com'
);
```

## How the Admin System Works

### Role-Based Access Control

1. **User Profiles**: Each user has a profile with a `role` field (`'user'` or `'admin'`)
2. **Default Role**: New users are assigned the `'user'` role by default
3. **Admin Navigation**: The Admin link in the navigation only appears for users with `role = 'admin'`
4. **Admin Page Protection**: The admin page checks the user's role and denies access to non-admin users

### Admin Features

Once you're logged in as an admin, you can:

1. **View Admin Dashboard**: Overview of system statistics
2. **Manage Users**: 
   - View all registered users
   - Search users by email
   - Change user roles from 'user' to 'admin' or vice versa
   - View user registration dates

### Admin Functions

- **User Management**: Promote users to admin or demote admins to regular users
- **Role Enforcement**: Only admins can change user roles
- **Secure Access**: All admin functions require admin role verification

## Testing the Admin System

1. **Set up the first admin user** using one of the methods above
2. **Login with your admin account**
3. **Verify the Admin link appears** in the navigation
4. **Access the Admin page** and test user management
5. **Test role changes** by promoting another user to admin

## Security Notes

- Only users with `role = 'admin'` can access admin features
- Role changes are verified server-side in the database
- The system prevents unauthorized role escalation
- Admin status is checked on every admin function call

## Troubleshooting

If you can't see the Admin link:
1. Check that your user profile has `role = 'admin'` in the database
2. Try logging out and logging back in
3. Check the browser console for any errors
4. Verify the database schema includes the `user_role` enum and `role` field

If you get "Access Denied" on the admin page:
1. Verify your user profile role in the database
2. Check that the user profile is properly loaded
3. Ensure the database query is returning the correct role
