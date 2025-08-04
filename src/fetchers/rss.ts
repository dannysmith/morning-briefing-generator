import { fetchMultipleFeeds } from '../utils/rss.js';
import { isWithin48Hours } from '../utils/date.js';
import { config } from '../config.js';

export async function fetchRSSFeeds() {
  return fetchMultipleFeeds(config.rssFeeds, (item) => isWithin48Hours(item.pubDate));
}