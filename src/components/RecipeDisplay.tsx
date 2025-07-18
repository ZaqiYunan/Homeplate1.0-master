
"use client";

import React, { useState } from 'react';
import type { Recipe, NutritionalInfo } from '@/lib/types';
import { CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, List, BookCheck, Loader2, Sparkles, AlertTriangle, Flame, Zap, Droplets, Pizza, CheckCircle, XCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppContext } from '@/contexts/SupabaseAppContext';
import { getNutritionalInfo } from '@/ai/flows/get-nutritional-info-flow';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface RecipeDisplayProps {
  recipe: Recipe;
}

const NutritionDetail = ({ label, value, unit, icon: Icon }: { label: string, value: number, unit: string, icon: React.ElementType }) => (
    <div className="flex items-center justify-between text-sm p-2 rounded-md bg-muted/50">
        <div className="flex items-center gap-2 font-medium">
            <Icon className="h-4 w-4 text-primary" />
            <span>{label}</span>
        </div>
        <span>{Math.round(value)} {unit}</span>
    </div>
);

export function RecipeDisplay({ recipe }: RecipeDisplayProps) {
  const { logMeal, isContextLoading, setIsContextLoading, storedIngredients } = useAppContext();
  const { toast } = useToast();
  const [nutritionalInfo, setNutritionalInfo] = useState<NutritionalInfo | null>(null);

  // Calculate ingredient availability
  const ingredientStatus = recipe.ingredients.map(ingredient => {
    const isAvailable = storedIngredients.some(stored => 
      stored.name.toLowerCase().includes(ingredient.toLowerCase()) ||
      ingredient.toLowerCase().includes(stored.name.toLowerCase())
    );
    return { ingredient, isAvailable };
  });

  const availableCount = ingredientStatus.filter(item => item.isAvailable).length;
  const missingIngredients = ingredientStatus.filter(item => !item.isAvailable).map(item => item.ingredient);

  const handleFetchNutrition = async () => {
    setIsContextLoading(true);
    try {
        const info = await getNutritionalInfo({ name: recipe.name, ingredients: recipe.ingredients });
        setNutritionalInfo(info);
        toast({ title: "Nutrition Analyzed", description: "Estimated nutritional information is now available." });
    } catch (e) {
        console.error("Error fetching nutritional info:", e);
        toast({ title: "Error", description: "Could not fetch nutritional information.", variant: "destructive" });
    } finally {
        setIsContextLoading(false);
    }
  };

  const handleLogMeal = async () => {
    if (!nutritionalInfo) {
      toast({ title: "Error", description: "Please analyze nutrition before logging.", variant: "destructive" });
      return;
    }
    await logMeal(recipe, nutritionalInfo);
  };
  
  const openRecipeUrl = () => {
    if (recipe.url) {
      window.open(recipe.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <CardHeader className="border-b">
        <CardTitle className="text-3xl font-bold text-primary">{recipe.name}</CardTitle>
        {recipe.url && (
          <button onClick={openRecipeUrl} className="text-sm text-accent hover:underline flex items-center gap-1">
            View Original Recipe <ExternalLink size={14} />
          </button>
        )}
      </CardHeader>
      <ScrollArea className="flex-grow">
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-secondary-foreground flex items-center gap-2">
                <List size={20}/>Ingredients
              </h3>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-green-600 font-medium">{availableCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-red-500 font-medium">{missingIngredients.length}</span>
                </div>
              </div>
            </div>
            
            {/* Ingredient availability status */}
            {missingIngredients.length > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Missing Ingredients ({missingIngredients.length})</AlertTitle>
                <AlertDescription>
                  You'll need to get: <strong>{missingIngredients.join(', ')}</strong>
                </AlertDescription>
              </Alert>
            )}
            
            {missingIngredients.length === 0 && recipe.ingredients.length > 0 && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">All Ingredients Available!</AlertTitle>
                <AlertDescription className="text-green-700">
                  You have everything needed to make this recipe.
                </AlertDescription>
              </Alert>
            )}

            <ul className="list-none space-y-2 text-foreground/90">
              {ingredientStatus.map((item, index) => (
                <li key={index} className="flex items-center gap-2 p-2 rounded-md bg-muted/30">
                  {item.isAvailable ? (
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                  )}
                  <span className={item.isAvailable ? 'text-foreground' : 'text-muted-foreground'}>
                    {item.ingredient}
                  </span>
                  {!item.isAvailable && (
                    <Badge variant="outline" className="ml-auto text-xs">
                      Need to buy
                    </Badge>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-secondary-foreground mb-2">Instructions</h3>
            <div 
              className="prose prose-sm max-w-none text-foreground/90 whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: recipe.instructions.replace(/\n/g, '<br />') }} 
            />
          </div>

          {nutritionalInfo && (
            <div>
              <h3 className="text-xl font-semibold text-secondary-foreground mb-2">Estimated Nutrition</h3>
              <div className="grid grid-cols-2 gap-3">
                  <NutritionDetail label="Calories" value={nutritionalInfo.calories} unit="kcal" icon={Flame} />
                  <NutritionDetail label="Protein" value={nutritionalInfo.protein} unit="g" icon={Zap} />
                  <NutritionDetail label="Carbs" value={nutritionalInfo.carbs} unit="g" icon={Pizza} />
                  <NutritionDetail label="Fat" value={nutritionalInfo.fat} unit="g" icon={Droplets} />
              </div>
            </div>
          )}

        </CardContent>
      </ScrollArea>
      <CardFooter className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t gap-2 bg-muted/50">
        {!nutritionalInfo ? (
            <Button onClick={handleFetchNutrition} disabled={isContextLoading} className="w-full">
                {isContextLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Analyze Nutrition
            </Button>
        ) : (
            <Button onClick={handleLogMeal} disabled={isContextLoading} className="w-full">
                {isContextLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BookCheck className="mr-2 h-4 w-4" />}
                Log This Meal
            </Button>
        )}
      </CardFooter>
    </div>
  );
}
