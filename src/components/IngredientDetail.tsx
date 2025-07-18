"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Leaf, 
  Heart, 
  Eye, 
  Thermometer, 
  Calendar,
  MapPin,
  ChefHat,
  Apple,
  AlertTriangle,
  Lightbulb,
  Clock
} from 'lucide-react';
import { DetailedIngredientInfo } from '@/lib/types';

interface IngredientDetailProps {
  ingredient: DetailedIngredientInfo;
  compact?: boolean;
}

export function IngredientDetail({ ingredient, compact = false }: IngredientDetailProps) {
  const formatNutrientValue = (value: number, unit: string) => {
    return `${value}${unit}`;
  };

  const getNutrientColor = (percentage: number) => {
    if (percentage >= 20) return 'bg-green-500';
    if (percentage >= 10) return 'bg-yellow-500';
    return 'bg-gray-300';
  };

  return (
    <div className={compact ? "space-y-4" : "max-w-4xl mx-auto p-6 space-y-6"}>
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Apple className="h-8 w-8 text-green-600" />
          <h1 className={compact ? "text-2xl font-bold text-gray-900" : "text-3xl font-bold text-gray-900"}>{ingredient.name}</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">{ingredient.description}</p>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>Origin: {ingredient.origin}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Season: {ingredient.season.join(', ')}</span>
          </div>
        </div>
        <div className="flex justify-center">
          <Badge variant="outline" className="text-sm">
            {ingredient.category}
          </Badge>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="nutrition" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="freshness">Freshness</TabsTrigger>
          <TabsTrigger value="compatibility">Pairing</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="recipes">Recipes</TabsTrigger>
        </TabsList>

        {/* Nutrition Tab */}
        <TabsContent value="nutrition" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-green-600" />
                Nutritional Information (per 100g)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Macronutrients */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{ingredient.nutrition.calories}</div>
                  <div className="text-sm text-gray-600">Calories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{formatNutrientValue(ingredient.nutrition.protein, 'g')}</div>
                  <div className="text-sm text-gray-600">Protein</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{formatNutrientValue(ingredient.nutrition.carbs, 'g')}</div>
                  <div className="text-sm text-gray-600">Carbs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{formatNutrientValue(ingredient.nutrition.fat, 'g')}</div>
                  <div className="text-sm text-gray-600">Fat</div>
                </div>
              </div>

              <Separator />

              {/* Vitamins */}
              <div>
                <h4 className="font-semibold mb-3">Vitamins (% Daily Value)</h4>
                <div className="space-y-2">
                  {Object.entries(ingredient.nutrition.vitamins).map(([vitamin, percentage]) => (
                    <div key={vitamin} className="flex items-center gap-3">
                      <div className="w-20 text-sm text-gray-600">{vitamin}</div>
                      <div className="flex-1">
                        <Progress 
                          value={Math.min(percentage, 100)} 
                          className="h-2" 
                          // className={`h-2 ${getNutrientColor(percentage)}`}
                        />
                      </div>
                      <div className="w-12 text-sm font-medium">{percentage}%</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Minerals */}
              <div>
                <h4 className="font-semibold mb-3">Minerals (% Daily Value)</h4>
                <div className="space-y-2">
                  {Object.entries(ingredient.nutrition.minerals).map(([mineral, percentage]) => (
                    <div key={mineral} className="flex items-center gap-3">
                      <div className="w-20 text-sm text-gray-600">{mineral}</div>
                      <div className="flex-1">
                        <Progress 
                          value={Math.min(percentage, 100)} 
                          className="h-2" 
                        />
                      </div>
                      <div className="w-12 text-sm font-medium">{percentage}%</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Antioxidants */}
              {ingredient.nutrition.antioxidants && (
                <div>
                  <h4 className="font-semibold mb-3">Key Antioxidants</h4>
                  <div className="flex flex-wrap gap-2">
                    {ingredient.nutrition.antioxidants.map((antioxidant) => (
                      <Badge key={antioxidant} variant="secondary">
                        {antioxidant}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Freshness Tab */}
        <TabsContent value="freshness" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-600" />
                Freshness Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-green-600 mb-3">✓ Good Signs</h4>
                  <ul className="space-y-2">
                    {ingredient.freshness.goodIndicators.map((indicator, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm">{indicator}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-600 mb-3">✗ Bad Signs</h4>
                  <ul className="space-y-2">
                    {ingredient.freshness.badIndicators.map((indicator, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm">{indicator}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">Optimal Ripeness</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  {ingredient.freshness.optimalRipeness}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Storage Life</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-orange-50 rounded">
                    <Thermometer className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                    <div className="font-medium">Room Temperature</div>
                    <div className="text-sm text-gray-600">{ingredient.freshness.shelfLife.roomTemp}</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded">
                    <Thermometer className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <div className="font-medium">Refrigerated</div>
                    <div className="text-sm text-gray-600">{ingredient.freshness.shelfLife.refrigerated}</div>
                  </div>
                  {ingredient.freshness.shelfLife.frozen && (
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <Thermometer className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                      <div className="font-medium">Frozen</div>
                      <div className="text-sm text-gray-600">{ingredient.freshness.shelfLife.frozen}</div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compatibility Tab */}
        <TabsContent value="compatibility" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="h-5 w-5 text-purple-600" />
                Culinary Compatibility
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Flavor Profile</h4>
                <div className="flex flex-wrap gap-2">
                  {ingredient.compatibility.flavorProfile.map((flavor) => (
                    <Badge key={flavor} variant="outline" className="bg-purple-50">
                      {flavor}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Cooking Methods</h4>
                <div className="flex flex-wrap gap-2">
                  {ingredient.compatibility.cookingMethods.map((method) => (
                    <Badge key={method} variant="secondary">
                      {method}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Pairs Well With</h4>
                  <div className="space-y-4">
                    {Object.entries(ingredient.compatibility.pairsWellWith).map(([category, items]) => (
                      <div key={category}>
                        <h5 className="text-sm font-medium text-gray-700 mb-2 capitalize">{category}</h5>
                        <div className="flex flex-wrap gap-1">
                          {items.map((item) => (
                            <Badge key={item} variant="outline" className="text-xs">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Preparation Tips</h4>
                  <ul className="space-y-2">
                    {ingredient.preparationTips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Health Tab */}
        <TabsContent value="health" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-600" />
                Health Benefits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Primary Benefits</h4>
                <ul className="space-y-2">
                  {ingredient.healthBenefits.primary.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Heart className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {ingredient.healthBenefits.secondary && (
                <div>
                  <h4 className="font-semibold mb-3">Additional Benefits</h4>
                  <ul className="space-y-2">
                    {ingredient.healthBenefits.secondary.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {ingredient.healthBenefits.warnings && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    Precautions
                  </h4>
                  <ul className="space-y-1">
                    {ingredient.healthBenefits.warnings.map((warning, index) => (
                      <li key={index} className="text-sm text-yellow-800">
                        • {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Storage Instructions</h4>
                <p className="text-sm text-green-800">{ingredient.storageInstructions}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recipes Tab */}
        <TabsContent value="recipes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="h-5 w-5 text-orange-600" />
                Recipe Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-green-600">Raw Preparations</h4>
                  <ul className="space-y-2">
                    {ingredient.recipeSuggestions.raw.map((recipe, index) => (
                      <li key={index} className="text-sm p-2 bg-green-50 rounded">
                        {recipe}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-orange-600">Cooked Dishes</h4>
                  <ul className="space-y-2">
                    {ingredient.recipeSuggestions.cooked.map((recipe, index) => (
                      <li key={index} className="text-sm p-2 bg-orange-50 rounded">
                        {recipe}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-purple-600">Preserved Forms</h4>
                  <ul className="space-y-2">
                    {ingredient.recipeSuggestions.preserved.map((recipe, index) => (
                      <li key={index} className="text-sm p-2 bg-purple-50 rounded">
                        {recipe}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
