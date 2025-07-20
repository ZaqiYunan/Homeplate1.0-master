Initializing
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://fxeogbzwstepyyjgvkrq.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const SUPABASE_KEY = 'SUPABASE_CLIENT_API_KEY'

const SUPABASE_URL = "https://fxeogbzwstepyyjgvkrq.supabase.co"
const supabase = createClient(SUPABASE_URL, process.env.SUPABASE_KEY);

const SERVICE_KEY = 'SUPABASE_SERVICE_KEY'

const SUPABASE_URL = "https://fxeogbzwstepyyjgvkrq.supabase.co"
const supabase = createClient(SUPABASE_URL, process.env.SERVICE_KEY);


User signup
let { data, error } = await supabase.auth.signUp({
  email: 'someone@email.com',
  password: 'lsCdEJMuXJKVujqJLhdU'
})

User login
let { data, error } = await supabase.auth.signInWithPassword({
  email: 'someone@email.com',
  password: 'lsCdEJMuXJKVujqJLhdU'
})

Third party login

let { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google'
})

Get user
const { data: { user } } = await supabase.auth.getUser()

User logout

let { error } = await supabase.auth.signOut()

Meal logs

Select id
let { data: meal_logs, error } = await supabase
  .from('meal_logs')
  .select('id')

Select user_id
let { data: meal_logs, error } = await supabase
  .from('meal_logs')
  .select('user_id')

Select recipe_name
let { data: meal_logs, error } = await supabase
  .from('meal_logs')
  .select('recipe_name')

Select ingredients
let { data: meal_logs, error } = await supabase
  .from('meal_logs')
  .select('ingredients')

Select instructions
let { data: meal_logs, error } = await supabase
  .from('meal_logs')
  .select('instructions')

Select url
let { data: meal_logs, error } = await supabase
  .from('meal_logs')
  .select('url')

Select calories
let { data: meal_logs, error } = await supabase
  .from('meal_logs')
  .select('calories')

Select protein
let { data: meal_logs, error } = await supabase
  .from('meal_logs')
  .select('protein')

Select carbs
let { data: meal_logs, error } = await supabase
  .from('meal_logs')
  .select('carbs')

Select fat
let { data: meal_logs, error } = await supabase
  .from('meal_logs')
  .select('fat')

Select logged_at
let { data: meal_logs, error } = await supabase
  .from('meal_logs')
  .select('logged_at')

Select created_at
let { data: meal_logs, error } = await supabase
  .from('meal_logs')
  .select('created_at')

Read all rows
let { data: meal_logs, error } = await supabase
  .from('meal_logs')
  .select('*')
Read specific columns
let { data: meal_logs, error } = await supabase
  .from('meal_logs')
  .select('some_column,other_column')
Read referenced tables
let { data: meal_logs, error } = await supabase
  .from('meal_logs')
  .select(`
    some_column,
    other_table (
      foreign_key
    )
  `)
With pagination
let { data: meal_logs, error } = await supabase
  .from('meal_logs')
  .select('*')
  .range(0, 9)

With filtering
let { data: meal_logs, error } = await supabase
  .from('meal_logs')
  .select("*")

  // Filters
  .eq('column', 'Equal to')
  .gt('column', 'Greater than')
  .lt('column', 'Less than')
  .gte('column', 'Greater than or equal to')
  .lte('column', 'Less than or equal to')
  .like('column', '%CaseSensitive%')
  .ilike('column', '%CaseInsensitive%')
  .is('column', null)
  .in('column', ['Array', 'Values'])
  .neq('column', 'Not equal to')

  // Arrays
  .contains('array_column', ['array', 'contains'])
  .containedBy('array_column', ['contained', 'by'])

  // Logical operators
  .not('column', 'like', 'Negate filter')
  .or('some_column.eq.Some value, other_column.eq.Other value')

Insert a row
const { data, error } = await supabase
  .from('meal_logs')
  .insert([
    { some_column: 'someValue', other_column: 'otherValue' },
  ])
  .select()
Insert many rows
const { data, error } = await supabase
  .from('meal_logs')
  .insert([
    { some_column: 'someValue' },
    { some_column: 'otherValue' },
  ])
  .select()
