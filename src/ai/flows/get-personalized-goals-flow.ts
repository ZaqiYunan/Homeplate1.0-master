
'use server';
/**
 * @fileOverview An AI flow to get personalized daily nutritional goals.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UserProfileSchema = z.object({
  height: z.number().describe("The user's height in centimeters."),
  weight: z.number().describe("The user's weight in kilograms."),
  age: z.number().describe("The user's age in years."),
  gender: z.enum(['male', 'female', 'other']).describe("The user's gender."),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active']).optional().describe("The user's weekly activity level."),
});
export type UserProfile = z.infer<typeof UserProfileSchema>;

const NutritionalGoalsSchema = z.object({
  calories: z.number().describe('Recommended daily calories.'),
  protein: z.number().describe('Recommended daily grams of protein.'),
  carbs: z.number().describe('Recommended daily grams of carbohydrates.'),
  fat: z.number().describe('Recommended daily grams of fat.'),
});
export type NutritionalGoals = z.infer<typeof NutritionalGoalsSchema>;

export async function getPersonalizedGoals(input: UserProfile): Promise<NutritionalGoals> {
  return getPersonalizedGoalsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getPersonalizedGoalsPrompt',
  input: {schema: UserProfileSchema},
  output: {schema: NutritionalGoalsSchema},
  prompt: `You are a nutritionist. Based on the following user profile, calculate the recommended daily nutritional goals (calories, protein, carbs, fat). Use the Mifflin-St Jeor equation for BMR, and then apply an activity multiplier. Assume a moderate activity level if not provided.

  - Height: {{{height}}} cm
  - Weight: {{{weight}}} kg
  - Age: {{{age}}} years
  - Gender: {{{gender}}}
  {{#if activityLevel}}- Activity Level: {{{activityLevel}}}{{/if}}

  Provide a balanced macronutrient split. Return the recommended daily goals.`,
});

const getPersonalizedGoalsFlow = ai.defineFlow(
  {
    name: 'getPersonalizedGoalsFlow',
    inputSchema: UserProfileSchema,
    outputSchema: NutritionalGoalsSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
