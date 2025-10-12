'use server';

import { cryptoAssistant, type CryptoAssistantInput, type CryptoAssistantOutput } from '@/ai/flows/crypto-assistant';

export async function askAI(input: CryptoAssistantInput): Promise<CryptoAssistantOutput> {
    return await cryptoAssistant(input);
}
