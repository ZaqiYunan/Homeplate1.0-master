
'use server';

/**
 * @fileOverview Recipe recommendation AI agent.
 *
 * - recommendRecipes - A function that recommends recipes based on available ingredients.
 * - RecommendRecipesInput - The input type for the recommendRecipes function.
 * - RecommendRecipesOutput - The return type for the recommendRecipes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendRecipesInputSchema = z.object({
  ingredients: z
    .array(z.string())
    .optional()
    .describe('An array of ingredients the user has available.'),
  query: z
    .string()
    .optional()
    .describe("The user's direct query, e.g., 'chicken stir fry' or 'quick breakfast'"),
  cuisine: z
    .string()
    .optional()
    .describe('The preferred cuisine type: western, asian, or indonesian'),
  strictMode: z
    .boolean()
    .describe('If true, only use available ingredients. If false, AI can add ingredients.'),
  numRecipes: z
    .number()
    .default(3)
    .describe('The number of recipes to recommend.'),
});
export type RecommendRecipesInput = z.infer<typeof RecommendRecipesInputSchema>;

const RecipeSchema = z.object({
  name: z.string().describe('The name of the recipe.'),
  ingredients: z.array(z.string()).describe('The ingredients required for the recipe.'),
  instructions: z.string().describe('The step-by-step instructions for the recipe.'),
  cuisine: z.string().optional().describe('The cuisine type this recipe belongs to.'),
  cookingTime: z.string().optional().describe('Estimated cooking time (e.g., "30 minutes", "1 hour").'),
  difficulty: z.string().optional().describe('Difficulty level: Easy, Medium, or Hard.'),
  url: z.string().optional().describe('A link to the recipe on the web.'),
  missingIngredients: z
    .array(z.string())
    .optional()
    .describe("A list of ingredients required for the recipe that are NOT in the user's available ingredients list."),
});

const RecommendRecipesOutputSchema = z.object({
  recipes: z.array(RecipeSchema).describe('An array of recommended recipes.'),
});
export type RecommendRecipesOutput = z.infer<typeof RecommendRecipesOutputSchema>;

export async function recommendRecipes(input: RecommendRecipesInput): Promise<RecommendRecipesOutput> {
  return recommendRecipesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendRecipesPrompt',
  input: {schema: RecommendRecipesInputSchema},
  output: {schema: RecommendRecipesOutputSchema},
  prompt: `You are a recipe recommendation expert with deep knowledge of global cuisines. Your primary goal is to help a user decide what to cook.

{{#if cuisine}}
CUISINE FOCUS: {{cuisine}} cuisine

Important: ALL recipes must authentically represent {{cuisine}} cuisine using traditional ingredients, cooking methods, and flavor profiles specific to this cuisine type.

Cuisine Guidelines:
- Western cuisine: European, American, Mediterranean traditions with dairy, wheat, herbs, grilling/roasting/baking methods
- Asian cuisine: East/Southeast/South Asian traditions with rice/noodles, soy sauce, wok cooking, balance of flavors  
- Indonesian cuisine: Traditional Indonesian with spice pastes (bumbu), coconut milk, rice, grilled/fried methods

{{/if}}

{{#if strictMode}}
You are in "Use My Storage" mode. The user wants to cook using ONLY the ingredients they have.
Your suggestions should maximize the use of these ingredients{{#if cuisine}} while staying true to {{cuisine}} cuisine traditions{{/if}}.

Available ingredients:
{{#each ingredients}}
- {{this}}
{{/each}}

If a common complementary ingredient (like salt, pepper, oil, water) is essential for the recipe but not in the available list, you MUST list it in the 'missingIngredients' field. Do not list main ingredients as missing.
{{else}}
You are in "Creative Mode". The user wants ideas for "{{query}}"{{#if cuisine}} in authentic {{cuisine}} cuisine style{{/if}}.
{{#if ingredients}}
They have the following ingredients available, which you should try to incorporate, but you are not limited to them:
Available ingredients:
{{#each ingredients}}
- {{this}}
{{/each}}
{{else}}
The user has not specified any available ingredients.
{{/if}}

Suggest creative recipes that match the user's query{{#if cuisine}} and authentically represent {{cuisine}} cuisine{{/if}}. The recipes can and should include ingredients the user does not have.
You MUST list any required ingredients that are not in the user's 'Available ingredients' list into the 'missingIngredients' field for each recipe.
{{/if}}

Please suggest {{numRecipes}} recipes.
Each Recipe object should include:
- recipe name (authentic to the specified cuisine)
- complete list of all required ingredients 
- step-by-step instructions
- cuisine type ({{#if cuisine}}"{{cuisine}}"{{else}}"General"{{/if}})
- estimated cooking time
- difficulty level (Easy, Medium, or Hard)
- the 'missingIngredients' list

Ensure the ingredients in the Recipe object are a list of individual ingredients as opposed to a sentence.

{{#if cuisine}}
CRITICAL: All {{numRecipes}} recipes must be authentic {{cuisine}} cuisine dishes. Do not mix cuisines or suggest fusion recipes.
{{/if}}
`,
});

const recommendRecipesFlow = ai.defineFlow(
  {
    name: 'recommendRecipesFlow',
    inputSchema: RecommendRecipesInputSchema,
    outputSchema: RecommendRecipesOutputSchema,
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
      console.error('Recipe generation error:', error);
      // Return mock recipes if AI fails
      return {
        recipes: [
          {
            name: "Simple Ingredient Mix",
            ingredients: input.ingredients?.slice(0, 3) || ["Basic ingredients"],
            instructions: "1. Combine your available ingredients\n2. Cook according to your preference\n3. Season to taste\n4. Serve and enjoy!",
            cuisine: input.cuisine || "General",
            cookingTime: "15-20 minutes",
            difficulty: "Easy",
            missingIngredients: []
          }
        ]
      };
    }
  }
);
