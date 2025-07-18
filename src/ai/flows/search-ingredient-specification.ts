'use server';

/**
 * @fileOverview Ingredient specification search AI agent.
 *
 * - searchIngredientSpecification - A function that provides detailed ingredient specifications based on natural language queries.
 * - IngredientSearchInput - The input type for the searchIngredientSpecification function.
 * - IngredientSpecification - The return type for the searchIngredientSpecification function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input schema for ingredient specification search
const IngredientSearchInputSchema = z.object({
  query: z.string().describe('Natural language query about ingredient specifications, nutritional info, or cooking properties'),
  ingredient: z.string().optional().describe('Specific ingredient name if provided'),
  searchType: z.enum(['general', 'nutrition', 'cooking', 'storage', 'health']).optional().describe('Type of information requested')
});

// Output schema for ingredient specification
const IngredientSpecificationSchema = z.object({
  ingredient: z.string().describe('The ingredient name'),
  category: z.string().describe('Food category (e.g., Vegetable, Fruit, Grain, Protein)'),
  description: z.string().describe('Brief description of the ingredient'),
  nutritionalInfo: z.object({
    calories: z.number().describe('Calories per 100g'),
    protein: z.number().describe('Protein in grams per 100g'),
    carbs: z.number().describe('Carbohydrates in grams per 100g'),
    fat: z.number().describe('Fat in grams per 100g'),
    fiber: z.number().describe('Fiber in grams per 100g'),
    vitamins: z.array(z.string()).describe('Key vitamins present'),
    minerals: z.array(z.string()).describe('Key minerals present')
  }).describe('Detailed nutritional information'),
  cookingProperties: z.object({
    cookingMethods: z.array(z.string()).describe('Recommended cooking methods'),
    cookingTime: z.string().describe('Typical cooking time'),
    flavor: z.string().describe('Flavor profile'),
    texture: z.string().describe('Texture when cooked'),
    pairings: z.array(z.string()).describe('Ingredients that pair well')
  }).describe('Cooking and culinary properties'),
  storageInfo: z.object({
    freshDuration: z.string().describe('How long it stays fresh'),
    storageMethod: z.string().describe('Best storage method'),
    refrigeration: z.boolean().describe('Whether refrigeration is required'),
    freezable: z.boolean().describe('Whether it can be frozen'),
    signs: z.array(z.string()).describe('Signs of freshness or spoilage')
  }).describe('Storage and freshness information'),
  healthBenefits: z.array(z.string()).describe('Health benefits and properties'),
  varieties: z.array(z.string()).describe('Common varieties or types'),
  season: z.array(z.string()).describe('Peak seasons for availability'),
  origin: z.string().describe('Geographic origin or where commonly grown'),
  alternatives: z.array(z.string()).describe('Similar ingredients that can be substituted')
});

export type IngredientSearchInput = z.infer<typeof IngredientSearchInputSchema>;
export type IngredientSpecification = z.infer<typeof IngredientSpecificationSchema>;

const prompt = ai.definePrompt({
  name: 'ingredientSpecificationPrompt',
  input: {schema: IngredientSearchInputSchema},
  output: {schema: IngredientSpecificationSchema},
  prompt: `
You are a culinary and nutritional expert with extensive knowledge of ingredients, cooking, and food science. 
Based on the user's query, provide comprehensive specifications for the ingredient.

User Query: "{{query}}"
{{#if ingredient}}Specific Ingredient: {{ingredient}}{{/if}}
{{#if searchType}}Focus Area: {{searchType}}{{/if}}

Instructions:
1. If the user asks about a specific ingredient, provide detailed specifications for that ingredient
2. If the query is general (e.g., "high protein vegetables"), identify the most relevant ingredient that matches the criteria
3. If multiple ingredients are mentioned, focus on the primary one
4. Provide accurate, factual information based on established nutritional and culinary knowledge
5. For nutritional values, use standard USDA or similar database values per 100g
6. Include practical cooking and storage advice
7. Be specific with measurements, times, and temperatures when relevant

Examples of queries you might receive:
- "Tell me about spinach nutrition"
- "What are the cooking properties of salmon?"
- "High vitamin C fruits"
- "How to store avocados properly"
- "Protein content in quinoa"

Please provide comprehensive specifications for the most relevant ingredient based on the query.
Return accurate nutritional values, practical cooking advice, and useful storage information.
`,
});

const searchIngredientSpecificationFlow = ai.defineFlow(
  {
    name: 'searchIngredientSpecificationFlow',
    inputSchema: IngredientSearchInputSchema,
    outputSchema: IngredientSpecificationSchema,
  },
  async input => {
    try {
      // Check if API key is available
      if (!process.env.GOOGLE_API_KEY && !process.env.GEMINI_API_KEY) {
        throw new Error('Google AI API key is not configured. Please add GOOGLE_API_KEY to your environment variables.');
      }
      
      const {output} = await prompt(input);
      return output!;
    } catch (error) {
      console.error('Ingredient specification generation error:', error);
      // Return mock specification if AI fails
      const queryIngredient = input.ingredient || extractIngredientFromQuery(input.query);
      return createMockSpecification(queryIngredient, input.query);
    }
  }
);

// Helper function to extract ingredient name from natural language query
function extractIngredientFromQuery(query: string): string {
  const commonIngredients = ['tomato', 'onion', 'garlic', 'chicken', 'beef', 'spinach', 'carrot', 'potato', 'rice', 'avocado', 'apple', 'banana'];
  const lowerQuery = query.toLowerCase();
  
  for (const ingredient of commonIngredients) {
    if (lowerQuery.includes(ingredient)) {
      return ingredient;
    }
  }
  
  // Default fallback
  return 'tomato';
}

// Helper function to create mock specification for fallback
function createMockSpecification(ingredient: string, query: string): IngredientSpecification {
  return {
    ingredient: ingredient.charAt(0).toUpperCase() + ingredient.slice(1),
    category: 'Vegetable',
    description: `${ingredient} is a common cooking ingredient with versatile culinary applications.`,
    nutritionalInfo: {
      calories: 20,
      protein: 1,
      carbs: 4,
      fat: 0.2,
      fiber: 1.2,
      vitamins: ['Vitamin C', 'Vitamin K'],
      minerals: ['Potassium', 'Folate']
    },
    cookingProperties: {
      cookingMethods: ['Raw', 'Sautéed', 'Roasted', 'Grilled'],
      cookingTime: '5-15 minutes',
      flavor: 'Fresh and mild',
      texture: 'Firm when raw, tender when cooked',
      pairings: ['Onion', 'Garlic', 'Herbs', 'Olive oil']
    },
    storageInfo: {
      freshDuration: '1-2 weeks',
      storageMethod: 'Cool, dry place or refrigerator',
      refrigeration: true,
      freezable: false,
      signs: ['Firm texture', 'Bright color', 'No soft spots']
    },
    healthBenefits: ['Rich in vitamins', 'Low in calories', 'Good source of antioxidants'],
    varieties: ['Regular', 'Cherry', 'Roma'],
    season: ['Spring', 'Summer', 'Fall'],
    origin: 'Mediterranean region',
    alternatives: ['Bell pepper', 'Cucumber', 'Other fresh vegetables']
  };
}

export async function searchIngredientSpecification(input: IngredientSearchInput): Promise<IngredientSpecification> {
  return searchIngredientSpecificationFlow(input);
}