Upsert matching rows
const { data, error } = await supabase
  .from('meal_logs')
  .upsert({ some_column: 'someValue' })
  .select()

Update matching rows
const { data, error } = await supabase
  .from('meal_logs')
  .update({ other_column: 'otherValue' })
  .eq('some_column', 'someValue')
  .select()

Delete matching rows
const { error } = await supabase
  .from('meal_logs')
  .delete()
  .eq('some_column', 'someValue')

ubscribe to all events
const mealLogs = supabase.channel('custom-all-channel')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'meal_logs' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
Subscribe to inserts
const mealLogs = supabase.channel('custom-insert-channel')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'meal_logs' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
Subscribe to updates
const mealLogs = supabase.channel('custom-update-channel')
  .on(
    'postgres_changes',
    { event: 'UPDATE', schema: 'public', table: 'meal_logs' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
Subscribe to deletes
const mealLogs = supabase.channel('custom-delete-channel')
  .on(
    'postgres_changes',
    { event: 'DELETE', schema: 'public', table: 'meal_logs' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
Subscribe to specific rows
const mealLogs = supabase.channel('custom-filter-channel')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'meal_logs', filter: 'column_name=eq.someValue' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()


Notification log

Select id
let { data: notification_log, error } = await supabase
  .from('notification_log')
  .select('id')

Select user_id
let { data: notification_log, error } = await supabase
  .from('notification_log')
  .select('user_id')

Select ingredient_id
let { data: notification_log, error } = await supabase
  .from('notification_log')
  .select('ingredient_id')

Select notification_type
let { data: notification_log, error } = await supabase
  .from('notification_log')
  .select('notification_type')

Select sent_at
let { data: notification_log, error } = await supabase
  .from('notification_log')
  .select('sent_at')

Select email_sent
let { data: notification_log, error } = await supabase
  .from('notification_log')
  .select('email_sent')

Select error_message
let { data: notification_log, error } = await supabase
  .from('notification_log')
  .select('error_message')

Read all rows
let { data: notification_log, error } = await supabase
  .from('notification_log')
  .select('*')

Copy
Read specific columns
let { data: notification_log, error } = await supabase
  .from('notification_log')
  .select('some_column,other_column')
Read referenced tables
let { data: notification_log, error } = await supabase
  .from('notification_log')
  .select(`
    some_column,
    other_table (
      foreign_key
    )
  `)
With pagination
let { data: notification_log, error } = await supabase
  .from('notification_log')
  .select('*')
  .range(0, 9)

With filtering
let { data: notification_log, error } = await supabase
  .from('notification_log')
  .select("*")

  // Filters
  .eq('column', 'Equal to')
  .gt('column', 'Greater than')
  .lt('column', 'Less than')
  .gte('column', 'Greater than or equal to')
  .lte('column', 'Less than or equal to')
  .like('column', '%CaseSensitive%')
  .ilike('column', '%CaseInsensitive%')
  .is('column', null)
  .in('column', ['Array', 'Values'])
  .neq('column', 'Not equal to')

  // Arrays
  .contains('array_column', ['array', 'contains'])
  .containedBy('array_column', ['contained', 'by'])

  // Logical operators
  .not('column', 'like', 'Negate filter')
  .or('some_column.eq.Some value, other_column.eq.Other value')

Insert a row
const { data, error } = await supabase
  .from('notification_log')
  .insert([
    { some_column: 'someValue', other_column: 'otherValue' },
  ])
  .select()
Insert many rows
const { data, error } = await supabase
  .from('notification_log')
  .insert([
    { some_column: 'someValue' },
    { some_column: 'otherValue' },
  ])
  .select()

Copy
Upsert matching rows
const { data, error } = await supabase
  .from('notification_log')
  .upsert({ some_column: 'someValue' })
  .select()

Update matching rows
const { data, error } = await supabase
  .from('notification_log')
  .update({ other_column: 'otherValue' })
  .eq('some_column', 'someValue')
  .select()


Delete matching rows
const { error } = await supabase
  .from('notification_log')
  .delete()
  .eq('some_column', 'someValue')

Subscribe to all events
const notificationLog = supabase.channel('custom-all-channel')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'notification_log' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
Subscribe to inserts
const notificationLog = supabase.channel('custom-insert-channel')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'notification_log' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
Subscribe to updates
const notificationLog = supabase.channel('custom-update-channel')
  .on(
    'postgres_changes',
    { event: 'UPDATE', schema: 'public', table: 'notification_log' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
Subscribe to deletes
const notificationLog = supabase.channel('custom-delete-channel')
  .on(
    'postgres_changes',
    { event: 'DELETE', schema: 'public', table: 'notification_log' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()

Copy
Subscribe to specific rows
const notificationLog = supabase.channel('custom-filter-channel')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'notification_log', filter: 'column_name=eq.someValue' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()

Notification preferences

Select id
let { data: notification_preferences, error } = await supabase
  .from('notification_preferences')
  .select('id')

Select user_id
let { data: notification_preferences, error } = await supabase
  .from('notification_preferences')
  .select('user_id')

Select email_notifications_enabled
let { data: notification_preferences, error } = await supabase
  .from('notification_preferences')
  .select('email_notifications_enabled')


Select expiry_reminder_days
let { data: notification_preferences, error } = await supabase
  .from('notification_preferences')
  .select('expiry_reminder_days')


Select notification_time
let { data: notification_preferences, error } = await supabase
  .from('notification_preferences')
  .select('notification_time')

Select created_at
let { data: notification_preferences, error } = await supabase
  .from('notification_preferences')
  .select('created_at')

Select updated_at
let { data: notification_preferences, error } = await supabase
  .from('notification_preferences')
  .select('updated_at')

Read all rows
let { data: notification_preferences, error } = await supabase
  .from('notification_preferences')
  .select('*')
Read specific columns
let { data: notification_preferences, error } = await supabase
  .from('notification_preferences')
  .select('some_column,other_column')

Copy
Read referenced tables
let { data: notification_preferences, error } = await supabase
  .from('notification_preferences')
  .select(`
    some_column,
    other_table (
      foreign_key
    )
  `)
With pagination
let { data: notification_preferences, error } = await supabase
  .from('notification_preferences')
  .select('*')
  .range(0, 9)

With filtering
let { data: notification_preferences, error } = await supabase
  .from('notification_preferences')
  .select("*")

  // Filters
  .eq('column', 'Equal to')
  .gt('column', 'Greater than')
  .lt('column', 'Less than')
  .gte('column', 'Greater than or equal to')
  .lte('column', 'Less than or equal to')
  .like('column', '%CaseSensitive%')
  .ilike('column', '%CaseInsensitive%')
  .is('column', null)
  .in('column', ['Array', 'Values'])
  .neq('column', 'Not equal to')

  // Arrays
  .contains('array_column', ['array', 'contains'])
  .containedBy('array_column', ['contained', 'by'])

  // Logical operators
  .not('column', 'like', 'Negate filter')
  .or('some_column.eq.Some value, other_column.eq.Other value')

Insert a row
const { data, error } = await supabase
  .from('notification_preferences')
  .insert([
    { some_column: 'someValue', other_column: 'otherValue' },
  ])
  .select()
Insert many rows
const { data, error } = await supabase
  .from('notification_preferences')
  .insert([
    { some_column: 'someValue' },
    { some_column: 'otherValue' },
  ])
  .select()
Upsert matching rows
const { data, error } = await supabase
  .from('notification_preferences')
  .upsert({ some_column: 'someValue' })
  .select()

Update matching rows
const { data, error } = await supabase
  .from('notification_preferences')
  .update({ other_column: 'otherValue' })
  .eq('some_column', 'someValue')
  .select()


Delete matching rows
const { error } = await supabase
  .from('notification_preferences')
  .delete()
  .eq('some_column', 'someValue')


Subscribe to all events
const notificationPreferences = supabase.channel('custom-all-channel')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'notification_preferences' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
Subscribe to inserts
const notificationPreferences = supabase.channel('custom-insert-channel')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'notification_preferences' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
Subscribe to updates
const notificationPreferences = supabase.channel('custom-update-channel')
  .on(
    'postgres_changes',
    { event: 'UPDATE', schema: 'public', table: 'notification_preferences' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
Subscribe to deletes
const notificationPreferences = supabase.channel('custom-delete-channel')
  .on(
    'postgres_changes',
    { event: 'DELETE', schema: 'public', table: 'notification_preferences' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
Subscribe to specific rows
const notificationPreferences = supabase.channel('custom-filter-channel')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'notification_preferences', filter: 'column_name=eq.someValue' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()

Nutritional goals

Select id
let { data: nutritional_goals, error } = await supabase
  .from('nutritional_goals')
  .select('id') 


Select user_id
let { data: nutritional_goals, error } = await supabase
  .from('nutritional_goals')
  .select('user_id')


Select calories
let { data: nutritional_goals, error } = await supabase
  .from('nutritional_goals')
  .select('calories')


Select protein
let { data: nutritional_goals, error } = await supabase
  .from('nutritional_goals')
  .select('protein')


Select carbs
let { data: nutritional_goals, error } = await supabase
  .from('nutritional_goals')
  .select('carbs')

Select fat
let { data: nutritional_goals, error } = await supabase
  .from('nutritional_goals')
  .select('fat')

Select created_at
let { data: nutritional_goals, error } = await supabase
  .from('nutritional_goals')
  .select('created_at')

Select updated_at
let { data: nutritional_goals, error } = await supabase
  .from('nutritional_goals')
  .select('updated_at')

Read all rows
let { data: nutritional_goals, error } = await supabase
  .from('nutritional_goals')
  .select('*')
Read specific columns
let { data: nutritional_goals, error } = await supabase
  .from('nutritional_goals')
  .select('some_column,other_column')
Read referenced tables
let { data: nutritional_goals, error } = await supabase
  .from('nutritional_goals')
  .select(`
    some_column,
    other_table (
      foreign_key
    )
  `)
With pagination
let { data: nutritional_goals, error } = await supabase
  .from('nutritional_goals')
  .select('*')
  .range(0, 9)

With filtering
let { data: nutritional_goals, error } = await supabase
  .from('nutritional_goals')
  .select("*")

  // Filters
  .eq('column', 'Equal to')
  .gt('column', 'Greater than')
  .lt('column', 'Less than')
  .gte('column', 'Greater than or equal to')
  .lte('column', 'Less than or equal to')
  .like('column', '%CaseSensitive%')
  .ilike('column', '%CaseInsensitive%')
  .is('column', null)
  .in('column', ['Array', 'Values'])
  .neq('column', 'Not equal to')

  // Arrays
  .contains('array_column', ['array', 'contains'])
  .containedBy('array_column', ['contained', 'by'])

  // Logical operators
  .not('column', 'like', 'Negate filter')
  .or('some_column.eq.Some value, other_column.eq.Other value')

Insert a row
const { data, error } = await supabase
  .from('nutritional_goals')
  .insert([
    { some_column: 'someValue', other_column: 'otherValue' },
  ])
  .select()
Insert many rows
const { data, error } = await supabase
  .from('nutritional_goals')
  .insert([
    { some_column: 'someValue' },
    { some_column: 'otherValue' },
  ])
  .select()
Upsert matching rows
const { data, error } = await supabase
  .from('nutritional_goals')
  .upsert({ some_column: 'someValue' })
  .select()

  Update matching rows
const { data, error } = await supabase
  .from('nutritional_goals')
  .update({ other_column: 'otherValue' })
  .eq('some_column', 'someValue')
  .select()

  Delete matching rows
const { error } = await supabase
  .from('nutritional_goals')
  .delete()
  .eq('some_column', 'someValue')


  Subscribe to all events
const nutritionalGoals = supabase.channel('custom-all-channel')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'nutritional_goals' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
Subscribe to inserts
const nutritionalGoals = supabase.channel('custom-insert-channel')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'nutritional_goals' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
Subscribe to updates
const nutritionalGoals = supabase.channel('custom-update-channel')
  .on(
    'postgres_changes',
    { event: 'UPDATE', schema: 'public', table: 'nutritional_goals' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
Subscribe to deletes
const nutritionalGoals = supabase.channel('custom-delete-channel')
  .on(
    'postgres_changes',
    { event: 'DELETE', schema: 'public', table: 'nutritional_goals' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
Subscribe to specific rows
const nutritionalGoals = supabase.channel('custom-filter-channel')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'nutritional_goals', filter: 'column_name=eq.someValue' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()

  Preferred Ingredients

  Select id
let { data: preferred_ingredients, error } = await supabase
  .from('preferred_ingredients')
  .select('id')


  Select user_id
let { data: preferred_ingredients, error } = await supabase
  .from('preferred_ingredients')
  .select('user_id')

  Select ingredient_name
let { data: preferred_ingredients, error } = await supabase
  .from('preferred_ingredients')
  .select('ingredient_name')


  Select created_at
let { data: preferred_ingredients, error } = await supabase
  .from('preferred_ingredients')
  .select('created_at')

  Read all rows
let { data: preferred_ingredients, error } = await supabase
  .from('preferred_ingredients')
  .select('*')
Read specific columns
let { data: preferred_ingredients, error } = await supabase
  .from('preferred_ingredients')
  .select('some_column,other_column')
Read referenced tables
let { data: preferred_ingredients, error } = await supabase
  .from('preferred_ingredients')
  .select(`
    some_column,
    other_table (
      foreign_key
    )
  `)
With pagination
let { data: preferred_ingredients, error } = await supabase
  .from('preferred_ingredients')
  .select('*')
  .range(0, 9)


  With filtering
let { data: preferred_ingredients, error } = await supabase
  .from('preferred_ingredients')
  .select("*")

  // Filters
  .eq('column', 'Equal to')
  .gt('column', 'Greater than')
  .lt('column', 'Less than')
  .gte('column', 'Greater than or equal to')
  .lte('column', 'Less than or equal to')
  .like('column', '%CaseSensitive%')
  .ilike('column', '%CaseInsensitive%')
  .is('column', null)
  .in('column', ['Array', 'Values'])
  .neq('column', 'Not equal to')

  // Arrays
  .contains('array_column', ['array', 'contains'])
  .containedBy('array_column', ['contained', 'by'])

  // Logical operators
  .not('column', 'like', 'Negate filter')
  .or('some_column.eq.Some value, other_column.eq.Other value')

  Insert a row
const { data, error } = await supabase
  .from('preferred_ingredients')
  .insert([
    { some_column: 'someValue', other_column: 'otherValue' },
  ])
  .select()
Insert many rows
const { data, error } = await supabase
  .from('preferred_ingredients')
  .insert([
    { some_column: 'someValue' },
    { some_column: 'otherValue' },
  ])
  .select()
Upsert matching rows
const { data, error } = await supabase
  .from('preferred_ingredients')
  .upsert({ some_column: 'someValue' })
  .select()

  Update matching rows
const { data, error } = await supabase
  .from('preferred_ingredients')
  .update({ other_column: 'otherValue' })
  .eq('some_column', 'someValue')
  .select()


  Delete matching rows
const { error } = await supabase
  .from('preferred_ingredients')
  .delete()
  .eq('some_column', 'someValue')


  Subscribe to all events
const preferredIngredients = supabase.channel('custom-all-channel')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'preferred_ingredients' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
Subscribe to inserts
const preferredIngredients = supabase.channel('custom-insert-channel')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'preferred_ingredients' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
Subscribe to updates
const preferredIngredients = supabase.channel('custom-update-channel')
  .on(
    'postgres_changes',
    { event: 'UPDATE', schema: 'public', table: 'preferred_ingredients' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
Subscribe to deletes
const preferredIngredients = supabase.channel('custom-delete-channel')
  .on(
    'postgres_changes',
    { event: 'DELETE', schema: 'public', table: 'preferred_ingredients' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
Subscribe to specific rows
const preferredIngredients = supabase.channel('custom-filter-channel')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'preferred_ingredients', filter: 'column_name=eq.someValue' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()

  Stored ingredients

  Select id
let { data: stored_ingredients, error } = await supabase
  .from('stored_ingredients')
  .select('id')


  Select user_id
let { data: stored_ingredients, error } = await supabase
  .from('stored_ingredients')
  .select('user_id')


  Select name
let { data: stored_ingredients, error } = await supabase
  .from('stored_ingredients')
  .select('name')

  Select category
let { data: stored_ingredients, error } = await supabase
  .from('stored_ingredients')
  .select('category')

  Select location
let { data: stored_ingredients, error } = await supabase
  .from('stored_ingredients')
  .select('location')



  Select quantity
let { data: stored_ingredients, error } = await supabase
  .from('stored_ingredients')
  .select('quantity')


  Select unit
let { data: stored_ingredients, error } = await supabase
  .from('stored_ingredients')
  .select('unit')


  Select purchase_date
let { data: stored_ingredients, error } = await supabase
  .from('stored_ingredients')
  .select('purchase_date')


Select expiry_date
let { data: stored_ingredients, error } = await supabase
  .from('stored_ingredients')
  .select('expiry_date')

  Select created_at
let { data: stored_ingredients, error } = await supabase
  .from('stored_ingredients')
  .select('created_at')

  Select updated_at
let { data: stored_ingredients, error } = await supabase
  .from('stored_ingredients')
  .select('updated_at')


  Read all rows
let { data: stored_ingredients, error } = await supabase
  .from('stored_ingredients')
  .select('*')
Read specific columns
let { data: stored_ingredients, error } = await supabase
  .from('stored_ingredients')
  .select('some_column,other_column')
Read referenced tables
let { data: stored_ingredients, error } = await supabase
  .from('stored_ingredients')
  .select(`
    some_column,
    other_table (
      foreign_key
    )
  `)
With pagination
let { data: stored_ingredients, error } = await supabase
  .from('stored_ingredients')
  .select('*')
  .range(0, 9)

  With filtering
let { data: stored_ingredients, error } = await supabase
  .from('stored_ingredients')
  .select("*")

  // Filters
  .eq('column', 'Equal to')
  .gt('column', 'Greater than')
  .lt('column', 'Less than')
  .gte('column', 'Greater than or equal to')
  .lte('column', 'Less than or equal to')
  .like('column', '%CaseSensitive%')
  .ilike('column', '%CaseInsensitive%')
  .is('column', null)
  .in('column', ['Array', 'Values'])
  .neq('column', 'Not equal to')

  // Arrays
  .contains('array_column', ['array', 'contains'])
  .containedBy('array_column', ['contained', 'by'])

  // Logical operators
  .not('column', 'like', 'Negate filter')
  .or('some_column.eq.Some value, other_column.eq.Other value')


  Insert a row
const { data, error } = await supabase
  .from('stored_ingredients')
  .insert([
    { some_column: 'someValue', other_column: 'otherValue' },
  ])
  .select()
Insert many rows
const { data, error } = await supabase
  .from('stored_ingredients')
  .insert([
    { some_column: 'someValue' },
    { some_column: 'otherValue' },
  ])
  .select()
Upsert matching rows
const { data, error } = await supabase
  .from('stored_ingredients')
  .upsert({ some_column: 'someValue' })
  .select()

  Update matching rows
const { data, error } = await supabase
  .from('stored_ingredients')
  .update({ other_column: 'otherValue' })
  .eq('some_column', 'someValue')
  .select()

  Delete matching rows
const { error } = await supabase
  .from('stored_ingredients')
  .delete()
  .eq('some_column', 'someValue')

  Subscribe to all events
const storedIngredients = supabase.channel('custom-all-channel')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'stored_ingredients' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
Subscribe to inserts
const storedIngredients = supabase.channel('custom-insert-channel')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'stored_ingredients' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
Subscribe to updates
const storedIngredients = supabase.channel('custom-update-channel')
  .on(
    'postgres_changes',
    { event: 'UPDATE', schema: 'public', table: 'stored_ingredients' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
Subscribe to deletes
const storedIngredients = supabase.channel('custom-delete-channel')
  .on(
    'postgres_changes',
    { event: 'DELETE', schema: 'public', table: 'stored_ingredients' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
Subscribe to specific rows
const storedIngredients = supabase.channel('custom-filter-channel')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'stored_ingredients', filter: 'column_name=eq.someValue' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()


  User profiles

  Select id
let { data: user_profiles, error } = await supabase
  .from('user_profiles')
  .select('id')

  Select user_id
let { data: user_profiles, error } = await supabase
  .from('user_profiles')
  .select('user_id')

  Select height
let { data: user_profiles, error } = await supabase
  .from('user_profiles')
  .select('height')


  Select weight
let { data: user_profiles, error } = await supabase
  .from('user_profiles')
  .select('weight')


  Select age
let { data: user_profiles, error } = await supabase
  .from('user_profiles')
  .select('age')


  Select gender
let { data: user_profiles, error } = await supabase
  .from('user_profiles')
  .select('gender')

  Select role
let { data: user_profiles, error } = await supabase
  .from('user_profiles')
  .select('role')

  Select created_at
let { data: user_profiles, error } = await supabase
  .from('user_profiles')
  .select('created_at')

  Select updated_at
let { data: user_profiles, error } = await supabase
  .from('user_profiles')
  .select('updated_at')


  Read all rows
let { data: user_profiles, error } = await supabase
  .from('user_profiles')
  .select('*')
Read specific columns
let { data: user_profiles, error } = await supabase
  .from('user_profiles')
  .select('some_column,other_column')
Read referenced tables
let { data: user_profiles, error } = await supabase
  .from('user_profiles')
  .select(`
    some_column,
    other_table (
      foreign_key
    )
  `)
With pagination
let { data: user_profiles, error } = await supabase
  .from('user_profiles')
  .select('*')
  .range(0, 9)

  With filtering
let { data: user_profiles, error } = await supabase
  .from('user_profiles')
  .select("*")

  // Filters
  .eq('column', 'Equal to')
  .gt('column', 'Greater than')
  .lt('column', 'Less than')
  .gte('column', 'Greater than or equal to')
  .lte('column', 'Less than or equal to')
  .like('column', '%CaseSensitive%')
  .ilike('column', '%CaseInsensitive%')
  .is('column', null)
  .in('column', ['Array', 'Values'])
  .neq('column', 'Not equal to')

  // Arrays
  .contains('array_column', ['array', 'contains'])
  .containedBy('array_column', ['contained', 'by'])

  // Logical operators
  .not('column', 'like', 'Negate filter')
  .or('some_column.eq.Some value, other_column.eq.Other value')


  Insert a row
const { data, error } = await supabase
  .from('user_profiles')
  .insert([
    { some_column: 'someValue', other_column: 'otherValue' },
  ])
  .select()
Insert many rows
const { data, error } = await supabase
  .from('user_profiles')
  .insert([
    { some_column: 'someValue' },
    { some_column: 'otherValue' },
  ])
  .select()
Upsert matching rows
const { data, error } = await supabase
  .from('user_profiles')
  .upsert({ some_column: 'someValue' })
  .select()


  Update matching rows
const { data, error } = await supabase
  .from('user_profiles')
  .update({ other_column: 'otherValue' })
  .eq('some_column', 'someValue')
  .select()

  Delete matching rows
const { error } = await supabase
  .from('user_profiles')
  .delete()
  .eq('some_column', 'someValue')



  Subscribe to all events
const userProfiles = supabase.channel('custom-all-channel')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'user_profiles' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
Subscribe to inserts
const userProfiles = supabase.channel('custom-insert-channel')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'user_profiles' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
Subscribe to updates
const userProfiles = supabase.channel('custom-update-channel')
  .on(
    'postgres_changes',
    { event: 'UPDATE', schema: 'public', table: 'user_profiles' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
Subscribe to deletes
const userProfiles = supabase.channel('custom-delete-channel')
  .on(
    'postgres_changes',
    { event: 'DELETE', schema: 'public', table: 'user_profiles' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
Subscribe to specific rows
const userProfiles = supabase.channel('custom-filter-channel')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'user_profiles', filter: 'column_name=eq.someValue' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()

  Get users for admin
  
  Invoke function
let { data, error } = await supabase
  .rpc('get_users_for_admin')
if (error) console.error(error)
else console.log(data)

  Get users with expiring ingredients
Invoke function
let { data, error } = await supabase
  .rpc('get_users_with_expiring_ingredients', {
    days_ahead
  })
if (error) console.error(error)
else console.log(data)

Log notification
Invoke function
let { data, error } = await supabase
  .rpc('log_notification', {
    p_email_sent, 
    p_error_message, 
    p_ingredient_id, 
    p_notification_type, 
    p_user_id
  })
if (error) console.error(error)
else console.log(data)


