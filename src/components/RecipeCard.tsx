
"use client";

import type { Recipe } from '@/lib/types';
import { useAppContext } from '@/contexts/SupabaseAppContext';
import { StarRating } from '@/components/StarRating';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Eye, Info, CheckCircle, XCircle, ShoppingCart } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RecipeDisplay } from './RecipeDisplay';

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const { recipeRatings, rateRecipe, isMounted, storedIngredients } = useAppContext();
  const currentRating = recipeRatings[recipe.name] || 0;

  // Calculate missing ingredients
  const missingIngredients = recipe.ingredients.filter(ingredient => {
    // Check if the ingredient is in storage (case-insensitive partial match)
    const hasIngredient = storedIngredients.some(stored => 
      stored.name.toLowerCase().includes(ingredient.toLowerCase()) ||
      ingredient.toLowerCase().includes(stored.name.toLowerCase())
    );
    return !hasIngredient;
  });

  const availableIngredients = recipe.ingredients.filter(ingredient => {
    const hasIngredient = storedIngredients.some(stored => 
      stored.name.toLowerCase().includes(ingredient.toLowerCase()) ||
      ingredient.toLowerCase().includes(stored.name.toLowerCase())
    );
    return hasIngredient;
  });

  const handleRating = (rating: number) => {
    rateRecipe(recipe.name, rating);
  };

  const handleNutritionalInfo = () => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(recipe.name + " nutritional information")}`, "_blank");
  };

  if (!isMounted) {
    return (
      <Card className="flex flex-col h-full min-h-[400px] max-h-[500px] shadow-lg animate-pulse">
        <CardHeader className="flex-shrink-0 pb-3">
          <div className="h-6 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2 mt-1"></div>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden min-h-0 p-4 pt-0">
          <ScrollArea className="h-full">
            <div className="space-y-3 pr-2">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded w-3/4"></div>
                <div className="h-1.5 bg-muted rounded w-full"></div>
                <div className="flex gap-1">
                  <div className="h-5 bg-muted rounded w-16"></div>
                  <div className="h-5 bg-muted rounded w-8"></div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex-shrink-0 flex flex-col sm:flex-row justify-between items-center gap-2 pt-3 border-t bg-muted/20">
          <div className="h-6 bg-muted rounded w-20"></div>
          <div className="flex gap-1">
            <div className="h-7 bg-muted rounded w-12"></div>
            <div className="h-7 bg-muted rounded w-16"></div>
          </div>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className="flex flex-col h-full min-h-[400px] max-h-[500px] shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden bg-card">
      <CardHeader className="flex-shrink-0 pb-3">
        <CardTitle className="text-xl font-semibold text-primary group-hover:text-primary/90 transition-colors line-clamp-2">{recipe.name}</CardTitle>
        <CardDescription className="text-xs text-muted-foreground line-clamp-1">
          {recipe.ingredients.slice(0, 3).join(', ')}{recipe.ingredients.length > 3 ? '...' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden min-h-0 p-4 pt-0">        <ScrollArea className="h-full">
          <div className="space-y-3 pr-2">
            <p className="text-sm text-foreground/80 line-clamp-2 leading-relaxed">
              {recipe.instructions}
            </p>
            
            {/* Ingredient Status - Compact */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-muted-foreground">Ingredients:</span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span className="text-green-600 font-medium">{availableIngredients.length}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <XCircle className="h-3 w-3 text-red-500" />
                    <span className="text-red-500 font-medium">{missingIngredients.length}</span>
                  </div>
                </div>
              </div>
              
              {/* Compact Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-green-500 h-1.5 rounded-full transition-all duration-300" 
                  style={{ 
                    width: `${recipe.ingredients.length > 0 ? (availableIngredients.length / recipe.ingredients.length) * 100 : 0}%` 
                  }}
                ></div>
              </div>
              
              {/* Missing ingredients - More compact */}
              {missingIngredients.length > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <ShoppingCart className="h-3 w-3" />
                    <span>Need:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {missingIngredients.slice(0, 2).map((ingredient, index) => (
                      <Badge key={index} variant="destructive" className="text-xs py-0 px-1.5 h-5">
                        {ingredient.length > 12 ? `${ingredient.substring(0, 12)}...` : ingredient}
                      </Badge>
                    ))}
                    {missingIngredients.length > 2 && (
                      <Badge variant="outline" className="text-xs py-0 px-1.5 h-5">
                        +{missingIngredients.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
              
              {/* All ingredients available - More compact */}
              {missingIngredients.length === 0 && recipe.ingredients.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                  <CheckCircle className="h-3 w-3" />
                  <span>Ready to cook!</span>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex-shrink-0 flex flex-col sm:flex-row justify-between items-center gap-2 pt-3 border-t bg-muted/20">
        <StarRating initialRating={currentRating} onRate={handleRating} size={16} />
        <div className="flex gap-1">
          <Button onClick={handleNutritionalInfo} variant="ghost" size="sm" className="text-xs h-7 px-2">
            <Info size={12} className="mr-1" /> Info
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 text-xs h-7 px-2">
                <Eye size={12} className="mr-1" /> View
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl w-[90vw] max-h-[90vh] p-0">
              <DialogTitle className="sr-only">Recipe Details</DialogTitle>
              <RecipeDisplay recipe={recipe} />
            </DialogContent>
          </Dialog>
        </div>
      </CardFooter>
    </Card>
  );
}

