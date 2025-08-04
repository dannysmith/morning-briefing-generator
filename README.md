# Morning Briefing Generator

A TypeScript application that generates a comprehensive morning briefing with weather, news, and content updates.

## Configuration

All customizable settings are in `src/config.ts`. Simply edit this file to personalize your briefing:

### =Í Location
```typescript
location: {
  name: 'Islington',
  latitude: 51.5493,
  longitude: -0.1037,
  timezone: 'Europe/London'
}
```

### =ú YouTube Channels
Add or remove YouTube channels by editing the `youtubeChannels` object:
```typescript
youtubeChannels: {
  'channelName': 'CHANNEL_ID',
  // Add more channels here
}
```

### =ð RSS Feeds
Add your favorite blogs and RSS feeds:
```typescript
rssFeeds: {
  'Simon Willison': 'https://simonwillison.net/atom/everything/',
  'Julia Evans': 'https://jvns.ca/atom.xml',
  // Add more feeds here
}
```

### =Þ News Sources
Customize news feeds and keywords for filtering:
```typescript
newsFeeds: {
  'BBC Politics': 'http://feeds.bbci.co.uk/news/politics/rss.xml',
  // Add more news sources
},
newsKeywords: ['ukraine', 'russia', 'nato', ...] // Topics to filter
```

### =' Other Settings
- **Bitcoin threshold**: Change when to show Bitcoin price (default: 3% change)
- **Weather thresholds**: Adjust umbrella recommendation levels
- **Content settings**: Change how many hours back to look for content

## Running Locally

```bash
# Install dependencies
npm install

# Run the briefing generator
npm run dev

# Or build and run
npm run build
npm run generate
```

## Output

The briefing includes:
- <! Weather with umbrella recommendations
- <
 Tide times (London Bridge)
- =° Bitcoin price (if significant change)
- =ð Top news articles with links
- =ú New YouTube videos from your channels
- =Ý Recent blog posts from RSS feeds

All items include clickable links and relative timestamps (e.g., "2 hours ago").