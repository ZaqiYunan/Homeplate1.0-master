import { createClient } from '@supabase/supabase-js'

// These should be set as environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl) {
  throw new Error('Missing env var: NEXT_PUBLIC_SUPABASE_URL')
}

if (!supabaseAnonKey) {
  throw new Error('Missing env var: NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types (generated from Supabase CLI or manually defined)
export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          user_id: string
          height: number
          weight: number
          age: number | null
          gender: 'male' | 'female' | 'other' | null
          role: 'user' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          height: number
          weight: number
          age?: number | null
          gender?: 'male' | 'female' | 'other' | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          height?: number
          weight?: number
          age?: number | null
          gender?: 'male' | 'female' | 'other' | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      nutritional_goals: {
        Row: {
          id: string
          user_id: string
          calories: number
          protein: number
          carbs: number
          fat: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          calories: number
          protein: number
          carbs: number
          fat: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          calories?: number
          protein?: number
          carbs?: number
          fat?: number
          created_at?: string
          updated_at?: string
        }
      }
      stored_ingredients: {
        Row: {
          id: string
          user_id: string
          name: string
          category: 'vegetable' | 'fruit' | 'protein' | 'dairy' | 'grain' | 'spice' | 'other'
          location: 'pantry' | 'refrigerator' | 'freezer'
          quantity: number
          unit: string
          purchase_date: string
          expiry_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          category: 'vegetable' | 'fruit' | 'protein' | 'dairy' | 'grain' | 'spice' | 'other'
          location: 'pantry' | 'refrigerator' | 'freezer'
          quantity: number
          unit: string
          purchase_date: string
          expiry_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          category?: 'vegetable' | 'fruit' | 'protein' | 'dairy' | 'grain' | 'spice' | 'other'
          location?: 'pantry' | 'refrigerator' | 'freezer'
          quantity?: number
          unit?: string
          purchase_date?: string
          expiry_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      preferred_ingredients: {
        Row: {
          id: string
          user_id: string
          ingredient_name: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          ingredient_name: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          ingredient_name?: string
          created_at?: string
        }
      }
      meal_logs: {
        Row: {
          id: string
          user_id: string
          recipe_name: string
          ingredients: string[]
          instructions: string
          url: string | null
          calories: number
          protein: number
          carbs: number
          fat: number
          logged_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          recipe_name: string
          ingredients: string[]
          instructions: string
          url?: string | null
          calories: number
          protein: number
          carbs: number
          fat: number
          logged_at: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          recipe_name?: string
          ingredients?: string[]
          instructions?: string
          url?: string | null
          calories?: number
          protein?: number
          carbs?: number
          fat?: number
          logged_at?: string
          created_at?: string
        }
      }
    }
  }
}
