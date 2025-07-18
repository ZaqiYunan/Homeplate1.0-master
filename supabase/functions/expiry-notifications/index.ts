import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🚀 Function started - simple version')
    
    // Step 1: Check environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    console.log('Environment check:', {
      hasUrl: !!supabaseUrl,
      hasServiceKey: !!serviceRoleKey,
      urlPreview: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'missing'
    })

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Missing environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    }

    // Step 2: Create Supabase client
    const supabaseClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    console.log('✅ Supabase client created')

    // Step 3: Simple database test
    const { data: testQuery, error: testError } = await supabaseClient
      .from('stored_ingredients')
      .select('id')
      .limit(1)

    if (testError) {
      console.error('❌ Database test failed:', testError)
      throw new Error(`Database access failed: ${testError.message}`)
    }

    console.log('✅ Database connection successful')

    // Step 4: Check for expiring ingredients (simplified)
    const today = new Date().toISOString().split('T')[0]
    const threeDaysLater = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    console.log('Date range:', { today, threeDaysLater })

    const { data: ingredients, error: ingredientError } = await supabaseClient
      .from('stored_ingredients')
      .select('id, name, expiry_date, user_id')
      .gte('expiry_date', today)
      .lte('expiry_date', threeDaysLater)
      .not('expiry_date', 'is', null)

    if (ingredientError) {
      console.error('❌ Ingredient query failed:', ingredientError)
      throw new Error(`Failed to fetch ingredients: ${ingredientError.message}`)
    }

    console.log(`📦 Found ${ingredients?.length || 0} expiring ingredients`)

    // Step 5: If no expiring ingredients, return early
    if (!ingredients || ingredients.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No expiring ingredients found',
          debug: {
            timestamp: new Date().toISOString(),
            expiringIngredients: 0,
            dateRange: { today, threeDaysLater }
          }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

    // Step 6: Get users who need notifications
    const { data: usersData, error: usersError } = await supabaseClient
      .rpc('get_users_with_expiring_ingredients', { days_ahead: 3 })

    if (usersError) {
      console.error('❌ Failed to get users:', usersError)
      throw new Error(`Failed to get users: ${usersError.message}`)
    }

    console.log(`👥 Found ${usersData?.length || 0} users to notify`)

    // Step 7: Send emails to users
    let emailsSent = 0
    let emailErrors = 0

    for (const userData of usersData || []) {
      try {
        // Get user's expiring ingredients
        const userIngredients = ingredients.filter((ing: any) => ing.user_id === userData.user_id)
        
        if (userIngredients.length === 0) continue

        // Create email content
        const ingredientList = userIngredients
          .map((ing: any) => `• ${ing.name} (expires: ${ing.expiry_date})`)
          .join('\n')

        const emailContent = `
Hello!

Some of your stored ingredients are expiring soon:

${ingredientList}

Please check your pantry and use these ingredients before they expire.

Best regards,
Your Food Management App
        `.trim()

        // For now, let's log what would be sent and use a simple test
        // TODO: Integrate with actual email service (Resend, SendGrid, etc.)
        console.log(`📧 Would send email to ${userData.user_email}:`)
        console.log(`Subject: 🚨 ${userIngredients.length} ingredient(s) expiring soon!`)
        console.log(`Content: ${emailContent}`)
        
        // Simulate email sending for testing
        const emailError = null // Set to test email sending
        
        if (emailError) {
          console.error(`❌ Failed to send email to ${userData.user_email}:`, emailError)
          emailErrors++
          
          // Log the failed attempt
          await supabaseClient.rpc('log_notification', {
            p_user_id: userData.user_id,
            p_ingredient_id: userIngredients[0].id,
            p_notification_type: 'expiry_reminder',
            p_email_sent: false,
            p_error_message: 'Email service not configured yet'
          })
        } else {
          console.log(`✅ Email would be sent to ${userData.user_email}`)
          emailsSent++
          
          // Log successful attempts for each ingredient
          for (const ingredient of userIngredients) {
            await supabaseClient.rpc('log_notification', {
              p_user_id: userData.user_id,
              p_ingredient_id: ingredient.id,
              p_notification_type: 'expiry_reminder',
              p_email_sent: true,
              p_error_message: null
            })
          }
        }
      } catch (error) {
        console.error(`❌ Error processing user ${userData.user_email}:`, error)
        emailErrors++
      }
    }

    // Step 8: Return results
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Email notification process completed',
        results: {
          timestamp: new Date().toISOString(),
          expiringIngredients: ingredients.length,
          usersToNotify: usersData?.length || 0,
          emailsSent,
          emailErrors,
          dateRange: { today, threeDaysLater }
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error: any) {
    console.error('❌ Function error:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error?.message || 'Unknown error',
        stack: error?.stack || 'No stack trace',
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
