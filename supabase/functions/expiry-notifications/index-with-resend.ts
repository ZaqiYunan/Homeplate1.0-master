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
    console.log('🚀 Function started - email sending version')
    
    // Step 1: Check environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    
    console.log('Environment check:', {
      hasUrl: !!supabaseUrl,
      hasServiceKey: !!serviceRoleKey,
      hasResendKey: !!resendApiKey,
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

    // Step 4: Check for expiring ingredients with configurable range
    const today = new Date().toISOString().split('T')[0]
    
    // Default to 14 days ahead, but allow customization via request body
    const requestBody = await req.json().catch(() => ({}))
    const daysAhead = requestBody.daysAhead || 14 // Extended to 14 days to catch more ingredients
    
    const expiryDate = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    console.log('Date range:', { 
      today, 
      expiryDate, 
      daysAhead,
      message: `Checking ingredients expiring within ${daysAhead} days`
    })

    const { data: ingredients, error: ingredientError } = await supabaseClient
      .from('stored_ingredients')
      .select('id, name, expiry_date, user_id')
      .gte('expiry_date', today)
      .lte('expiry_date', expiryDate)
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
          results: {
            timestamp: new Date().toISOString(),
            expiringIngredients: 0,
            dateRange: { today, expiryDate, daysAhead }
          }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }        // Get users who need notifications with the same date range
        const { data: usersData, error: usersError } = await supabaseClient
          .rpc('get_users_with_expiring_ingredients', { days_ahead: daysAhead })

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

        // Create email content with dynamic messaging
        const ingredientList = userIngredients
          .map((ing: any) => `• ${ing.name} (expires: ${ing.expiry_date})`)
          .join('\n')

        // Categorize ingredients by urgency with extended ranges
        const urgentIngredients = userIngredients.filter((ing: any) => {
          const daysUntilExpiry = Math.ceil((new Date(ing.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
          return daysUntilExpiry <= 1
        })

        const soonIngredients = userIngredients.filter((ing: any) => {
          const daysUntilExpiry = Math.ceil((new Date(ing.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
          return daysUntilExpiry > 1 && daysUntilExpiry <= 3
        })

        const mediumIngredients = userIngredients.filter((ing: any) => {
          const daysUntilExpiry = Math.ceil((new Date(ing.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
          return daysUntilExpiry > 3 && daysUntilExpiry <= 7
        })

        const laterIngredients = userIngredients.filter((ing: any) => {
          const daysUntilExpiry = Math.ceil((new Date(ing.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
          return daysUntilExpiry > 7
        })

        let urgencyMessage = ''
        if (urgentIngredients.length > 0) {
          urgencyMessage = '🚨 URGENT: Some ingredients expire today or tomorrow!'
        } else if (soonIngredients.length > 0) {
          urgencyMessage = '⚠️ Some ingredients expire within 3 days.'
        } else if (mediumIngredients.length > 0) {
          urgencyMessage = '📅 Some ingredients expire within a week.'
        } else {
          urgencyMessage = '📋 Upcoming expiry dates for meal planning.'
        }

        const emailContent = `
Hello!

${urgencyMessage}

Here are your ingredients that will expire within the next ${daysAhead} days:

${ingredientList}

Please check your pantry and prioritize using these ingredients.

Best regards,
Your Food Management App
        `.trim()

        // Check if Resend API key is available
        if (!resendApiKey) {
          console.log(`📧 Would send email to ${userData.user_email}:`)
          console.log(`Subject: 🚨 ${userIngredients.length} ingredient(s) expiring within ${daysAhead} days!`)
          console.log(`Content: ${emailContent}`)
          
          // Log as "sent" for testing purposes
          emailsSent++
          
          // Log successful attempts for each ingredient
          for (const ingredient of userIngredients) {
            await supabaseClient.rpc('log_notification', {
              p_user_id: userData.user_id,
              p_ingredient_id: ingredient.id,
              p_notification_type: 'expiry_reminder',
              p_email_sent: true,
              p_error_message: 'Simulation mode - Resend API key not configured'
            })
          }
          continue
        }

        // Send actual email using Resend API
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'notifications@resend.dev', // Use Resend's test domain or your verified domain
            to: userData.user_email,
            subject: `🚨 ${userIngredients.length} ingredient(s) expiring within ${daysAhead} days!`,
            text: emailContent,
            html: `
              <h2>🚨 Ingredients Expiring Within ${daysAhead} Days!</h2>
              <p>Hello!</p>
              <p><strong>${urgencyMessage}</strong></p>
              <p>Here are your ingredients that will expire within the next ${daysAhead} days:</p>
              ${urgentIngredients.length > 0 ? `
                <h3 style="color: #dc2626;">🚨 URGENT (expires today/tomorrow):</h3>
                <ul style="color: #dc2626;">
                  ${urgentIngredients.map((ing: any) => `<li><strong>${ing.name}</strong> (expires: ${ing.expiry_date})</li>`).join('')}
                </ul>
              ` : ''}
              ${soonIngredients.length > 0 ? `
                <h3 style="color: #ea580c;">⚠️ Soon (expires within 3 days):</h3>
                <ul style="color: #ea580c;">
                  ${soonIngredients.map((ing: any) => `<li><strong>${ing.name}</strong> (expires: ${ing.expiry_date})</li>`).join('')}
                </ul>
              ` : ''}
              ${mediumIngredients.length > 0 ? `
                <h3 style="color: #d97706;">📅 This Week (expires in 4-7 days):</h3>
                <ul style="color: #d97706;">
                  ${mediumIngredients.map((ing: any) => `<li><strong>${ing.name}</strong> (expires: ${ing.expiry_date})</li>`).join('')}
                </ul>
              ` : ''}
              ${laterIngredients.length > 0 ? `
                <h3 style="color: #0369a1;">📋 Next Week+ (expires in 8+ days):</h3>
                <ul style="color: #0369a1;">
                  ${laterIngredients.map((ing: any) => `<li><strong>${ing.name}</strong> (expires: ${ing.expiry_date})</li>`).join('')}
                </ul>
              ` : ''}
              <p>Please check your pantry and prioritize using these ingredients.</p>
              <p><em>💡 Tip: Use ingredients in order of urgency for best meal planning!</em></p>
              <p>Best regards,<br>Your Food Management App</p>
            `
          }),
        })

        const emailResult = await emailResponse.json()

        if (!emailResponse.ok) {
          console.error(`❌ Failed to send email to ${userData.user_email}:`, emailResult)
          emailErrors++
          
          // Log the failed attempt
          await supabaseClient.rpc('log_notification', {
            p_user_id: userData.user_id,
            p_ingredient_id: userIngredients[0].id,
            p_notification_type: 'expiry_reminder',
            p_email_sent: false,
            p_error_message: `Resend API error: ${emailResult.message || 'Unknown error'}`
          })
        } else {
          console.log(`✅ Email sent to ${userData.user_email} - Email ID: ${emailResult.id}`)
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

      } catch (error: any) {
        console.error(`❌ Error processing user ${userData.user_email}:`, error)
        emailErrors++
      }
    }

    // Step 8: Return results
    return new Response(
      JSON.stringify({
        success: true,
        message: resendApiKey ? 'Email notification process completed' : 'Email simulation completed - Add RESEND_API_KEY to send real emails',
        results: {
          timestamp: new Date().toISOString(),
          expiringIngredients: ingredients.length,
          usersToNotify: usersData?.length || 0,
          emailsSent,
          emailErrors,
          dateRange: { today, expiryDate, daysAhead },
          mode: resendApiKey ? 'real_emails' : 'simulation'
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
