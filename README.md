# Morning Briefing Generator

A TypeScript application that generates a comprehensive morning briefing with weather, news, and content updates.

## Configuration

All customizable settings are in `src/config.ts`. Simply edit this file to personalize your briefing:

### =� Location
```typescript
location: {
  name: 'Islington',
  latitude: 51.5493,
  longitude: -0.1037,
  timezone: 'Europe/London'
}
```

### =� YouTube Channels
Add or remove YouTube channels by editing the `youtubeChannels` object:
```typescript
youtubeChannels: {
  'channelName': 'CHANNEL_ID',
  // Add more channels here
}
```

### =� RSS Feeds
Add your favorite blogs and RSS feeds:
```typescript
rssFeeds: {
  'Simon Willison': 'https://simonwillison.net/atom/everything/',
  'Julia Evans': 'https://jvns.ca/atom.xml',
  // Add more feeds here
}
```

### =� News Sources
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

# Development (fastest for testing)
npm run dev

# Build and run normally
npm run build
npm run generate

# Build bundled version for GitHub Actions
npm run build-bundle
npm run generate-bundled
```

## GitHub Actions

The repository includes a GitHub Action that:
- Runs daily at 7 AM UTC (8 AM BST / 7 AM GMT)
- Executes the pre-bundled script (`scripts/generate-briefing.js`)
- Commits the new briefing files automatically
- Can be triggered manually

The bundled version includes all dependencies in a single 204kB file, making the action run very fast.

**Important**: After making code changes, run `npm run build-bundle` to update the bundled script that GitHub Actions uses.

The briefing will be saved to:
- `dailybriefs/YYYY-MM-DD.md` (e.g., `dailybriefs/2024-08-04.md`) - permanent archive
- `dailybriefs/latest.md` - always contains the most recent briefing (constant URL)

## Output

The briefing markdown file includes:
- <! Weather with umbrella recommendations
- <
 Tide times (London Bridge)
- =� Bitcoin price (if significant change)
- =� Top news articles with links
- =� New YouTube videos from your channels
- =� Recent blog posts from RSS feeds

All items include clickable links and relative timestamps (e.g., "2 hours ago").