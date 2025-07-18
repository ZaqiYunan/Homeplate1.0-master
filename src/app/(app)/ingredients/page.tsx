
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, ArrowLeft, Database, Sparkles } from 'lucide-react';
import { IngredientDetail } from '@/components/IngredientDetail';
import { IngredientAISearch } from '@/components/IngredientAISearch';
import { SAMPLE_INGREDIENTS, getIngredientInfo } from '@/lib/ingredient-database';
import { DetailedIngredientInfo } from '@/lib/types';
import { IngredientSpecification } from '@/ai/flows/search-ingredient-specification';

export default function IngredientExplorerPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState<DetailedIngredientInfo | null>(null);
  const [selectedAIResult, setSelectedAIResult] = useState<IngredientSpecification | null>(null);
  const [activeTab, setActiveTab] = useState('database');

  const filteredIngredients = SAMPLE_INGREDIENTS.filter(ingredient =>
    ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ingredient.aliases.some(alias => alias.toLowerCase().includes(searchTerm.toLowerCase())) ||
    ingredient.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleIngredientClick = (ingredient: DetailedIngredientInfo) => {
    setSelectedIngredient(ingredient);
  };

  const handleBack = () => {
    setSelectedIngredient(null);
    setSelectedAIResult(null);
  };

  const handleAIResultFound = (specification: IngredientSpecification) => {
    setSelectedAIResult(specification);
    setActiveTab('ai-result');
  };

  // Show AI result detail view
  if (selectedAIResult) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Button
            onClick={handleBack}
            variant="outline"
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Ingredients
          </Button>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">{selectedAIResult.ingredient}</CardTitle>
                <Badge variant="outline" className="text-lg px-3 py-1">
                  {selectedAIResult.category}
                </Badge>
              </div>
              <p className="text-gray-600">{selectedAIResult.description}</p>
              <p className="text-sm text-gray-500">Origin: {selectedAIResult.origin}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Detailed view of AI result similar to IngredientDetail */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Nutritional Information (per 100g)</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Calories:</span>
                      <span className="font-medium">{selectedAIResult.nutritionalInfo.calories}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Protein:</span>
                      <span className="font-medium">{selectedAIResult.nutritionalInfo.protein}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Carbohydrates:</span>
                      <span className="font-medium">{selectedAIResult.nutritionalInfo.carbs}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fat:</span>
                      <span className="font-medium">{selectedAIResult.nutritionalInfo.fat}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fiber:</span>
                      <span className="font-medium">{selectedAIResult.nutritionalInfo.fiber}g</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Storage Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-medium">{selectedAIResult.storageInfo.freshDuration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Method:</span>
                      <span className="font-medium">{selectedAIResult.storageInfo.storageMethod}</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Badge variant={selectedAIResult.storageInfo.refrigeration ? "default" : "secondary"}>
                        {selectedAIResult.storageInfo.refrigeration ? "Refrigerate" : "Room Temperature"}
                      </Badge>
                      <Badge variant={selectedAIResult.storageInfo.freezable ? "default" : "secondary"}>
                        {selectedAIResult.storageInfo.freezable ? "Freezable" : "Don't Freeze"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Cooking Properties</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Cooking Methods:</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedAIResult.cookingProperties.cookingMethods.map((method, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {method}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Cooking Time:</p>
                    <p className="font-medium">{selectedAIResult.cookingProperties.cookingTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Flavor Profile:</p>
                    <p className="font-medium">{selectedAIResult.cookingProperties.flavor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Texture:</p>
                    <p className="font-medium">{selectedAIResult.cookingProperties.texture}</p>
                  </div>
                </div>
              </div>

              {selectedAIResult.healthBenefits.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Health Benefits</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedAIResult.healthBenefits.map((benefit, index) => (
                      <Badge key={index} variant="secondary">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                {selectedAIResult.varieties.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Varieties</h3>
                    <div className="flex flex-wrap gap-1">
                      {selectedAIResult.varieties.map((variety, index) => (
                        <Badge key={index} variant="outline">
                          {variety}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedAIResult.alternatives.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Alternatives</h3>
                    <div className="flex flex-wrap gap-1">
                      {selectedAIResult.alternatives.map((alt, index) => (
                        <Badge key={index} variant="outline">
                          {alt}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {selectedAIResult.cookingProperties.pairings.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Pairs Well With</h3>
                  <div className="flex flex-wrap gap-1">
                    {selectedAIResult.cookingProperties.pairings.map((pairing, index) => (
                      <Badge key={index} variant="outline">
                        {pairing}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (selectedIngredient) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Button
            onClick={handleBack}
            variant="outline"
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Ingredients
          </Button>
          <IngredientDetail ingredient={selectedIngredient} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Ingredient Explorer
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover detailed information about ingredients including nutrition facts, 
            freshness indicators, pairing suggestions, and health benefits.
          </p>
        </div>

        {/* Tabs for Database vs AI Search */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="database" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Database
            </TabsTrigger>
            <TabsTrigger value="ai-search" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI Search
            </TabsTrigger>
          </TabsList>

          <TabsContent value="database" className="space-y-6">
            {/* Traditional Search */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search ingredients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Ingredients Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIngredients.map((ingredient) => (
                <Card 
                  key={ingredient.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleIngredientClick(ingredient)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{ingredient.name}</CardTitle>
                      <Badge variant="outline">{ingredient.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {ingredient.description}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Calories:</span>
                        <span className="font-medium">{ingredient.nutrition.calories} per 100g</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Season:</span>
                        <span className="font-medium">{ingredient.season.join(', ')}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Origin:</span>
                        <span className="font-medium">{ingredient.origin}</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="text-xs text-gray-500 mb-2">Key Benefits:</div>
                      <div className="flex flex-wrap gap-1">
                        {ingredient.healthBenefits.primary.slice(0, 2).map((benefit, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {benefit.split(' ')[0]}
                          </Badge>
                        ))}
                        {ingredient.healthBenefits.primary.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{ingredient.healthBenefits.primary.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredIngredients.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No ingredients found matching your search.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="ai-search">
            <IngredientAISearch onIngredientFound={handleAIResultFound} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
