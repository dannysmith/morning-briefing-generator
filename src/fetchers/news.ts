import Parser from 'rss-parser';
import type { NewsItem } from '../types/index.js';

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'Morning-Briefing-Generator/1.0'
  }
});

const NEWS_FEEDS = {
  'BBC Politics': 'http://feeds.bbci.co.uk/news/politics/rss.xml',
  'BBC World': 'http://feeds.bbci.co.uk/news/world/rss.xml'
};

const UKRAINE_KEYWORDS = [
  'ukraine', 'ukrainian', 'kyiv', 'kiev', 'zelenskyy', 'zelensky',
  'russia', 'russian', 'putin', 'moscow', 'defence', 'defense',
  'nato', 'military', 'war', 'conflict', 'sanctions'
];

function isRelevantNews(title: string, description?: string): boolean {
  const text = (title + ' ' + (description || '')).toLowerCase();
  return UKRAINE_KEYWORDS.some(keyword => text.includes(keyword));
}

async function fetchFeedNews(feedName: string, feedUrl: string): Promise<NewsItem[]> {
  try {
    const feed = await parser.parseURL(feedUrl);
    const news: NewsItem[] = [];

    for (const item of feed.items?.slice(0, 10) || []) {
      if (!item.title || !item.pubDate) continue;

      // For BBC World, filter for relevant topics
      if (feedName === 'BBC World' && !isRelevantNews(item.title, item.contentSnippet)) {
        continue;
      }

      news.push({
        title: item.title,
        link: item.link || '',
        pubDate: item.pubDate,
        category: feedName
      });
    }

    return news;
  } catch (error) {
    console.error(`Failed to fetch ${feedName} news:`, error);
    return [];
  }
}

export async function fetchNews(): Promise<NewsItem[]> {
  const promises = Object.entries(NEWS_FEEDS).map(([name, url]) =>
    fetchFeedNews(name, url)
  );

  try {
    const results = await Promise.allSettled(promises);
    const allNews: NewsItem[] = [];

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        allNews.push(...result.value);
      }
    });

    // Sort by publication date (newest first) and limit to top 5
    return allNews
      .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
      .slice(0, 5);
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return [];
  }
}