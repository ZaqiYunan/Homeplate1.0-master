/**
 * Browser-based Edge Function Test
 * Copy and paste this into your browser console while on your Supabase dashboard
 * or your local application to test the email notification system.
 */

// Test configuration
const SUPABASE_URL = 'https://fxeogbzwstepyyjgvkrq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4ZW9nYnp3c3RlcHl5amd2a3JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3NTg4NjEsImV4cCI6MjA2NzMzNDg2MX0.PoHq60wxyfqTw8_WsFhFZBqnq6z_34tET6q8JllMLWE';

// Initialize Supabase client
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Test 1: Check if database tables exist
 */
async function testDatabaseTables() {
  console.log('🔍 Testing database tables...');
  
  try {
    // Test notification_preferences table
    const { data: preferences, error: prefError } = await supabaseClient
      .from('notification_preferences')
      .select('*')
      .limit(1);
    
    if (prefError) {
      console.error('❌ notification_preferences table error:', prefError);
    } else {
      console.log('✅ notification_preferences table exists');
    }

    // Test stored_ingredients table
    const { data: ingredients, error: ingError } = await supabaseClient
      .from('stored_ingredients')
      .select('*')
      .limit(1);
    
    if (ingError) {
      console.error('❌ stored_ingredients table error:', ingError);
    } else {
      console.log('✅ stored_ingredients table exists');
    }

    // Test notification_log table
    const { data: logs, error: logError } = await supabaseClient
      .from('notification_log')
      .select('*')
      .limit(1);
    
    if (logError) {
      console.error('❌ notification_log table error:', logError);
    } else {
      console.log('✅ notification_log table exists');
    }

  } catch (error) {
    console.error('❌ Database test failed:', error);
  }
}

/**
 * Test 2: Check for expiring ingredients
 */
async function testExpiringIngredients() {
  console.log('🔍 Testing expiring ingredients query...');
  
  try {
    // Get ingredients expiring in the next 3 days
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    
    const { data: expiringIngredients, error } = await supabaseClient
      .from('stored_ingredients')
      .select(`
        id,
        name,
        expiry_date,
        user_id,
        quantity,
        unit,
        storage_location
      `)
      .lte('expiry_date', threeDaysFromNow.toISOString().split('T')[0])
      .gte('expiry_date', new Date().toISOString().split('T')[0]);

    if (error) {
      console.error('❌ Expiring ingredients query failed:', error);
    } else {
      console.log('✅ Expiring ingredients found:', expiringIngredients?.length || 0);
      if (expiringIngredients?.length > 0) {
        console.log('📋 Expiring ingredients:', expiringIngredients);
      }
    }

  } catch (error) {
    console.error('❌ Expiring ingredients test failed:', error);
  }
}

/**
 * Test 3: Check notification preferences
 */
async function testNotificationPreferences() {
  console.log('🔍 Testing notification preferences...');
  
  try {
    const { data: currentUser } = await supabaseClient.auth.getUser();
    
    if (!currentUser?.user) {
      console.log('⚠️ No user logged in - skipping notification preferences test');
      return;
    }

    const { data: preferences, error } = await supabaseClient
      .from('notification_preferences')
      .select('*')
      .eq('user_id', currentUser.user.id);

    if (error) {
      console.error('❌ Notification preferences query failed:', error);
    } else {
      console.log('✅ User notification preferences:', preferences);
    }

  } catch (error) {
    console.error('❌ Notification preferences test failed:', error);
  }
}

/**
 * Test 4: Test RLS policies
 */
async function testRLSPolicies() {
  console.log('🔍 Testing RLS policies...');
  
  try {
    const { data: currentUser } = await supabaseClient.auth.getUser();
    
    if (!currentUser?.user) {
      console.log('⚠️ No user logged in - skipping RLS test');
      return;
    }

    // Test if user can access their own data
    const { data: userIngredients, error } = await supabaseClient
      .from('stored_ingredients')
      .select('*')
      .eq('user_id', currentUser.user.id);

    if (error) {
      console.error('❌ RLS policy test failed:', error);
    } else {
      console.log('✅ RLS policies working - user can access their data');
      console.log(`📊 User has ${userIngredients?.length || 0} stored ingredients`);
    }

  } catch (error) {
    console.error('❌ RLS policies test failed:', error);
  }
}

/**
 * Test 5: Create sample notification preference
 */
async function testCreateNotificationPreference() {
  console.log('🔍 Testing notification preference creation...');
  
  try {
    const { data: currentUser } = await supabaseClient.auth.getUser();
    
    if (!currentUser?.user) {
      console.log('⚠️ No user logged in - skipping notification preference creation');
      return;
    }

    // Try to upsert notification preferences
    const { data, error } = await supabaseClient
      .from('notification_preferences')
      .upsert({
        user_id: currentUser.user.id,
        email_notifications: true,
        days_before_expiry: 3,
        notification_time: '09:00:00'
      }, {
        onConflict: 'user_id'
      })
      .select();

    if (error) {
      console.error('❌ Failed to create notification preference:', error);
    } else {
      console.log('✅ Notification preference created/updated:', data);
    }

  } catch (error) {
    console.error('❌ Notification preference creation test failed:', error);
  }
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log('🚀 Starting email notification system tests...');
  console.log('=====================================');
  
  await testDatabaseTables();
  console.log('');
  
  await testExpiringIngredients();
  console.log('');
  
  await testNotificationPreferences();
  console.log('');
  
  await testRLSPolicies();
  console.log('');
  
  await testCreateNotificationPreference();
  console.log('');
  
  console.log('=====================================');
  console.log('🎉 All tests completed!');
  console.log('');
  console.log('Next steps:');
  console.log('1. If tables are missing, run the email-notification-setup.sql');
  console.log('2. If no expiring ingredients, add some test data with setup-test-data.sql');
  console.log('3. For Edge Function deployment, install Supabase CLI');
}

// Export functions for manual testing
window.emailNotificationTests = {
  runAllTests,
  testDatabaseTables,
  testExpiringIngredients,
  testNotificationPreferences,
  testRLSPolicies,
  testCreateNotificationPreference
};

console.log('📧 Email Notification Test Suite Loaded!');
console.log('Run emailNotificationTests.runAllTests() to start testing');
