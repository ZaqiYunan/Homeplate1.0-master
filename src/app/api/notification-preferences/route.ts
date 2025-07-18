import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const body = await request.json();
    const { user_id, email_notifications, days_before_expiry, notification_time } = body;

    // Test the upsert operation
    const { data, error } = await supabase
      .from('notification_preferences')
      .upsert({
        user_id,
        email_notifications,
        days_before_expiry,
        notification_time
      }, {
        onConflict: 'user_id'
      })
      .select();

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Notification preferences saved successfully'
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to save notification preferences',
      details: error
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');

    if (!user_id) {
      return NextResponse.json({
        success: false,
        error: 'user_id parameter required'
      }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', user_id)
      .single();

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: data || null,
      message: data ? 'Preferences found' : 'No preferences found'
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch notification preferences',
      details: error
    }, { status: 500 });
  }
}
