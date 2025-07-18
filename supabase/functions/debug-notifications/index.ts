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
    console.log('🚀 Function started')
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    console.log('✅ Supabase client created')

    // Step 1: Test basic database connection
    const { data: testData, error: testError } = await supabaseClient
      .from('stored_ingredients')
      .select('count')
      .limit(1)

    if (testError) {
      console.error('❌ Database connection failed:', testError)
      throw new Error(`Database connection failed: ${testError.message}`)
    }

    console.log('✅ Database connection successful')

    // Step 2: Check for expiring ingredients
    const today = new Date()
    const threeDaysFromNow = new Date(today)
    threeDaysFromNow.setDate(today.getDate() + 3)

    console.log('🔍 Checking for expiring ingredients...')
    
    const { data: expiringIngredients, error: ingredientsError } = await supabaseClient
      .from('stored_ingredients')
      .select(`
        *,
        auth.users!inner(email)
      `)
      .gte('expiry_date', today.toISOString().split('T')[0])
      .lte('expiry_date', threeDaysFromNow.toISOString().split('T')[0])

    if (ingredientsError) {
      console.error('❌ Error fetching ingredients:', ingredientsError)
      throw new Error(`Failed to fetch ingredients: ${ingredientsError.message}`)
    }

    console.log(`📦 Found ${expiringIngredients?.length || 0} expiring ingredients`)

    if (!expiringIngredients || expiringIngredients.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No expiring ingredients found',
          debug: {
            todayDate: today.toISOString().split('T')[0],
            threeDaysDate: threeDaysFromNow.toISOString().split('T')[0]
          }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

    // Step 3: Group by user
    const userIngredients = new Map()
    
    for (const ingredient of expiringIngredients) {
      const userId = ingredient.user_id
      const userEmail = ingredient.auth?.users?.email
      
      if (!userEmail) {
        console.warn(`⚠️ No email found for user ${userId}`)
        continue
      }

      if (!userIngredients.has(userId)) {
        userIngredients.set(userId, {
          userEmail,
          ingredients: []
        })
      }
      userIngredients.get(userId).ingredients.push(ingredient)
    }

    console.log(`👥 Found ${userIngredients.size} users with expiring ingredients`)

    // Step 4: Try sending one test email
    let emailResults = []
    
    for (const [userId, userData] of userIngredients) {
      const { userEmail, ingredients } = userData
      
      console.log(`📧 Attempting to send email to: ${userEmail}`)
      
      try {
        // Test email sending capability
        const emailResult = await supabaseClient.auth.admin.sendEmail({
          type: 'custom',
          email: userEmail,
          subject: '🧪 HomePlate Test - Email Function Working!',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #16a34a;">✅ Email Function Test Successful!</h2>
              <p>Your HomePlate email notification system is working correctly.</p>
              <p><strong>Found ${ingredients.length} expiring ingredient(s):</strong></p>
              <ul>
                ${ingredients.map(ing => `<li>${ing.name} - expires ${ing.expiry_date}</li>`).join('')}
              </ul>
              <p style="color: #6b7280; font-size: 14px;">This is a test email from your HomePlate notification system.</p>
            </div>
          `,
          text: `HomePlate Test Email - Found ${ingredients.length} expiring ingredients`
        })

        if (emailResult.error) {
          console.error(`❌ Email failed for ${userEmail}:`, emailResult.error)
          emailResults.push({ email: userEmail, success: false, error: emailResult.error.message })
        } else {
          console.log(`✅ Email sent successfully to ${userEmail}`)
          emailResults.push({ email: userEmail, success: true })
        }

        // Only send to first user for testing
        break
        
      } catch (error) {
        console.error(`❌ Email sending failed for ${userEmail}:`, error)
        emailResults.push({ email: userEmail, success: false, error: error.message })
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Debug email function completed',
        debug: {
          ingredientsFound: expiringIngredients.length,
          usersFound: userIngredients.size,
          emailResults,
          sampleIngredients: expiringIngredients.slice(0, 3).map(ing => ({
            name: ing.name,
            expiry_date: ing.expiry_date,
            user_email: ing.auth?.users?.email
          }))
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('❌ Function error:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        stack: error.stack
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
