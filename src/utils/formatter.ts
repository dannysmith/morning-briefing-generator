import type { BriefingData, TideData, VideoItem, NewsItem } from '../types/index.js';
import { getCurrentDateString } from './date.js';

export function formatBriefing(data: BriefingData): string {
  const sections: string[] = [];

  // Header
  sections.push(`🌅 Morning Briefing - ${getCurrentDateString()}`);
  sections.push('');

  // Weather & Conditions
  sections.push('## Weather & Conditions (Islington)');
  sections.push('');
  sections.push(`🌡️ Current: ${data.weather.current}°C | High today: ${data.weather.high}°C`);
  sections.push(`🌧️ Rain: ${data.weather.umbrellaRecommendation}`);
  if (data.weather.rainTiming !== 'No significant rain expected') {
    sections.push(`   ${data.weather.rainTiming}`);
  }
  sections.push(`🌅 Sunrise: ${data.weather.sunrise} | 🌇 Sunset: ${data.weather.sunset}`);
  
  // Tides
  if (data.tides.length > 0) {
    const tidesText = formatTides(data.tides);
    sections.push(`🌊 Tides: ${tidesText}`);
  }
  sections.push('');

  // Markets (only if significant Bitcoin change)
  if (data.bitcoin) {
    sections.push('## Markets');
    sections.push('');
    const changeSymbol = data.bitcoin.change > 0 ? '+' : '';
    sections.push(`Bitcoin: $${data.bitcoin.price.toLocaleString()} (${changeSymbol}${data.bitcoin.change.toFixed(1)}% 24h)`);
    sections.push('');
  }

  // News Highlights
  if (data.news.length > 0) {
    sections.push('## News Highlights');
    sections.push('');
    data.news.forEach(item => {
      sections.push(`${item.title} - ${item.category}`);
    });
    sections.push('');
  }

  // New Content
  const hasNewContent = data.videos.length > 0 || data.articles.length > 0;
  if (hasNewContent) {
    sections.push('## New Content (48h)');
    
    // YouTube Videos
    if (data.videos.length > 0) {
      sections.push('### 📺 YouTube:');
      sections.push('');
      data.videos.forEach(video => {
        sections.push(`${video.channel}: ${video.title}`);
      });
      sections.push('');
    }

    // Articles
    if (data.articles.length > 0) {
      sections.push('### 📝 Articles:');
      sections.push('');
      data.articles.forEach(article => {
        sections.push(`${article.category}: ${article.title}`);
      });
      sections.push('');
    }
  }

  return sections.join('\n');
}

function formatTides(tides: TideData[]): string {
  const high = tides.find(t => t.type === 'High');
  const low = tides.find(t => t.type === 'Low');
  
  const parts: string[] = [];
  
  if (high) {
    parts.push(`High ${high.time} (${high.height}m)`);
  }
  
  if (low) {
    parts.push(`Low ${low.time} (${low.height}m)`);
  }
  
  return parts.join(', ');
}