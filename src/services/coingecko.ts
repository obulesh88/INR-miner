import type { CryptoData } from '@/lib/types';

const coinGeckoIdMap: Record<string, string> = {
  btc: 'bitcoin',
  eth: 'ethereum',
  doge: 'dogecoin',
};

/**
 * Gets the current price and 24-hour percentage change of a cryptocurrency from its symbol.
 * This function is used as a tool by the Genkit AI assistant.
 * @param input An object containing the cryptocurrency symbol.
 * @param input.symbol The cryptocurrency symbol (e.g., BTC, ETH, DOGE).
 */
export async function getCryptoPrice(input: {
  symbol: string;
}): Promise<{ price: number; change24h: number }> {
  const symbol = input.symbol.toLowerCase();
  const coinId = coinGeckoIdMap[symbol];
  if (!coinId) {
    throw new Error(
      `Unsupported crypto symbol: ${symbol}. Supported symbols are BTC, ETH, DOGE.`
    );
  }

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`
    );
    if (!response.ok) {
      throw new Error(
        `Failed to fetch data from CoinGecko API: ${response.statusText}`
      );
    }
    const data = await response.json();

    const price = data[coinId]?.usd;
    const change24h = data[coinId]?.usd_24h_change;

    if (price === undefined || change24h === undefined) {
      throw new Error(`Could not parse price or 24h change for ${symbol}`);
    }

    return { price, change24h };
  } catch (error) {
    console.error('Error fetching crypto price:', error);
    throw new Error(`Could not fetch cryptocurrency price for ${symbol}.`);
  }
}

export async function getMarketData(
  coinIds: string[]
): Promise<CryptoData[]> {
  if (coinIds.length === 0) return [];
  const ids = coinIds.join(',');
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`
    );
    if (!response.ok) {
      console.error(
        `Failed to fetch market data from CoinGecko API: ${response.statusText}`
      );
      return [];
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching market data:', error);
    return [];
  }
}
