import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    // Test if notification_preferences table exists
    const { data: prefsTest, error: prefsError } = await supabase
      .from('notification_preferences')
      .select('count')
      .limit(1);

    // Test if stored_ingredients table exists  
    const { data: ingredientsTest, error: ingredientsError } = await supabase
      .from('stored_ingredients')
      .select('count')
      .limit(1);

    // Test if notification_log table exists
    const { data: logTest, error: logError } = await supabase
      .from('notification_log')
      .select('count')
      .limit(1);

    const results = {
      notification_preferences: {
        exists: !prefsError,
        error: prefsError?.message
      },
      stored_ingredients: {
        exists: !ingredientsError,
        error: ingredientsError?.message
      },
      notification_log: {
        exists: !logError,
        error: logError?.message
      }
    };

    return NextResponse.json({
      success: true,
      tables: results,
      message: 'Database structure test completed'
    });

  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to test database structure',
      details: error
    }, { status: 500 });
  }
}
