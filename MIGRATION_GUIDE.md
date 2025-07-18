# Migration Guide: Firebase to Supabase

This guide will help you migrate your HomePlate application from Firebase to Supabase.

## Prerequisites

1. **Create a Supabase Project**
   - Go to [https://supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Set up Environment Variables**
   - Copy `.env.local.example` to `.env.local`
   - Update with your Supabase credentials:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
     ```
   - Add your Google AI (Gemini) API key:
     ```
     GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-api-key
     ```
   - Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

3. **Configure Google Authentication (Optional)**
   - Go to your Supabase project dashboard
   - Navigate to Authentication > Providers
   - Enable Google provider
   - Add your Google OAuth client ID and secret:
     - Go to [Google Cloud Console](https://console.cloud.google.com/)
     - Create a new project or select existing one
     - Enable Google+ API
     - Create OAuth 2.0 credentials
     - Add authorized redirect URIs: `https://your-project-ref.supabase.co/auth/v1/callback`
     - Copy client ID and secret to Supabase
   - The app includes Google authentication buttons in both login and signup pages

## Migration Steps

### 1. Create Database Schema

Run the SQL commands in `supabase-schema.sql` in your Supabase SQL editor:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Execute the SQL

This will create:
- `user_profiles` table
- `nutritional_goals` table
- `stored_ingredients` table
- `preferred_ingredients` table
- `meal_logs` table
- Row Level Security (RLS) policies
- Necessary indexes

### 2. Update Application Code

Replace the following imports and contexts:

**From:**
```tsx
import { useAuth } from '@/contexts/AuthContext';
import { useAppContext } from '@/contexts/AppContext';
```

**To:**
```tsx
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useAppContext } from '@/contexts/SupabaseAppContext';
```

### 3. Update Layout Files

Replace your layout files to use Supabase contexts:

**From:**
```tsx
// src/app/(app)/layout.tsx
import { AuthProvider } from '@/contexts/AuthContext';
import { AppProvider } from '@/contexts/AppContext';
```

**To:**
```tsx
// src/app/(app)/layout.tsx
import { AuthProvider } from '@/contexts/SupabaseAuthContext';
import { AppProvider } from '@/contexts/SupabaseAppContext';
```

### 4. Update Authentication Pages

Replace your auth pages:

**Login Page:**
- Use `src/app/(auth)/login/supabase-page.tsx` instead of the current page
- Or rename it to `page.tsx` after backing up the original

**Signup Page:**
- Use `src/app/(auth)/signup/supabase-page.tsx` instead of the current page
- Or rename it to `page.tsx` after backing up the original

### 5. Update Header Component

Replace the Header component:
- Use `src/components/SupabaseHeader.tsx` instead of the current Header
- Or update the import in your layout to use `SupabaseHeader`

### 6. Update Landing Page Header

The landing page now includes a proper navigation header:
- **Current**: Uses `LandingHeader` component (Firebase compatible)
- **After Migration**: Use `SupabaseLandingHeader` component
- **Features**: Login/Signup buttons, navigation menu, user dropdown when logged in

### 6. Data Migration (Optional)

If you have existing data in Firebase, you'll need to export and import it:

#### Export from Firebase:
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Export data
firebase firestore:export ./firestore-export --project your-project-id
```

#### Import to Supabase:
You'll need to write a migration script to transform Firebase data to Supabase format. The main differences:
- Firebase uses document IDs, Supabase uses UUIDs
- Firebase uses nested collections, Supabase uses relational tables
- Date formats may need conversion

### 7. Update Dependencies

Remove Firebase dependencies and keep only Supabase:

```bash
npm uninstall firebase @tanstack-query-firebase/react
npm install @supabase/supabase-js
```

### 8. Update Environment Variables

Remove Firebase environment variables and keep only Supabase ones.

## Key Differences

### AI/Gemini Integration
- **Status**: ✅ **FULLY COMPATIBLE** - No changes needed
- **Functionality**: All AI features continue to work:
  - Recipe recommendations (powered by Gemini 2.0 Flash)
  - Expiry date prediction
  - Nutritional information calculation
  - Personalized goal setting
- **Requirements**: You need a Google AI (Gemini) API key
- **Cost**: Free tier available with usage limits

### Authentication
- **Firebase**: Uses Firebase Auth with Google, email/password
- **Supabase**: Uses Supabase Auth with email/password and Google OAuth (when configured)

### Database Structure
- **Firebase**: Document-based with subcollections
- **Supabase**: Relational with foreign keys

### Real-time Updates
- **Firebase**: Firestore real-time listeners
- **Supabase**: PostgreSQL real-time subscriptions

### Security
- **Firebase**: Firestore security rules
- **Supabase**: Row Level Security (RLS) policies

## Testing

1. **Create a test user** in Supabase
2. **Test all functionality**:
   - User registration and login
   - Adding/removing stored ingredients
   - Logging meals
   - Updating profile and goals
   - Preferred ingredients management
   - **AI Features**:
     - Recipe recommendations (both "Use My Storage" and "Find a Recipe" modes)
     - Automatic expiry date prediction when adding ingredients
     - Nutritional information calculation for recipes
     - Personalized goal generation based on profile

## Rollback Plan

If you need to rollback:
1. Keep the original Firebase files
2. Update imports back to Firebase contexts
3. Update environment variables back to Firebase
4. Reinstall Firebase dependencies

## Performance Considerations

- **Supabase benefits**: SQL queries, better performance for complex queries
- **Firebase benefits**: Real-time updates, offline support
- **Migration**: Test performance with your data volume

## Support

- **Supabase Documentation**: [https://supabase.com/docs](https://supabase.com/docs)
- **Supabase Community**: [https://github.com/supabase/supabase/discussions](https://github.com/supabase/supabase/discussions)

## Notes

- This migration maintains the same functionality while switching to Supabase
- All existing features (storage, nutrition tracking, recipes) will continue to work
- The UI/UX remains the same
- Row Level Security ensures data privacy
- UUID primary keys provide better scalability
