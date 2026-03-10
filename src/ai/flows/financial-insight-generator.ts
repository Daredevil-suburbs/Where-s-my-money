'use server';
/**
 * @fileOverview A Genkit flow that analyzes user spending habits and budget adherence
 * to provide personalized financial advice, warnings, and insights.
 *
 * - generateFinancialInsight - A function that handles the financial insight generation process.
 * - FinancialInsightInput - The input type for the generateFinancialInsight function.
 * - FinancialInsightOutput - The return type for the generateFinancialInsight function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FinancialInsightInputSchema = z.object({
  transactions: z
    .array(
      z.object({
        date: z.string().describe('The date of the transaction (YYYY-MM-DD).'),
        description: z.string().describe('A brief description of the transaction.'),
        amount: z.number().describe('The amount of the transaction.'),
        category: z.string().describe('The spending category for the transaction.'),
        type: z.enum(['income', 'expense']).describe('The type of transaction (income or expense).'),
      })
    )
    .describe('A list of recent financial transactions.'),
  spendingGoals: z
    .array(
      z.object({
        category: z.string().describe('The spending category.'),
        budgetAmount: z.number().describe('The budgeted amount for this category.'),
        spentAmount: z.number().describe('The actual amount spent in this category.'),
      })
    )
    .describe('A list of budget goals and current spending for various categories.'),
  currentDate: z.string().describe('The current date in YYYY-MM-DD format.'),
});
export type FinancialInsightInput = z.infer<typeof FinancialInsightInputSchema>;

const FinancialInsightOutputSchema = z.object({
  advice: z.string().describe('Personalized advice to improve financial health.'),
  warnings: z
    .array(z.string())
    .describe('Predictive warnings about potential financial issues, if any.'),
  insights: z.array(z.string()).describe('Actionable insights derived from spending patterns.'),
});
export type FinancialInsightOutput = z.infer<typeof FinancialInsightOutputSchema>;

export async function generateFinancialInsight(
  input: FinancialInsightInput
): Promise<FinancialInsightOutput> {
  return financialInsightGeneratorFlow(input);
}

const financialInsightPrompt = ai.definePrompt({
  name: 'financialInsightPrompt',
  input: {schema: FinancialInsightInputSchema},
  output: {schema: FinancialInsightOutputSchema},
  prompt: `You are an expert financial advisor named MoneyMind. Your goal is to analyze a user's financial data, identify spending patterns, evaluate budget adherence, and provide personalized, actionable advice and predictive warnings to help them improve their financial health.

Current Date: {{{currentDate}}}

Here is the user's recent transaction data:
{{#each transactions}}
- Date: {{{date}}}, Description: {{{description}}}, Amount: {{{amount}}}, Category: {{{category}}}, Type: {{{type}}}
{{/each}}

Here are the user's budget goals and current spending for various categories:
{{#each spendingGoals}}
- Category: {{{category}}}, Budget: {{{budgetAmount}}}, Spent: {{{spentAmount}}}
{{/each}}

Based on this data, provide the following:
1. Personalized advice to improve financial health.
2. Predictive warnings about potential financial issues.
3. Actionable insights derived from their spending patterns.`,
});

const financialInsightGeneratorFlow = ai.defineFlow(
  {
    name: 'financialInsightGeneratorFlow',
    inputSchema: FinancialInsightInputSchema,
    outputSchema: FinancialInsightOutputSchema,
  },
  async input => {
    const {output} = await financialInsightPrompt(input);
    return output!;
  }
);
