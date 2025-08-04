import type { WeatherData } from '../types/index.js';
import { formatLondonTime } from '../utils/date.js';

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
      throw new Error(`Weather API returned ${response.status}`);
    }

    const data = await response.json() as WeatherData;
    return data;
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
  const significantRain = next8Hours
    .map((rain, index) => ({ rain, time: hourlyTimes[index], index }))
    .filter(item => item.rain > 30)
    .sort((a, b) => b.rain - a.rain);

  if (significantRain.length === 0) {
    return "No significant rain expected";
  }

  const topRain = significantRain[0];
  const timeFormatted = formatLondonTime(topRain.time, 'ha');
  
  if (significantRain.length === 1) {
    return `Peak rain: ${timeFormatted} (${topRain.rain}%)`;
  }

  const startTime = formatLondonTime(significantRain[significantRain.length - 1].time, 'ha');
  const endTime = formatLondonTime(significantRain[0].time, 'ha');
  
  return `Rain period: ${startTime}-${endTime} (peak ${topRain.rain}% at ${timeFormatted})`;
}