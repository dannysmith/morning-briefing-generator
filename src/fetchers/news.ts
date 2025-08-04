import { fetchMultipleFeeds } from '../utils/rss.js';

const NEWS_FEEDS = {
  'BBC Politics': 'http://feeds.bbci.co.uk/news/politics/rss.xml',
  'BBC World': 'http://feeds.bbci.co.uk/news/world/rss.xml'
};

const UKRAINE_KEYWORDS = [
  'ukraine', 'ukrainian', 'kyiv', 'kiev', 'zelenskyy', 'zelensky',
  'russia', 'russian', 'putin', 'moscow', 'defence', 'defense',
  'nato', 'military', 'war', 'conflict', 'sanctions'
];

function isRelevantNews(item: any, feedName: string): boolean {
  // For BBC World, filter for relevant topics
  if (feedName === 'BBC World') {
    const text = (item.title + ' ' + (item.contentSnippet || '')).toLowerCase();
    return UKRAINE_KEYWORDS.some(keyword => text.includes(keyword));
  }
  return true; // Include all BBC Politics articles
}

export async function fetchNews() {
  const news = await fetchMultipleFeeds(NEWS_FEEDS, isRelevantNews);
  return news.slice(0, 5); // Limit to top 5
}