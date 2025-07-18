"use client";

import type { ReactNode } from "react";
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { Recipe, StoredIngredientItem, MealLog, UserProfile, NutritionalGoals, NutritionalInfo } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from './SupabaseAuthContext';
import { supabase } from '@/lib/supabase';
import { predictExpiry } from "@/ai/flows/predict-expiry-flow";
import { getPersonalizedGoals, UserProfile as AIUserProfile } from "@/ai/flows/get-personalized-goals-flow";
import { format, isToday, parseISO } from "date-fns";

const DEFAULT_GOALS: NutritionalGoals = {
    calories: 2000,
    protein: 100,
    carbs: 250,
    fat: 80,
};

const DEFAULT_PROFILE: UserProfile = {
    height: 0,
    weight: 0,
    role: 'user',
};

interface AppContextType {
  storedIngredients: StoredIngredientItem[];
  addStoredIngredient: (item: Omit<StoredIngredientItem, 'id' | 'expiryDate'> & { expiryDate?: string }) => Promise<boolean>;
  removeStoredIngredient: (id: string) => Promise<void>;
  
  preferredIngredients: string[];
  togglePreferredIngredient: (ingredient: string) => Promise<void>;
  clearPreferredIngredients: () => Promise<void>;
  
  recommendedRecipes: Recipe[];
  setRecommendedRecipes: (recipes: Recipe[]) => void;
  clearRecommendedRecipes: () => void;
  
  recipeRatings: Record<string, number>;
  rateRecipe: (recipeName: string, rating: number) => void;

  userProfile: UserProfile;
  nutritionalGoals: NutritionalGoals;
  dailyIntake: NutritionalInfo;
  recentMeals: MealLog[];
  logMeal: (recipe: Recipe, nutritionalInfo: NutritionalInfo) => Promise<void>;
  updateUserProfileAndGoals: (profileData: Pick<UserProfile, 'height' | 'weight'> & { age?: number | undefined; gender?: 'male' | 'female' | 'other' | undefined }) => Promise<void>;
  updateUserRole: (userId: string, role: 'user' | 'admin') => Promise<void>;
  
