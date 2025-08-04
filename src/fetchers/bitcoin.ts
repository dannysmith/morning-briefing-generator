import type { BitcoinData } from '../types/index.js';

export async function fetchBitcoin(): Promise<{ price: number; change: number } | undefined> {
  const url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Morning-Briefing-Generator/1.0'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Bitcoin API returned ${response.status}`);
    }

    const data = await response.json() as BitcoinData;
    const price = data.bitcoin.usd;
    const change = data.bitcoin.usd_24h_change;

    // Only return if change is significant (>3% as per requirements)
    if (Math.abs(change) > 3) {
      return { price, change };
    }

    return undefined;
  } catch (error) {
    console.error('Failed to fetch Bitcoin price:', error);
    return undefined;
  }
}