import { fetchMultipleFeeds } from '../utils/rss.js';
import { config } from '../config.js';

function isRelevantNews(item: any, feedName: string): boolean {
  // For BBC World, filter for relevant topics
  if (feedName === 'BBC World') {
    const text = (item.title + ' ' + (item.contentSnippet || '')).toLowerCase();
    return config.newsKeywords.some(keyword => text.includes(keyword));
  }
  return true; // Include all BBC Politics articles
}

export async function fetchNews() {
  const news = await fetchMultipleFeeds(config.newsFeeds, isRelevantNews);
  return news.slice(0, config.content.maxNewsItems);
}