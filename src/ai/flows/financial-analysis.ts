
'use server';
/**
 * @fileOverview Genkit flow for NeuroBudget neural analysis.
 * Analyzes spending context and provides cybernetic financial advice.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalysisInputSchema = z.object({
  transactions: z.array(z.any()),
  budgets: z.array(z.any()),
  userQuery: z.string().optional(),
  type: z.enum(['spending', 'savings', 'forecast', 'query']).default('query')
});

const AnalysisOutputSchema = z.object({
  analysis: z.string().describe('The financial analysis in a cyberpunk advisor persona.'),
  recommendations: z.array(z.string()).describe('List of actionable financial steps.'),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).describe('Calculated financial risk level.')
});

export async function runNeuralAnalysis(input: z.infer<typeof AnalysisInputSchema>) {
  return neuralAnalysisFlow(input);
}

const neuralAnalysisPrompt = ai.definePrompt({
  name: 'neuralAnalysisPrompt',
  input: { schema: AnalysisInputSchema },
  output: { schema: AnalysisOutputSchema },
  prompt: `You are the NeuroBudget Neural Interface, an advanced AI financial advisor in a cyberpunk 2077-esque world.
Your persona is clinical, highly intelligent, yet helpful to the "user" (the street samurai/hacker).

Analyze the provided financial data:
Transactions: {{json transactions}}
Budgets: {{json budgets}}

Task: {{#if userQuery}}Address the specific query: {{{userQuery}}}{{else}}Provide a general {{type}} analysis.{{/if}}

Format all currency as Indian Rupees (₹).
Keep your tone "cyberpunk" — use terms like "credits", "data packets", "neural link", "vortex", "optimization".

Be specific about overspending and risk.`
});

const neuralAnalysisFlow = ai.defineFlow(
  {
    name: 'neuralAnalysisFlow',
    inputSchema: AnalysisInputSchema,
    outputSchema: AnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await neuralAnalysisPrompt(input);
    return output!;
  }
);
