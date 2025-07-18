"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { searchIngredientSpecification, IngredientSpecification } from '@/ai/flows/search-ingredient-specification';

interface IngredientAISearchProps {
  onIngredientFound?: (specification: IngredientSpecification) => void;
}

export function IngredientAISearch({ onIngredientFound }: IngredientAISearchProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<IngredientSpecification | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const specification = await searchIngredientSpecification({
        query: query.trim(),
        searchType: 'general'
      });
      
      setResult(specification);
      onIngredientFound?.(specification);
    } catch (err) {
      console.error('AI search error:', err);
      setError('Failed to search for ingredient specification. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSearch();
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Search Input */}
      <Card className="border-2 border-purple-100 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Sparkles className="h-5 w-5" />
            AI Ingredient Search
          </CardTitle>
          <p className="text-sm text-purple-600">
            Ask about any ingredient! Try: "Tell me about spinach nutrition", "High protein vegetables", "How to store avocados"
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Ask about any ingredient..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSearch} 
              disabled={isLoading || !query.trim()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Result Display */}
      {result && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-green-800">{result.ingredient}</CardTitle>
              <Badge variant="outline" className="border-green-300 text-green-700">
                {result.category}
              </Badge>
            </div>
            <p className="text-sm text-green-700">{result.description}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Nutritional Info */}
            <div>
              <h4 className="font-semibold text-green-800 mb-2">Nutritional Information (per 100g)</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-600">Calories:</span>
                  <span className="font-medium">{result.nutritionalInfo.calories}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600">Protein:</span>
                  <span className="font-medium">{result.nutritionalInfo.protein}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600">Carbs:</span>
                  <span className="font-medium">{result.nutritionalInfo.carbs}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600">Fat:</span>
                  <span className="font-medium">{result.nutritionalInfo.fat}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600">Fiber:</span>
                  <span className="font-medium">{result.nutritionalInfo.fiber}g</span>
                </div>
              </div>
            </div>

            {/* Cooking Properties */}
            <div>
              <h4 className="font-semibold text-green-800 mb-2">Cooking Properties</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-green-600">Methods: </span>
                  <span>{result.cookingProperties.cookingMethods.join(', ')}</span>
                </div>
                <div>
                  <span className="text-green-600">Time: </span>
                  <span>{result.cookingProperties.cookingTime}</span>
                </div>
                <div>
                  <span className="text-green-600">Flavor: </span>
                  <span>{result.cookingProperties.flavor}</span>
                </div>
              </div>
            </div>

            {/* Storage Info */}
            <div>
              <h4 className="font-semibold text-green-800 mb-2">Storage Information</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-green-600">Duration: </span>
                  <span>{result.storageInfo.freshDuration}</span>
                </div>
                <div>
                  <span className="text-green-600">Method: </span>
                  <span>{result.storageInfo.storageMethod}</span>
                </div>
                <div className="flex gap-4">
                  <span className={`px-2 py-1 rounded text-xs ${result.storageInfo.refrigeration ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                    {result.storageInfo.refrigeration ? 'Refrigerate' : 'Room Temp'}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${result.storageInfo.freezable ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                    {result.storageInfo.freezable ? 'Freezable' : 'Don\'t Freeze'}
                  </span>
                </div>
              </div>
            </div>

            {/* Health Benefits */}
            {result.healthBenefits.length > 0 && (
              <div>
                <h4 className="font-semibold text-green-800 mb-2">Health Benefits</h4>
                <div className="flex flex-wrap gap-1">
                  {result.healthBenefits.map((benefit, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-green-100 text-green-800">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Varieties and Alternatives */}
            <div className="grid md:grid-cols-2 gap-4">
              {result.varieties.length > 0 && (
                <div>
                  <h4 className="font-semibold text-green-800 mb-2">Varieties</h4>
                  <div className="flex flex-wrap gap-1">
                    {result.varieties.map((variety, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {variety}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {result.alternatives.length > 0 && (
                <div>
                  <h4 className="font-semibold text-green-800 mb-2">Alternatives</h4>
                  <div className="flex flex-wrap gap-1">
                    {result.alternatives.map((alt, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {alt}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
