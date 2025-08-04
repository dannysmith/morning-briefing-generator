import type { WeatherData } from '../types/index.js';
import { formatLondonTime } from '../utils/date.js';
import { fetchWithTimeout } from '../utils/fetch.js';
import { config } from '../config.js';

export async function fetchWeather(): Promise<WeatherData | null> {
  const { latitude, longitude, timezone } = config.location;
  const url = `https://api.open-meteo.com/v1/forecast?` +
    `latitude=${latitude}&longitude=${longitude}&` +
    `current=temperature_2m,weather_code&` +
    `hourly=temperature_2m,precipitation_probability,precipitation,rain,weather_code&` +
    `daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&` +
    `timezone=${timezone}&forecast_days=1`;

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
  const { hoursAhead, rainThresholds } = config.weather;
  const nextHours = hourlyRain.slice(0, hoursAhead);
  const maxRain = Math.max(...nextHours);
  
  if (maxRain > rainThresholds.definitelyNeed) return "🌂 Take umbrella - rain likely";
  if (maxRain > rainThresholds.maybeNeed) return "🤔 Maybe take umbrella - possible rain";
  return "☀️ No umbrella needed";
}

export function getRainTiming(hourlyTimes: string[], hourlyRain: number[]): string {
  const { hoursAhead, rainThresholds } = config.weather;
  const nextHours = hourlyRain.slice(0, hoursAhead);
  const maxRainIndex = nextHours.indexOf(Math.max(...nextHours));
  const maxRain = nextHours[maxRainIndex];

  if (maxRain <= rainThresholds.maybeNeed) {
    return "No significant rain expected";
  }

  const peakTime = formatLondonTime(hourlyTimes[maxRainIndex], 'ha');
  return `Peak rain: ${peakTime} (${maxRain}%)`;
}