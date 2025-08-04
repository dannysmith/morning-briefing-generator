import type { BitcoinData } from '../types/index.js';
import { fetchWithTimeout } from '../utils/fetch.js';

export async function fetchBitcoin(): Promise<{ price: number; change: number } | undefined> {
  const url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true';

  try {
    const response = await fetchWithTimeout(url);
    
    if (!response.ok) {
      throw new Error(`Bitcoin API returned ${response.status}`);
    }

    const data = await response.json() as BitcoinData;
    const { usd: price, usd_24h_change: change } = data.bitcoin;

    // Only return if change is significant (>3%)
    return Math.abs(change) > 3 ? { price, change } : undefined;
  } catch (error) {
    console.error('Failed to fetch Bitcoin price:', error);
    return undefined;
  }
}