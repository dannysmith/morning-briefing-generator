export const config = {
  // Location for weather (Islington, London)
  location: {
    name: 'Islington',
    latitude: 51.5493,
    longitude: -0.1037,
    timezone: 'Europe/London'
  },

  // YouTube channels to monitor
  youtubeChannels: {
    't3dotgg': 'UCbRP3c757lWg9M-U7TyEkXA',
    'howiaipodcast': 'UCJKt_QVDyUbqdm3ag_py2eQ',
    'AlecSteele': 'UCWizIdwZdmr43zfxlCktmNw',
    'colinfurze': 'UCp68_FLety0O-n9QU6phsgw'
  },

  // RSS feeds to monitor (name: url)
  rssFeeds: {
    'Simon Willison': 'https://simonwillison.net/atom/everything/'
    // Add more RSS feeds here, e.g.:
    // 'Julia Evans': 'https://jvns.ca/atom.xml',
    // 'Dan Luu': 'https://danluu.com/atom.xml'
  },

  // News RSS feeds
  newsFeeds: {
    'BBC Politics': 'http://feeds.bbci.co.uk/news/politics/rss.xml',
    'BBC World': 'http://feeds.bbci.co.uk/news/world/rss.xml'
    // Add more news feeds here
  },

  // Keywords to filter BBC World news (lowercase)
  newsKeywords: [
    'ukraine', 'ukrainian', 'kyiv', 'kiev', 'zelenskyy', 'zelensky',
    'russia', 'russian', 'putin', 'moscow', 'defence', 'defense',
    'nato', 'military', 'war', 'conflict', 'sanctions'
  ],

  // Tide location RSS feed
  tideFeed: 'https://www.tidetimes.org.uk/london-bridge-tower-pier-tide-times.rss',

  // Bitcoin settings
  bitcoin: {
    // Only show if change is greater than this percentage
    significantChangeThreshold: 3
  },

  // Weather settings
  weather: {
    // Hours ahead to check for rain
    hoursAhead: 8,
    // Rain probability thresholds
    rainThresholds: {
      definitelyNeed: 50,  // "Take umbrella"
      maybeNeed: 30        // "Maybe take umbrella"
    }
  },

  // Content settings
  content: {
    // Hours to look back for new content
    recentHours: 48,
    // Maximum number of news articles to show
    maxNewsItems: 8
  }
};
