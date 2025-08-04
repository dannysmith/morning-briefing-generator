import Parser from 'rss-parser';
import type { TideData } from '../types/index.js';

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'Morning-Briefing-Generator/1.0'
  }
});

export async function fetchTides(): Promise<TideData[]> {
  const url = 'https://www.tidetimes.org.uk/london-bridge-tower-pier-tide-times.rss';

  try {
    const feed = await parser.parseURL(url);
    
    if (!feed.items || feed.items.length === 0) {
      console.error('No tide data found in RSS feed');
      return [];
    }

    const todayItem = feed.items[0];
    if (!todayItem.content) {
      console.error('No tide content found in RSS item');
      return [];
    }

    // Parse tide times from description
    // Format: "HH:MM - Tide Type (Height)" e.g., "10:07 - High Tide (5.51m)"
    const tideRegex = /(\d{2}:\d{2}) - (High|Low) Tide \(([^)]+)\)/g;
    const tides: TideData[] = [];
    
    let match;
    while ((match = tideRegex.exec(todayItem.content)) !== null) {
      tides.push({
        time: match[1],
        type: match[2] as 'High' | 'Low',
        height: match[3]
      });
    }

    return tides.sort((a, b) => a.time.localeCompare(b.time));
  } catch (error) {
    console.error('Failed to fetch tide times:', error);
    return [];
  }
}