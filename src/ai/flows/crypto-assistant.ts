'use server';
/**
 * @fileOverview An AI assistant for answering questions about cryptocurrencies, with up-to-date market data.
 *
 * - cryptoAssistant - A function that handles the cryptocurrency question answering process.
 * - CryptoAssistantInput - The input type for the cryptoAssistant function.
 * - CryptoAssistantOutput - The return type for the cryptoAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {getCryptoPrice} from '@/services/coingecko';

const CryptoAssistantInputSchema = z.object({
  query: z.string().describe('The user question about the cryptocurrency.'),
  symbol: z.string().optional().describe('The symbol of the cryptocurrency, if specified by the user.'),
});
export type CryptoAssistantInput = z.infer<typeof CryptoAssistantInputSchema>;

const CryptoAssistantOutputSchema = z.object({
  answer: z.string().describe('The answer to the user question.'),
});
export type CryptoAssistantOutput = z.infer<typeof CryptoAssistantOutputSchema>;

export async function cryptoAssistant(input: CryptoAssistantInput): Promise<CryptoAssistantOutput> {
  return cryptoAssistantFlow(input);
}

const cryptoAssistantPrompt = ai.definePrompt({
  name: 'cryptoAssistantPrompt',
  input: {schema: CryptoAssistantInputSchema},
  output: {schema: CryptoAssistantOutputSchema},
  prompt: `You are a cryptocurrency expert providing information to users.

  Answer the user's question about cryptocurrencies. If the user asks about the price of a specific cryptocurrency (and specifies the symbol), use the getCryptoPrice tool to get the current price and include it in your answer.
  If you don't need price information to answer the question, then answer it normally.

  Question: {{{query}}}
  {
    {#if symbol}}
    The crypto symbol is: {{{symbol}}}.
    {{/if}}
  }
  `,
  tools: [getCryptoPrice],
});

const cryptoAssistantFlow = ai.defineFlow(
  {
    name: 'cryptoAssistantFlow',
    inputSchema: CryptoAssistantInputSchema,
    outputSchema: CryptoAssistantOutputSchema,
  },
  async input => {
    const {output} = await cryptoAssistantPrompt(input);
    return output!;
  }
);
