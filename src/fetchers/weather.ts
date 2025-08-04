import type { WeatherData } from '../types/index.js';
import { formatLondonTime } from '../utils/date.js';
import { fetchWithTimeout } from '../utils/fetch.js';

const ISLINGTON_LAT = 51.5493;
const ISLINGTON_LNG = -0.1037;

export async function fetchWeather(): Promise<WeatherData | null> {
  const url = `https://api.open-meteo.com/v1/forecast?` +
    `latitude=${ISLINGTON_LAT}&longitude=${ISLINGTON_LNG}&` +
    `current=temperature_2m,weather_code&` +
    `hourly=temperature_2m,precipitation_probability,precipitation,rain,weather_code&` +
    `daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&` +
    `timezone=Europe/London&forecast_days=1`;

  try {
    const response = await fetchWithTimeout(url);
    
    if (!response.ok) {
      throw new Error(`Weather API returned ${response.status}`);
    }

    return await response.json() as WeatherData;
  } catch (error) {
    console.error('Failed to fetch weather:', error);
    return null;
  }
}

export function getUmbrellaRecommendation(hourlyRain: number[]): string {
  const next8Hours = hourlyRain.slice(0, 8);
  const maxRain = Math.max(...next8Hours);
  
  if (maxRain > 50) return "🌂 Take umbrella - rain likely";
  if (maxRain > 30) return "🤔 Maybe take umbrella - possible rain";
  return "☀️ No umbrella needed";
}

export function getRainTiming(hourlyTimes: string[], hourlyRain: number[]): string {
  const next8Hours = hourlyRain.slice(0, 8);
  const maxRainIndex = next8Hours.indexOf(Math.max(...next8Hours));
  const maxRain = next8Hours[maxRainIndex];

  if (maxRain <= 30) {
    return "No significant rain expected";
  }

  const peakTime = formatLondonTime(hourlyTimes[maxRainIndex], 'ha');
  return `Peak rain: ${peakTime} (${maxRain}%)`;
}