  isContextLoading: boolean;
  setIsContextLoading: (loading: boolean) => void;
  isMounted: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  RECIPE_RATINGS: 'homeplate_recipeRatings',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isMounted, setIsMounted] = useState(false);
  const [isContextLoading, setIsContextLoading] = useState<boolean>(true);

  // Core Data
  const [storedIngredients, setStoredIngredients] = useState<StoredIngredientItem[]>([]);
  const [preferredIngredients, setPreferredIngredients] = useState<string[]>([]);
  
  // Recipe Finder Data
  const [recommendedRecipes, setRecommendedRecipes] = useState<Recipe[]>([]);
  const [recipeRatings, setRecipeRatings] = useState<Record<string, number>>({});
  
  // Nutrition Data
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [nutritionalGoals, setNutritionalGoals] = useState<NutritionalGoals>(DEFAULT_GOALS);
  const [recentMeals, setRecentMeals] = useState<MealLog[]>([]);

  // Derived State: Calculate daily intake from recent meals whenever they change.
  const dailyIntake = useMemo(() => {
    return recentMeals
      .filter(meal => isToday(parseISO(meal.loggedAt)))
      .reduce((acc, meal) => {
        acc.calories += meal.calories;
        acc.protein += meal.protein;
        acc.carbs += meal.carbs;
        acc.fat += meal.fat;
        return acc;
      }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }, [recentMeals]);
  
  useEffect(() => {
    setIsMounted(true);
    try {
      const ratings = localStorage.getItem(LOCAL_STORAGE_KEYS.RECIPE_RATINGS);
      if (ratings) setRecipeRatings(JSON.parse(ratings));
    } catch (error) {
      console.error("Failed to load ratings from localStorage", error);
    }
  }, []);
  
  const fetchUserData = useCallback(async (userId: string) => {
    setIsContextLoading(true);
    try {
      // Fetch all user data in parallel
      const [
        { data: storedIngredientsData, error: storageError },
        { data: preferredIngredientsData, error: preferencesError },
        { data: profileData, error: profileError },
        { data: goalsData, error: goalsError },
        { data: mealLogsData, error: mealsError }
      ] = await Promise.all([
        supabase
          .from('stored_ingredients')
          .select('*')
          .eq('user_id', userId)
          .order('purchase_date', { ascending: false }),
        supabase
          .from('preferred_ingredients')
          .select('ingredient_name')
          .eq('user_id', userId),
        supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', userId)
          .single(),
        supabase
          .from('nutritional_goals')
          .select('*')
          .eq('user_id', userId)
          .single(),
        supabase
          .from('meal_logs')
          .select('*')
          .eq('user_id', userId)
          .order('logged_at', { ascending: false })
          .limit(50) // Limit to recent meals
      ]);

      // Handle errors gracefully - tables might not exist yet
      if (storageError && storageError.code !== 'PGRST116' && !storageError.message?.includes('does not exist')) {
        console.error('Storage error:', storageError);
      }
      if (preferencesError && preferencesError.code !== 'PGRST116' && !preferencesError.message?.includes('does not exist')) {
        console.error('Preferences error:', preferencesError);
      }
      if (profileError && profileError.code !== 'PGRST116' && !profileError.message?.includes('does not exist')) {
        console.error('Profile error:', profileError);
      }
      if (goalsError && goalsError.code !== 'PGRST116' && !goalsError.message?.includes('does not exist')) {
        console.error('Goals error:', goalsError);
      }
      if (mealsError && mealsError.code !== 'PGRST116' && !mealsError.message?.includes('does not exist')) {
        console.error('Meals error:', mealsError);
      }

      // Transform and set data
      const transformedIngredients = storedIngredientsData?.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        location: item.location,
        quantity: item.quantity,
        unit: item.unit,
        purchaseDate: item.purchase_date,
        expiryDate: item.expiry_date
      })) || [];

      const transformedMeals = mealLogsData?.map(meal => ({
        id: meal.id,
        name: meal.recipe_name,
        ingredients: meal.ingredients,
        instructions: meal.instructions,
        url: meal.url,
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat,
        loggedAt: meal.logged_at
      })) || [];

      setStoredIngredients(transformedIngredients);
      setPreferredIngredients(preferredIngredientsData?.map(p => p.ingredient_name) || []);
      setUserProfile(profileData ? {
        height: profileData.height,
        weight: profileData.weight,
        age: profileData.age,
        gender: profileData.gender,
        role: profileData.role
      } : DEFAULT_PROFILE);
      setNutritionalGoals(goalsData ? {
        calories: goalsData.calories,
        protein: goalsData.protein,
        carbs: goalsData.carbs,
        fat: goalsData.fat
      } : DEFAULT_GOALS);
      setRecentMeals(transformedMeals);

    } catch (error) {
      console.error("Error fetching user data:", error);
      toast({ title: "Error", description: "Could not load your data from the cloud.", variant: "destructive" });
    } finally {
      setIsContextLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (isMounted && user) {
      fetchUserData(user.id);
    } else if (isMounted && !user) {
      // Clear all user-specific data on logout
      setStoredIngredients([]);
      setPreferredIngredients([]);
      setRecommendedRecipes([]);
      setUserProfile(DEFAULT_PROFILE);
      setNutritionalGoals(DEFAULT_GOALS);
      setRecentMeals([]);
      setIsContextLoading(false);
    }
  }, [isMounted, user, fetchUserData]);
  
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.RECIPE_RATINGS, JSON.stringify(recipeRatings));
    }
  }, [recipeRatings, isMounted]);

  const addStoredIngredient = useCallback(async (item: Omit<StoredIngredientItem, 'id' | 'expiryDate'> & { expiryDate?: string }): Promise<boolean> => {
    if (!user) {
      toast({ title: "Not Logged In", description: "Please log in to save ingredients.", variant: "destructive" });
      return false;
    }
    setIsContextLoading(true);
    try {
      const finalExpiryDate = item.expiryDate 
        ? item.expiryDate
        : (await predictExpiry({
            name: item.name,
            category: item.category,
            location: item.location,
            purchaseDate: format(new Date(item.purchaseDate), 'yyyy-MM-dd'),
          })).expiryDate;

      const { data, error } = await supabase
        .from('stored_ingredients')
        .insert({
          user_id: user.id,
          name: item.name,
          category: item.category,
          location: item.location,
          quantity: item.quantity,
          unit: item.unit,
          purchase_date: item.purchaseDate,
          expiry_date: finalExpiryDate
        })
        .select()
        .single();

      if (error) throw error;

      const newItem: StoredIngredientItem = {
        id: data.id,
        name: data.name,
        category: data.category,
        location: data.location,
        quantity: data.quantity,
        unit: data.unit,
        purchaseDate: data.purchase_date,
        expiryDate: data.expiry_date
      };

      setStoredIngredients(prev => [...prev, newItem].sort((a, b) => new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime()));
      toast({ title: "Item Added", description: `${item.name} has been added.` });
      return true;
    } catch (error) {
      console.error("Error adding stored ingredient:", error);
      toast({ title: "Error", description: `Could not save item.`, variant: "destructive" });
      return false;
    } finally {
      setIsContextLoading(false);
    }
  }, [user, toast]);

  const removeStoredIngredient = useCallback(async (id: string) => {
    if (!user) return;
    const itemToRemove = storedIngredients.find(i => i.id === id);
    if (!itemToRemove) return;
    setIsContextLoading(true);
    try {
      const { error } = await supabase
        .from('stored_ingredients')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setStoredIngredients(prev => prev.filter(i => i.id !== id));
      toast({ title: "Item Removed", description: `${itemToRemove.name} removed.` });
    } catch (error) {
      console.error("Error removing stored ingredient:", error);
      toast({ title: "Error", description: "Could not remove item.", variant: "destructive" });
    } finally {
      setIsContextLoading(false);
    }
  }, [user, storedIngredients, toast]);

  const logMeal = useCallback(async (recipe: Recipe, nutritionalInfo: NutritionalInfo) => {
    if (!user) {
      toast({ title: "Not Logged In", description: "Please log in to log a meal.", variant: "destructive" });
      return;
    }
    setIsContextLoading(true);
    try {
      const loggedAt = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('meal_logs')
        .insert({
          user_id: user.id,
          recipe_name: recipe.name,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          url: recipe.url,
          calories: nutritionalInfo.calories,
          protein: nutritionalInfo.protein,
          carbs: nutritionalInfo.carbs,
          fat: nutritionalInfo.fat,
          logged_at: loggedAt
        })
        .select()
        .single();

      if (error) throw error;

      const newMeal: MealLog = {
        id: data.id,
        name: data.recipe_name,
        ingredients: data.ingredients,
        instructions: data.instructions,
        url: data.url,
        calories: data.calories,
        protein: data.protein,
        carbs: data.carbs,
        fat: data.fat,
        loggedAt: data.logged_at
      };
      
      setRecentMeals(prevMeals => [newMeal, ...prevMeals].sort((a,b) => parseISO(b.loggedAt).getTime() - parseISO(a.loggedAt).getTime()));

      toast({ title: "Meal Logged!", description: `${recipe.name} added to your daily intake.` });
    } catch (error) {
      console.error("Error logging meal:", error);
      toast({ title: "Error", description: "Could not log meal.", variant: "destructive" });
    } finally {
      setIsContextLoading(false);
    }
  }, [user, toast]);

  const updateUserProfileAndGoals = useCallback(async (profileData: Pick<UserProfile, 'height' | 'weight'> & { age?: number | undefined; gender?: 'male' | 'female' | 'other' | undefined }) => {
    if (!user) {
      toast({ title: "Not Logged In", description: "Please log in to update your profile.", variant: "destructive" });
      return;
    }
    setIsContextLoading(true);
    try {
      console.log('Starting profile update with data:', profileData);
      
      const fullProfileForGoals: UserProfile = {
        ...userProfile,
        ...profileData,
      };

      // Prepare profile data for AI with safe defaults
      const aiProfileData: AIUserProfile = {
        height: profileData.height,
        weight: profileData.weight,
        age: profileData.age || fullProfileForGoals.age || 30, // Use provided age, existing age, or default
        gender: profileData.gender || fullProfileForGoals.gender || 'female', // Use provided gender, existing gender, or default
      };

      console.log('AI profile data prepared:', aiProfileData);
      
      let goals;
      try {
        goals = await getPersonalizedGoals(aiProfileData);
        console.log('AI goals received:', goals);
      } catch (aiError) {
        console.error('AI goals error:', aiError);
        console.error('AI error details:', {
          message: (aiError as Error)?.message,
          stack: (aiError as Error)?.stack,
          name: (aiError as Error)?.name,
          cause: (aiError as Error)?.cause
        });
        throw new Error(`AI goal calculation failed: ${(aiError as Error)?.message || 'Unknown AI error'}`);
      }
      
      // Prepare profile data with safe defaults for database
      const profileInsertData = {
        user_id: user.id,
        height: profileData.height,
        weight: profileData.weight,
        age: profileData.age !== undefined ? profileData.age : fullProfileForGoals.age || null, // Use provided age or existing
        gender: profileData.gender !== undefined ? profileData.gender : fullProfileForGoals.gender || null, // Use provided gender or existing
        role: fullProfileForGoals.role || 'user'
      };

      console.log('Inserting profile data:', profileInsertData);
      
      // Update or insert profile
      const { error: profileError, data: profileResult } = await supabase
        .from('user_profiles')
        .upsert(profileInsertData, {
          onConflict: 'user_id',
          ignoreDuplicates: false
        })
        .select();

      if (profileError) {
        console.error('Profile upsert error:', profileError);
        console.error('Profile error details:', {
          message: profileError.message,
          details: profileError.details,
          hint: profileError.hint,
          code: profileError.code
        });
        throw new Error(`Profile update failed: ${profileError.message || profileError.details || 'Unknown database error'}`);
      }

      console.log('Profile upsert result:', profileResult);

      // Prepare goals data
      const goalsInsertData = {
        user_id: user.id,
        calories: goals.calories,
        protein: goals.protein,
        carbs: goals.carbs,
        fat: goals.fat
      };

      console.log('Inserting goals data:', goalsInsertData);

      // Update or insert goals
      const { error: goalsError, data: goalsResult } = await supabase
        .from('nutritional_goals')
        .upsert(goalsInsertData, {
          onConflict: 'user_id',
          ignoreDuplicates: false
        })
        .select();

      if (goalsError) {
        console.error('Goals upsert error:', goalsError);
        console.error('Goals error details:', {
          message: goalsError.message,
          details: goalsError.details,
          hint: goalsError.hint,
          code: goalsError.code
        });
        throw new Error(`Goals update failed: ${goalsError.message || goalsError.details || 'Unknown database error'}`);
      }

      console.log('Goals upsert result:', goalsResult);

      setUserProfile(prev => ({ ...prev, ...profileData }));
      setNutritionalGoals(goals);
      toast({ title: "Profile Updated!", description: "Your nutritional goals have been personalized." });
    } catch (error) {
      console.error("Error updating profile and goals:", error);
      console.error("Full error object:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
      
      // Extract error message with better fallbacks
      let errorMessage = 'Unknown error occurred';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object') {
        const errorObj = error as any;
        errorMessage = errorObj.message || errorObj.details || errorObj.hint || JSON.stringify(error);
      }
      
      toast({ 
        title: "Error", 
        description: `Could not update your profile: ${errorMessage}`, 
        variant: "destructive" 
      });
    } finally {
      setIsContextLoading(false);
    }
  }, [user, toast, userProfile]);

  const updateUserRole = useCallback(async (userId: string, role: 'user' | 'admin') => {
    if (!user) {
      toast({ title: "Not Logged In", description: "Please log in to update user roles.", variant: "destructive" });
      return;
    }

    // Check if current user is admin
    if (userProfile.role !== 'admin') {
      toast({ title: "Access Denied", description: "Only admins can update user roles.", variant: "destructive" });
      return;
    }

    setIsContextLoading(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ role })
        .eq('user_id', userId);

      if (error) throw error;
      
      toast({ title: "Role Updated", description: `User role has been updated to ${role}.` });
      
      // If updating own role, refresh user profile
      if (userId === user.id) {
        setUserProfile(prev => ({ ...prev, role }));
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      toast({ title: "Error", description: "Could not update user role.", variant: "destructive" });
    } finally {
      setIsContextLoading(false);
    }
  }, [user, toast, userProfile]);

  const togglePreferredIngredient = useCallback(async (ingredientName: string) => {
    if (!user) {
      toast({ title: "Not Logged In", description: "Please log in to save preferences.", variant: "destructive" });
      return;
    }

    const isCurrentlyPreferred = preferredIngredients.includes(ingredientName);
    
    try {
      if (isCurrentlyPreferred) {
        // Remove from preferred
        const { error } = await supabase
          .from('preferred_ingredients')
          .delete()
          .eq('user_id', user.id)
          .eq('ingredient_name', ingredientName);

        if (error) throw error;

        setPreferredIngredients(prev => prev.filter(ing => ing !== ingredientName));
        toast({ title: "Preference Updated", description: `${ingredientName} removed from favorites.` });
      } else {
        // Add to preferred
        const { error } = await supabase
          .from('preferred_ingredients')
          .insert({
            user_id: user.id,
            ingredient_name: ingredientName
          });

        if (error) throw error;

        setPreferredIngredients(prev => [...prev, ingredientName]);
        toast({ title: "Preference Updated", description: `${ingredientName} added to favorites.` });
      }
    } catch (error) {
      console.error("Error updating preferred ingredient:", error);
      toast({ title: "Error", description: "Could not update preference.", variant: "destructive" });
    }
  }, [user, preferredIngredients, toast]);

  const clearPreferredIngredients = useCallback(async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('preferred_ingredients')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setPreferredIngredients([]);
      toast({ title: "Preferences Cleared", description: "All favorite ingredients have been removed." });
    } catch (error) {
      console.error("Error clearing preferred ingredients:", error);
      toast({ title: "Error", description: "Could not clear preferences.", variant: "destructive" });
    }
  }, [user, toast]);

  const clearRecommendedRecipes = useCallback(() => setRecommendedRecipes([]), []);
  const rateRecipe = useCallback((recipeName: string, rating: number) => setRecipeRatings(prev => ({ ...prev, [recipeName]: rating })), []);

  return (
    <AppContext.Provider value={{
      storedIngredients, addStoredIngredient, removeStoredIngredient,
      preferredIngredients, togglePreferredIngredient, clearPreferredIngredients,
      recommendedRecipes, setRecommendedRecipes, clearRecommendedRecipes,
      recipeRatings, rateRecipe,
      userProfile, nutritionalGoals, dailyIntake, recentMeals, logMeal, updateUserProfileAndGoals, updateUserRole,
      isContextLoading, setIsContextLoading,
      isMounted
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
