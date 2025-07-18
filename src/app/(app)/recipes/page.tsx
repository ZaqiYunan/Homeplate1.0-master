"use client";

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useAppContext } from '@/contexts/SupabaseAppContext';
import { RecipeCard } from '@/components/RecipeCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { recommendRecipes, RecommendRecipesInput } from '@/ai/flows/recommend-recipes';
import { Loader2, AlertTriangle, Info, Zap, ChefHat, Search, Warehouse } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cuisineDescriptions } from '@/lib/sample-recipes';

// Helper function to get cuisine context for AI recommendations
const getCuisineContext = (cuisine: string | null | undefined) => {
  if (!cuisine || cuisine === 'all') return '';
  
  const descriptions = {
    western: 'European, American, and Mediterranean',
    asian: 'Chinese, Japanese, Thai, Korean, and Indian',
    indonesian: 'Traditional Indonesian'
  };
  
  return descriptions[cuisine as keyof typeof descriptions] || cuisine;
};

function HomePageContent() {
  const {
    storedIngredients,
    recommendedRecipes,
    setRecommendedRecipes,
    isContextLoading,
    setIsContextLoading,
    isMounted,
    clearRecommendedRecipes,
  } = useAppContext();
  
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialMode = searchParams.get('mode') as 'storage' | 'query' || 'storage';
  const initialQuery = searchParams.get('query') || '';
  const initialCuisine = searchParams.get('cuisine') || 'indonesian';

  const [mode, setMode] = useState<'storage' | 'query'>(initialMode);
  const [query, setQuery] = useState(initialQuery);
  const [selectedStorageIngredients, setSelectedStorageIngredients] = useState<string[]>([]);
  const [selectedCuisine, setSelectedCuisine] = useState<string>(initialCuisine);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [hasAutoSearched, setHasAutoSearched] = useState(false);

  // Cuisine options - Limited to Western, Asian, and Indonesian
  const cuisineOptions = [
    { value: 'all', label: 'All Cuisines' },
    { value: 'western', label: 'Western' },
    { value: 'asian', label: 'Asian' },
    { value: 'indonesian', label: 'Indonesian' },
  ];

  const handleFindRecipes = useCallback(async (options: { searchMode: 'storage' | 'query'; query?: string; ingredients: string[]; cuisine?: string }) => {
    setError(null);
    clearRecommendedRecipes();

    const { searchMode, query, ingredients, cuisine } = options;
    let input: RecommendRecipesInput;

    // Build the query with cuisine filter if selected
    let finalQuery = query || '';
    if (cuisine && cuisine !== 'all') {
      let cuisineDescription = '';
      
      switch (cuisine) {
        case 'western':
          cuisineDescription = 'Western (European, American, Mediterranean)';
          break;
        case 'asian':
          cuisineDescription = 'Asian (Chinese, Japanese, Korean, Thai, Vietnamese, Indian)';
          break;
        case 'indonesian':
          cuisineDescription = 'Indonesian';
          break;
        default:
          cuisineDescription = cuisineOptions.find(opt => opt.value === cuisine)?.label || cuisine;
      }
      
      if (searchMode === 'storage') {
        finalQuery = `${cuisineDescription} recipes`;
      } else {
        finalQuery = finalQuery ? `${finalQuery} (${cuisineDescription} cuisine)` : `${cuisineDescription} recipes`;
      }
    }

    if (searchMode === 'storage') {
      if (ingredients.length === 0) {
        const msg = "Please select ingredients from your storage to find recipes.";
        setError(msg);
        toast({ title: "No Ingredients Selected", description: msg, variant: "destructive" });
        return;
      }
      input = { 
        ingredients: ingredients, 
        query: finalQuery, 
        cuisine: cuisine && cuisine !== 'all' ? cuisine : undefined,
        strictMode: true, 
        numRecipes: 6 
      };
    } else { // mode === 'query'
      if (!finalQuery.trim()) {
        const msg = "Please enter what you want to cook.";
        setError(msg);
        toast({ title: "Empty Search", description: msg, variant: "destructive" });
        return;
      }
      input = { 
        ingredients: [], 
        query: finalQuery, 
        cuisine: cuisine && cuisine !== 'all' ? cuisine : undefined,
        strictMode: false, 
        numRecipes: 6 
      };
    }

    setIsContextLoading(true);
    try {
      const result = await recommendRecipes(input);
      setRecommendedRecipes(result.recipes);
      if (result.recipes.length === 0) {
        toast({
            title: "No Recipes Found",
            description: "Try selecting different ingredients or changing your search query.",
        });
      } else {
         const cuisineContext = getCuisineContext(cuisine);
         const description = cuisineContext 
           ? `Found ${result.recipes.length} delicious ${cuisineContext} recipes for you!`
           : `Found ${result.recipes.length} delicious ideas for you.`;
         
         toast({
            title: "Recipes Found!",
            description: description,
        });
      }
    } catch (e) {
      console.error("Error fetching recipes:", e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(`Failed to fetch recipes: ${errorMessage}`);
      toast({
        title: "Recipe Search Failed",
        description: `Could not fetch recipes. ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsContextLoading(false);
    }
  }, [clearRecommendedRecipes, setRecommendedRecipes, setIsContextLoading, storedIngredients, toast]);

  useEffect(() => {
    // Pre-select ingredient when in storage mode with a query (from individual ingredient buttons)
    if (initialMode === 'storage' && initialQuery && isMounted && selectedStorageIngredients.length === 0) {
      const ingredientToSelect = storedIngredients.find(item => 
        item.name.toLowerCase() === initialQuery.toLowerCase()
      );
      if (ingredientToSelect) {
        setSelectedStorageIngredients([ingredientToSelect.name]);
      }
    }
  }, [initialMode, initialQuery, isMounted, storedIngredients, selectedStorageIngredients.length]);

  useEffect(() => {
    // Automatically search if navigated with query params, but only once.
    if (initialQuery && isMounted && !hasAutoSearched) {
      let searchIngredients: string[] = [];
      
      if (initialMode === 'storage') {
        // For storage mode with query, use the specific ingredient
        const ingredientToUse = storedIngredients.find(item => 
          item.name.toLowerCase() === initialQuery.toLowerCase()
        );
        searchIngredients = ingredientToUse ? [ingredientToUse.name] : [];
      } else {
        // For query mode, use empty array (no storage ingredients)
        searchIngredients = [];
      }
      
      handleFindRecipes({ searchMode: initialMode, query: initialQuery, ingredients: searchIngredients, cuisine: initialCuisine });
      setHasAutoSearched(true);
    }
  }, [initialQuery, initialMode, initialCuisine, isMounted, hasAutoSearched, handleFindRecipes, storedIngredients]);


  const handleModeChange = (newMode: 'storage' | 'query') => {
    setMode(newMode);
    clearRecommendedRecipes();
    setError(null);
    if (newMode !== 'query') {
        setQuery('');
    }
    setSelectedStorageIngredients([]);
    setSelectedCuisine('all');
    // Clear the URL query params but stay on recipes page
    router.replace('/recipes');
  };
  
  const handleIngredientSelection = (ingredientName: string, isSelected: boolean) => {
    setSelectedStorageIngredients(prev => {
      if (isSelected) {
        return [...prev, ingredientName];
      } else {
        return prev.filter(name => name !== ingredientName);
      }
    });
  };

  const handleManualSearch = () => {
    const searchIngredients = mode === 'storage' ? selectedStorageIngredients : [];
    handleFindRecipes({ searchMode: mode, query, ingredients: searchIngredients, cuisine: selectedCuisine });
    // Update URL to be bookmarkable/shareable
    const newUrl = `/recipes?mode=${mode}${query ? `&query=${encodeURIComponent(query)}` : ''}${selectedCuisine ? `&cuisine=${selectedCuisine}` : ''}`;
    router.push(newUrl, { scroll: false });
  };


  if (!isMounted) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const storedIngredientNames = storedIngredients.map(item => item.name);
  const isSearchDisabled = isContextLoading || (mode === 'storage' && selectedStorageIngredients.length === 0) || (mode === 'query' && !query.trim());

  return (
    <div className="space-y-8">
      <Card className="shadow-xl bg-gradient-to-br from-primary/10 via-background to-background">
        <CardHeader>
          <CardTitle className="text-3xl md:text-4xl font-extrabold tracking-tight text-primary flex items-center">
            <Zap size={36} className="mr-3 text-accent"/>
            AI Recipe Finder
          </CardTitle>
          <CardDescription className="text-lg text-foreground/80">
            Discover your next meal. Use your available ingredients or search for something new!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={mode} onValueChange={(value: string) => handleModeChange(value as 'storage' | 'query')} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="storage" className="gap-2"><Warehouse /> Use My Storage</TabsTrigger>
              <TabsTrigger value="query" className="gap-2"><Search /> Find a Recipe</TabsTrigger>
            </TabsList>
            <TabsContent value="storage" className="mt-4 p-4 bg-card rounded-md border">
              <CardTitle className="text-lg">What can I make now?</CardTitle>
              <CardDescription className="mb-4">Select ingredients you have in storage to find recipes.</CardDescription>
              {storedIngredients.length > 0 ? (
                <>
                  <div className="flex gap-2 mb-4">
                    <Button size="sm" variant="outline" onClick={() => setSelectedStorageIngredients(storedIngredientNames)}>Select All</Button>
                    <Button size="sm" variant="outline" onClick={() => setSelectedStorageIngredients([])}>Clear Selection</Button>
                  </div>
                  <ScrollArea className="h-40 w-full rounded-md border p-4">
                      <div className="space-y-2">
                          {storedIngredients.map(item => (
                              <div key={item.id} className="flex items-center space-x-2">
                                  <Checkbox
                                      id={`ing-${item.id}`}
                                      checked={selectedStorageIngredients.includes(item.name)}
                                      onCheckedChange={(checked: boolean) => handleIngredientSelection(item.name, !!checked)}
                                  />
                                  <Label
                                      htmlFor={`ing-${item.id}`}
                                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                      {item.name}
                                  </Label>
                              </div>
                          ))}
                      </div>
                  </ScrollArea>
                </>
              ): (
                <div className="text-center py-4">
                  <ChefHat size={32} className="mx-auto text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">Your storage is empty.</p>
                  <Button variant="secondary" size="sm" className="mt-2" onClick={() => router.push('/storage/add')}>Add an Item</Button>
                </div>
              )}
            </TabsContent>
            <TabsContent value="query" className="mt-4 p-4 bg-card rounded-md border">
               <CardTitle className="text-lg">What do you want to cook?</CardTitle>
              <CardDescription className="mb-4">Search for a dish, and we'll create recipes, using your stored items where possible.</CardDescription>
              <Input 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., 'Quick chicken dinner' or 'vegetarian pasta'"
                className="text-base"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleManualSearch();
                  }
                }}
              />
            </TabsContent>
          </Tabs>
          
          {/* Cuisine Filter */}
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <ChefHat className="h-5 w-5" />
                Cuisine Preference
              </CardTitle>
              <CardDescription>
                Choose your preferred cuisine style for personalized recipe recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {cuisineOptions.map((cuisine) => (
                  <Button
                    key={cuisine.value}
                    variant={selectedCuisine === cuisine.value ? 'default' : 'outline'}
                    onClick={() => setSelectedCuisine(cuisine.value)}
                    className={`h-auto p-4 flex flex-col items-center justify-center space-y-2 ${
                      selectedCuisine === cuisine.value 
                        ? 'bg-primary text-primary-foreground shadow-lg' 
                        : 'hover:bg-primary/10'
                    }`}
                  >
                    <span className="font-semibold text-sm">{cuisine.label}</span>
                    {cuisine.value === 'western' && (
                      <span className="text-xs opacity-80 text-center">
                        European, American, Mediterranean
                      </span>
                    )}
                    {cuisine.value === 'asian' && (
                      <span className="text-xs opacity-80 text-center">
                        Chinese, Japanese, Thai, Korean, Indian
                      </span>
                    )}
                    {cuisine.value === 'indonesian' && (
                      <span className="text-xs opacity-80 text-center">
                        Nasi, Rendang, Satay, Gado-gado
                      </span>
                    )}
                    {cuisine.value === 'all' && (
                      <span className="text-xs opacity-80 text-center">
                        No cuisine preference
                      </span>
                    )}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cuisine Information */}
          {selectedCuisine !== 'all' && cuisineDescriptions[selectedCuisine as keyof typeof cuisineDescriptions] && (
            <Card className="border-amber-200 bg-amber-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-amber-800">
                  About {cuisineDescriptions[selectedCuisine as keyof typeof cuisineDescriptions].name} Cuisine
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-amber-700 mb-3">
                  {cuisineDescriptions[selectedCuisine as keyof typeof cuisineDescriptions].description}
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <h4 className="font-semibold text-amber-800 mb-2">Key Characteristics:</h4>
                    <ul className="space-y-1 text-amber-700">
                      {cuisineDescriptions[selectedCuisine as keyof typeof cuisineDescriptions].characteristics.map((char, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="mr-2">•</span>
                          {char}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-amber-800 mb-2">Popular Ingredients:</h4>
                    <div className="flex flex-wrap gap-1">
                      {cuisineDescriptions[selectedCuisine as keyof typeof cuisineDescriptions].popularIngredients.slice(0, 8).map((ingredient, idx) => (
                        <span key={idx} className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Button 
            onClick={handleManualSearch} 
            disabled={isSearchDisabled}
            size="lg" 
            className="w-full text-base py-3 shadow-md hover:shadow-lg transition-shadow"
          >
            {isContextLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Zap className="mr-2 h-5 w-5" />
            )}
            {isContextLoading 
              ? "Finding Recipes..." 
              : selectedCuisine === 'all' 
                ? "Generate Recipe Ideas" 
                : `Find ${cuisineOptions.find(c => c.value === selectedCuisine)?.label} Recipes`
            } 
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="shadow-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {recommendedRecipes.length === 0 && !isContextLoading && !error && (
         <Alert className="shadow-md bg-card">
            <Info className="h-4 w-4" />
            <AlertTitle>Ready to Search?</AlertTitle>
            <AlertDescription>
              Configure your search above and click "Generate Recipe Ideas" to discover what you can make.
            </AlertDescription>
          </Alert>
      )}
      
      {recommendedRecipes.length > 0 && (
        <section aria-labelledby="recipe-results-title" className="space-y-6">
          <Separator />
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="space-y-1">
              <h2 id="recipe-results-title" className="text-2xl font-bold text-primary">Recipe Suggestions</h2>
              {selectedCuisine !== 'all' && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ChefHat className="h-4 w-4" />
                  <span>
                    Filtered for: <span className="font-semibold text-primary">
                      {cuisineOptions.find(c => c.value === selectedCuisine)?.label}
                    </span> cuisine
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  clearRecommendedRecipes();
                  setError(null);
                }}
                className="text-xs"
              >
                Clear Results
              </Button>
              {selectedCuisine !== 'all' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedCuisine('all');
                    // Automatically re-search with no cuisine filter
                    setTimeout(() => handleManualSearch(), 100);
                  }}
                  className="text-xs"
                >
                  Remove Filter
                </Button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {recommendedRecipes.map((recipe, index) => (
              <div key={`${recipe.name}-${index}`} className="flex">
                <RecipeCard recipe={recipe} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
        <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
    }>
        <HomePageContent />
    </Suspense>
  )
}

