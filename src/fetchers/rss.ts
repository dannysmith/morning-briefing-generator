import { fetchMultipleFeeds } from '../utils/rss.js';
import { isWithin48Hours } from '../utils/date.js';

const RSS_FEEDS = {
  'Simon Willison': 'https://simonwillison.net/atom/everything/'
};

export async function fetchRSSFeeds() {
  return fetchMultipleFeeds(RSS_FEEDS, (item) => isWithin48Hours(item.pubDate));
}