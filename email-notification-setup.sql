    -- Email notification system for ingredient expiry
    -- Add this to your existing Supabase setup

    -- Create notification preferences table
    CREATE TABLE IF NOT EXISTS public.notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email_notifications_enabled BOOLEAN DEFAULT true,
    expiry_reminder_days INTEGER DEFAULT 3,
    notification_time TIME DEFAULT '09:00:00',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
    );

    -- Create notification log table to track sent notifications
    CREATE TABLE IF NOT EXISTS public.notification_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    ingredient_id UUID REFERENCES stored_ingredients(id) ON DELETE CASCADE,
    notification_type TEXT NOT NULL DEFAULT 'expiry_reminder',
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    email_sent BOOLEAN DEFAULT false,
    error_message TEXT
    );

    -- Function to get users with expiring ingredients who want notifications
    CREATE OR REPLACE FUNCTION get_users_with_expiring_ingredients(days_ahead INTEGER DEFAULT 3)
    RETURNS TABLE (
    user_id UUID,
    user_email TEXT,
    notification_enabled BOOLEAN,
    reminder_days INTEGER,
    ingredient_count BIGINT
    )
    SECURITY DEFINER
    SET search_path = public
    LANGUAGE plpgsql
    AS $$
    BEGIN
    RETURN QUERY
    SELECT 
        u.id as user_id,
        u.email::TEXT as user_email,
        COALESCE(np.email_notifications_enabled, true) as notification_enabled,
        COALESCE(np.expiry_reminder_days, 3) as reminder_days,
        COUNT(si.id) as ingredient_count
    FROM auth.users u
    LEFT JOIN notification_preferences np ON np.user_id = u.id
    INNER JOIN stored_ingredients si ON si.user_id = u.id
    WHERE 
        si.expiry_date IS NOT NULL
        AND si.expiry_date >= CURRENT_DATE
        AND si.expiry_date <= (CURRENT_DATE + INTERVAL '1 day' * COALESCE(np.expiry_reminder_days, days_ahead))
        AND COALESCE(np.email_notifications_enabled, true) = true
        -- Don't send if we already sent a notification for this ingredient in the last 24 hours
        AND NOT EXISTS (
        SELECT 1 FROM notification_log nl 
        WHERE nl.user_id = u.id 
        AND nl.ingredient_id = si.id 
        AND nl.sent_at > (NOW() - INTERVAL '24 hours')
        AND nl.email_sent = true
        )
    GROUP BY u.id, u.email, np.email_notifications_enabled, np.expiry_reminder_days
    HAVING COUNT(si.id) > 0;
    END;
    $$;

    -- Function to log notification attempts
    CREATE OR REPLACE FUNCTION log_notification(
    p_user_id UUID,
    p_ingredient_id UUID,
    p_notification_type TEXT,
    p_email_sent BOOLEAN,
    p_error_message TEXT DEFAULT NULL
    )
    RETURNS UUID
    SECURITY DEFINER
    SET search_path = public
    LANGUAGE plpgsql
    AS $$
    DECLARE
    log_id UUID;
    BEGIN
    INSERT INTO notification_log (
        user_id,
        ingredient_id,
        notification_type,
        email_sent,
        error_message
    ) VALUES (
        p_user_id,
        p_ingredient_id,
        p_notification_type,
        p_email_sent,
        p_error_message
    ) RETURNING id INTO log_id;
    
    RETURN log_id;
    END;
    $$;

    -- Create RLS policies
    ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
    ALTER TABLE notification_log ENABLE ROW LEVEL SECURITY;

    -- Drop existing policies if they exist (to avoid conflicts)
    DROP POLICY IF EXISTS "Users can manage their own notification preferences" ON notification_preferences;
    DROP POLICY IF EXISTS "Users can view their own notification logs" ON notification_log;
    DROP POLICY IF EXISTS "Admins can view all notification logs" ON notification_log;

    -- Users can only see/modify their own notification preferences
    CREATE POLICY "Users can manage their own notification preferences" ON notification_preferences
    FOR ALL USING (auth.uid() = user_id);

    -- Users can only see their own notification logs
    CREATE POLICY "Users can view their own notification logs" ON notification_log
    FOR SELECT USING (auth.uid() = user_id);

    -- Admins can view all notification logs
    CREATE POLICY "Admins can view all notification logs" ON notification_log
    FOR SELECT USING (
        EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_profiles.user_id = auth.uid() 
        AND user_profiles.role = 'admin'
        )
    );

    -- Create updated_at trigger for notification_preferences
    DROP TRIGGER IF EXISTS update_notification_preferences_updated_at ON notification_preferences;
    CREATE TRIGGER update_notification_preferences_updated_at 
    BEFORE UPDATE ON notification_preferences 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    -- Insert default notification preferences for existing users
    INSERT INTO notification_preferences (user_id, email_notifications_enabled, expiry_reminder_days)
    SELECT 
    up.user_id, 
    true, 
    3
    FROM user_profiles up
    WHERE NOT EXISTS (
    SELECT 1 FROM notification_preferences np 
    WHERE np.user_id = up.user_id
    )
    ON CONFLICT (user_id) DO NOTHING;
