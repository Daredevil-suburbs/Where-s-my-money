'use server';
/**
 * @fileOverview A Genkit flow for the MoneyMind app that provides predictive warnings about budget overruns or unusual spending spikes.
 *
 * - budgetWarningSystem - A function that handles the budget warning system process.
 * - BudgetWarningSystemInput - The input type for the budgetWarningSystem function.
 * - BudgetWarningSystemOutput - The return type for the budgetWarningSystem function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const BudgetWarningSystemInputSchema = z.object({
  transactions: z.array(
    z.object({
      id: z.string().describe('Unique identifier for the transaction.'),
      amount: z.number().describe('The amount of the transaction.'),
      category: z.string().describe('The category of the transaction.'),
      date: z.string().describe('The date of the transaction in YYYY-MM-DD format.'),
      description: z.string().optional().describe('A brief description of the transaction.'),
    })
  ).describe('A list of recent transactions.'),
  budgetGoals: z.record(z.string(), z.number()).describe('An object mapping category names to their monthly budget goals.'),
  currentDate: z.string().describe('The current date in YYYY-MM-DD format for context.'),
});
export type BudgetWarningSystemInput = z.infer<typeof BudgetWarningSystemInputSchema>;

const WarningSchema = z.object({
  type: z.enum(['budget_overrun_risk', 'spending_spike', 'anomaly_detection', 'general_advice']).describe('The type of warning or advice.'),
  category: z.string().optional().describe('The specific category related to the warning, if applicable.'),
  message: z.string().describe('A detailed message explaining the warning or observation.'),
  advice: z.string().describe('Actionable advice to help the user address the warning or improve spending habits.'),
});

const BudgetWarningSystemOutputSchema = z.object({
  warnings: z.array(WarningSchema).describe('A list of warnings and advice for the user.'),
  summary: z.string().describe('A general summary of the user\\'s current financial situation based on the analysis.'),
});
export type BudgetWarningSystemOutput = z.infer<typeof BudgetWarningSystemOutputSchema>;

export async function budgetWarningSystem(input: BudgetWarningSystemInput): Promise<BudgetWarningSystemOutput> {
  return budgetWarningSystemFlow(input);
}

const budgetWarningSystemPrompt = ai.definePrompt({
  name: 'budgetWarningSystemPrompt',
  input: { schema: BudgetWarningSystemInputSchema },
  output: { schema: BudgetWarningSystemOutputSchema },
  prompt: `You are an AI financial advisor named MoneyMind. Your goal is to analyze a user's spending data and budget goals to provide proactive warnings and personalized advice. You should identify potential budget overruns, unusual spending spikes, or other anomalies.

Current Date: {{{currentDate}}}

Here are the user's recent transactions:
{{#each transactions}}
- Date: {{{this.date}}}, Category: {{{this.category}}}, Amount: {{{this.amount}}}{{#if this.description}}, Description: {{{this.description}}}{{/if}}
{{/each}}

Here are the user's monthly budget goals:
{{#each budgetGoals}}
- Category: {{@key}}, Goal: {{{this}}}
{{/each}}

Analyze the provided data and generate a list of warnings and advice. For each warning, include its type, an optional category, a detailed message, and actionable advice. Also, provide a general summary of the user's current financial situation.

Warning types to consider:
- 'budget_overrun_risk': When current spending in a category is projected to exceed the budget goal.
- 'spending_spike': When spending in a category or overall significantly increases compared to recent periods.
- 'anomaly_detection': For any other unusual or noteworthy spending patterns.
- 'general_advice': For overall financial wellness tips based on patterns.

Focus on providing insights that help the user adjust their spending proactively and stay within their financial goals.`,
});

const budgetWarningSystemFlow = ai.defineFlow(
  {
    name: 'budgetWarningSystemFlow',
    inputSchema: BudgetWarningSystemInputSchema,
    outputSchema: BudgetWarningSystemOutputSchema,
  },
  async (input) => {
    const { output } = await budgetWarningSystemPrompt(input);
    return output!;
  }
);
