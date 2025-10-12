'use server';

import {
  cryptoAssistant,
  type CryptoAssistantInput,
  type CryptoAssistantOutput,
} from '@/ai/flows/crypto-assistant';

export async function askAI(
  input: CryptoAssistantInput
): Promise<CryptoAssistantOutput> {
  try {
    const response = await cryptoAssistant(input);
    return response;
  } catch (error) {
    console.error('Error in askAI server action:', error);
    return {
      answer: "Sorry, I couldn't process your request right now. Please try again later.",
    };
  }
}
