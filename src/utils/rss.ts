import Parser from 'rss-parser';
import type { NewsItem } from '../types/index.js';

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'Morning-Briefing-Generator/1.0'
  }
});

export async function fetchMultipleFeeds(
  feeds: Record<string, string>,
  filterFn?: (item: any, feedName: string) => boolean
): Promise<NewsItem[]> {
  const promises = Object.entries(feeds).map(async ([name, url]) => {
    try {
      const feed = await parser.parseURL(url);
      return (feed.items || [])
        .filter(item => item.title && item.pubDate)
        .filter(item => !filterFn || filterFn(item, name))
        .map(item => ({
          title: item.title!,
          link: item.link || '',
          pubDate: item.pubDate!,
          category: name
        }));
    } catch (error) {
      console.error(`Failed to fetch ${name}:`, error);
      return [];
    }
  });

  const results = await Promise.allSettled(promises);
  return results
    .filter(result => result.status === 'fulfilled')
    .flatMap(result => result.value)
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
}