import Parser from 'rss-parser';
import type { NewsItem } from '../types/index.js';
import { isWithin48Hours } from '../utils/date.js';

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'Morning-Briefing-Generator/1.0'
  }
});

const RSS_FEEDS = {
  'Simon Willison': 'https://simonwillison.net/atom/everything/'
};

async function fetchRSSFeed(feedName: string, feedUrl: string): Promise<NewsItem[]> {
  try {
    const feed = await parser.parseURL(feedUrl);
    const articles: NewsItem[] = [];

    for (const item of feed.items || []) {
      if (!item.title || !item.pubDate) continue;
      
      // Filter for articles from last 48 hours
      if (isWithin48Hours(item.pubDate)) {
        articles.push({
          title: item.title,
          link: item.link || '',
          pubDate: item.pubDate,
          category: feedName
        });
      }
    }

    return articles;
  } catch (error) {
    console.error(`Failed to fetch ${feedName} RSS:`, error);
    return [];
  }
}

export async function fetchRSSFeeds(): Promise<NewsItem[]> {
  const promises = Object.entries(RSS_FEEDS).map(([name, url]) =>
    fetchRSSFeed(name, url)
  );

  try {
    const results = await Promise.allSettled(promises);
    const allArticles: NewsItem[] = [];

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        allArticles.push(...result.value);
      }
    });

    // Sort by publication date (newest first)
    return allArticles.sort((a, b) => 
      new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    );
  } catch (error) {
    console.error('Failed to fetch RSS feeds:', error);
    return [];
  }
}