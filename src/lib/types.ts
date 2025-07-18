// Corresponds to the RecipeSchema in recommend-recipes.ts
export interface Recipe {
  name: string;
  ingredients: string[];
  instructions: string;
  url?: string;
  missingIngredients?: string[];
}

export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealLog extends Recipe, NutritionalInfo {
  id: string; // Supabase UUID
  loggedAt: string; // ISO String
}

export interface UserProfile {
  height: number; // in cm
  weight: number; // in kg
  age?: number;
  gender?: 'male' | 'female' | 'other';
  role?: 'user' | 'admin';
}

export interface NutritionalGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export type StorageLocation = 'pantry' | 'refrigerator' | 'freezer';
export type IngredientCategory = 'vegetable' | 'fruit' | 'protein' | 'dairy' | 'grain' | 'spice' | 'other';


// The new, detailed structure for a stored food item.
export interface StoredIngredientItem {
  id: string; // Supabase UUID
  name: string;
  category: IngredientCategory;
  location: StorageLocation;
  quantity: number;
  unit: string; // e.g., 'pcs', 'grams', 'ml'
  purchaseDate: string; // ISO String YYYY-MM-DD
  expiryDate?: string; // ISO String YYYY-MM-DD, from AI
}

export interface IngredientNutrition {
  calories: number; // per 100g
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  fiber: number; // grams
  sugar: number; // grams
  sodium: number; // mg
  potassium: number; // mg
  vitamins: {
    [key: string]: number; // vitamin name -> percentage of daily value
  };
  minerals: {
    [key: string]: number; // mineral name -> percentage of daily value
  };
  antioxidants?: string[]; // e.g., ['lycopene', 'beta-carotene']
}

export interface IngredientFreshness {
  goodIndicators: string[]; // e.g., ['firm texture', 'vibrant color']
  badIndicators: string[]; // e.g., ['wrinkled skin', 'soft spots']
  optimalRipeness: string; // description of perfect ripeness
  shelfLife: {
    roomTemp: string; // e.g., '3-5 days'
    refrigerated: string; // e.g., '1-2 weeks'
    frozen?: string; // e.g., '6-12 months'
  };
}

export interface IngredientCompatibility {
  flavorProfile: string[]; // e.g., ['sweet', 'acidic', 'umami']
  cookingMethods: string[]; // e.g., ['raw', 'sautéed', 'roasted']
  pairsWellWith: {
    herbs: string[];
    vegetables: string[];
    proteins: string[];
    grains: string[];
    other: string[];
  };
  avoidPairings?: string[]; // ingredients that don't work well together
}

export interface IngredientHealthBenefits {
  primary: string[]; // main health benefits
  secondary?: string[]; // additional benefits
  warnings?: string[]; // any precautions or allergies
}

export interface DetailedIngredientInfo {
  id: string;
  name: string;
  category: IngredientCategory;
  aliases: string[]; // alternative names
  description: string;
  season: string[]; // e.g., ['summer', 'fall']
  origin: string; // geographical origin
  nutrition: IngredientNutrition;
  freshness: IngredientFreshness;
  compatibility: IngredientCompatibility;
  healthBenefits: IngredientHealthBenefits;
  recipeSuggestions: {
    raw: string[];
    cooked: string[];
    preserved: string[];
  };
  storageInstructions: string;
  preparationTips: string[];
  createdAt: string;
  updatedAt: string;
}

// Extended StoredIngredientItem to include detailed info
export interface EnhancedStoredIngredientItem extends StoredIngredientItem {
  detailedInfo?: DetailedIngredientInfo;
}

// Notification preferences for users
export interface NotificationPreferences {
  id: string;
  user_id: string;
  email_notifications_enabled: boolean;
  expiry_reminder_days: number;
  notification_time: string; // TIME format (HH:MM:SS)
  created_at: string;
  updated_at: string;
}

// Notification log entry
export interface NotificationLog {
  id: string;
  user_id: string;
  ingredient_id?: string;
  notification_type: 'expiry_reminder' | 'test';
  sent_at: string;
  email_sent: boolean;
  error_message?: string;
}
