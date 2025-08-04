# Morning Briefing Research

When starting a new conversation, immediately provide a morning briefing with the following information. Be efficient by batching requests where possible.

## Execution Order (Optimize for Speed)

1. **Bitcoin Price Check (1 fetch)**

   - Fetch: `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true`
   - Only report if 24h change is greater than ±3%
   - Format: "Bitcoin: $X (±Y%)" or skip if change is minor

2. **Weather & Astronomical Data (2 fetches)**

   - Weather + Sunrise/Sunset: Fetch `https://api.sunrise-sunset.org/json?lat=51.5074&lng=-0.1278&formatted=0`
   - Current weather: Search "London weather today forecast" and extract from results
   - Report: Today's weather, sunrise/sunset, first/last light times

3. **Tide Times (1 fetch)**

   - Fetch: `https://www.tidetimes.org.uk/london-bridge-tower-pier-tide-times.rss`
   - Extract today's high/low tide times

4. **YouTube Channels (Batch fetch)**
   Extract channel IDs and batch check these RSS feeds for videos from last 48 hours:

   - t3dotgg: `https://www.youtube.com/feeds/videos.xml?channel_id=UCbRP3c757lWg9M-U7TyEkXA`
   - howiaipodcast: `https://www.youtube.com/feeds/videos.xml?channel_id=UCJKt_QVDyUbqdm3ag_py2eQ`
   - AlecSteele: `https://www.youtube.com/feeds/videos.xml?channel_id=UCWizIdwZdmr43zfxlCktmNw`
   - colinfurze: `https://www.youtube.com/feeds/videos.xml?channel_id=UCp68_FLety0O-n9QU6phsgw`
   - FallowLondon: `https://www.youtube.com/feeds/videos.xml?channel_id=UC4AHgEZmzfPREQJBFeLNDOg`
   - Pixlriffs: `https://www.youtube.com/feeds/videos.xml?channel_id=UC1hBl2MHLBkoXKEh21ZwECw`

5. **RSS Feeds (1 fetch)**
   Check these feeds for posts from last 48 hours:

   - Simon Willison: `https://simonwillison.net/atom/everything/`
     [Additional RSS feeds to be added here]

6. **BBC News (1 search)**
   - Search: "BBC News UK politics defence Ukraine today"
   - Filter results for: Politics, Ukraine war, UK defence, major breaking news
   - Exclude: Celebrity news, sports (unless major), lifestyle

## Efficiency Rules

1. Use web_fetch for direct URLs (RSS feeds, APIs)
2. Use web_search sparingly (only for BBC News and weather if needed)
3. Parse RSS feeds to check timestamps - only include items < 48 hours old
4. If any fetch fails, skip that section rather than retry
5. Keep descriptions brief - just titles and essential info
6. Total execution should take < 30 seconds

## Error Handling

If unable to fetch any component:

- Skip it silently unless it's weather (then use web_search as backup)
- Don't apologize or explain failures
- Focus on delivering available information quickly

## User Location Note

Default to London for weather/tides. If user provides location context, adapt accordingly but note that tide data may not be available for all locations.

# The Morning Briefing

## Output Format for Morning Briefing - ENHANCED

Present the briefing in this order:

```
🌅 Morning Briefing - [Current Date]
## Weather & Conditions (Islington)

🌡️ Current: [temp]°C | High today: [max_temp]°C
🌧️ Rain: [umbrella_recommendation]
   Next 8 hours: [hourly probabilities if >30%]
   Peak rain time: [time range if applicable]
🌅 Sunrise: [time] | 🌇 Sunset: [time]
🌊 Tides: High [time] ([height]m), Low [time] ([height]m)

[Only if significant]
## Markets

Bitcoin: $[price] ([change]% 24h)

## News Highlights

[BBC article 1 title - category]
[BBC article 2 title - category]
[Up to 5 relevant articles]

## New Content (48h)
### 📺 YouTube:

[Channel]: [Video title]
[List all new videos]

### 📝 Articles:

[Source]: [Article title]
[List all new posts]
```

### Weather Display Logic:
- **Umbrella needed**: If any hour >50% rain probability
- **Maybe take umbrella**: If any hour 30-50% probability  
- **No umbrella needed**: If all hours <30% probability
- **Rain timing**: Show hours with >30% probability

---

# TypeScript Implementation Strategy for GitHub Actions (Verified)

## Architecture Overview

### Technology Stack

- **Language**: TypeScript with Node.js 20 runtime
- **HTTP Client**: Native fetch API (lightweight, no dependencies)
- **XML/RSS Parser**: `rss-parser` for all RSS feeds (consistent API)
- **Date Handling**: `date-fns` and `date-fns-tz` for timezone support
- **Parallel Processing**: Promise.allSettled() for resilient concurrent fetching
- **Weather API**: Open-Meteo (free, no API key required)
- **News Source**: BBC RSS feeds (verified and working)

### Key Design Decisions (Updated After Research)

1. **Parallel Fetching Strategy - REVISED**

   - Use Promise.allSettled() for ALL calls to handle failures gracefully
   - Single parallel batch (not sequential) for maximum speed:
     - All 12+ API calls execute simultaneously
     - 10-second timeout per request
     - Total execution target: 15-20 seconds (realistic)
   - Each failure is isolated and doesn't break other requests

2. **Library Choices - VERIFIED**

   - `rss-parser` (3.13.0): Handles all RSS feeds including YouTube, BBC, tides
   - `date-fns` + `date-fns-tz`: Proper timezone handling for London BST/GMT
   - Native fetch: Built into Node.js 18+, no polyfill needed
   - Skip fast-xml-parser: rss-parser handles tide RSS well

3. **Weather Implementation - ENHANCED FOR ISLINGTON**

   - Open-Meteo API (confirmed working, no key required)
   - **Islington-specific coordinates**: 51.5493, -0.1037
   - Enhanced URL with detailed precipitation data:
     ```
     https://api.open-meteo.com/v1/forecast?
       latitude=51.5493&
       longitude=-0.1037&
       current=temperature_2m,weather_code&
       hourly=temperature_2m,precipitation_probability,precipitation,rain,weather_code&
       daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&
       timezone=Europe/London&
       forecast_days=1
     ```
   - **Provides umbrella intelligence**:
     - Today's max temperature
     - Hourly rain probability (0-100%)
     - Rain timing predictions
     - Weather condition codes
   - **Alternative considered**: Met Office DataPoint (free but retiring Dec 2025)

4. **BBC News Strategy - VERIFIED WORKING**
   - Confirmed RSS feeds:
     - UK Politics: `http://feeds.bbci.co.uk/news/politics/rss.xml` ✅
     - World News: `http://feeds.bbci.co.uk/news/world/rss.xml` ✅
   - Date format: "Mon, 04 Aug 2025 10:12:01 GMT"
   - Filter for Ukraine/defense keywords in title/description
   - No API key needed, public RSS feeds

5. **Tide Times - VERIFIED FORMAT**
   - URL works: `https://www.tidetimes.org.uk/london-bridge-tower-pier-tide-times.rss`
   - Single RSS item per day with all tides in description
   - Format: "HH:MM - Tide Type (Height)" e.g., "10:07 - High Tide (5.51m)"
   - Requires parsing description field to extract individual tides

6. **YouTube RSS - VERIFIED FORMAT**
   - All channel RSS URLs confirmed working
   - Date format: ISO 8601 with timezone (2025-08-04T06:21:55+00:00)
   - Use `published` field for filtering (not `updated`)
   - 48-hour filter: Compare Date.parse() with current time

7. **Timezone Handling - CRITICAL**
   - Set TZ=Europe/London in GitHub Actions environment
   - Use date-fns-tz formatInTimeZone() for all display times
   - All comparisons in UTC, display in London time
   - Handles BST/GMT transitions automatically

## Project Structure

```
morning-briefing-generator/
├── src/
│   ├── index.ts           # Main entry point
│   ├── fetchers/
│   │   ├── bitcoin.ts     # Bitcoin price fetcher
│   │   ├── weather.ts     # Weather & astronomical data
│   │   ├── tides.ts       # Tide times fetcher
│   │   ├── youtube.ts     # YouTube RSS fetcher
│   │   ├── rss.ts         # General RSS fetcher
│   │   └── news.ts        # BBC News fetcher
│   ├── parsers/
│   │   ├── rss.ts         # RSS parsing utilities
│   │   └── xml.ts         # XML parsing utilities
│   ├── types/
│   │   └── index.ts       # TypeScript interfaces
│   └── utils/
│       ├── date.ts        # Date utilities
│       └── formatter.ts   # Output formatting
├── .github/
│   └── workflows/
│       └── morning-briefing.yml
├── package.json
├── tsconfig.json
├── .gitignore
└── README.md
```

## GitHub Actions Configuration - REVISED

```yaml
name: Morning Briefing
on:
  schedule:
    - cron: '0 7 * * *' # 7 AM UTC daily (8 AM BST / 7 AM GMT)
  workflow_dispatch: # Manual trigger

jobs:
  generate-briefing:
    runs-on: ubuntu-latest
    env:
      TZ: Europe/London # Critical for correct timezone handling
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - run: npm run generate
      
      # Output Strategy Options (choose one):
      
      # Option 1: Simple console output (recommended)
      # The briefing will be in the Actions log
      
      # Option 2: Create artifact
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: morning-briefing-${{ github.run_id }}
          path: briefing.md
          retention-days: 7
      
      # Option 3: Update README (not recommended - too many commits)
      # Option 4: Send to webhook/Slack/Discord (requires setup)
```

## Performance Optimizations - REALISTIC

1. **Concurrent Fetching**: Promise.allSettled() for all 12+ requests
2. **Lightweight Dependencies**: Native fetch, minimal libraries
3. **Error Resilience**: Individual failures don't break the briefing
4. **Caching**: GitHub Actions npm cache reduces install time
5. **Timeout Management**: 10-second timeout per request, 30-second total limit

## Error Handling Strategy - IMPROVED

1. **Graceful Degradation**: Failed sections omitted from output
2. **Error Logging**: Console.error() for debugging (visible in Actions log)
3. **Partial Success**: Always generate briefing with available data
4. **No Retries**: Speed over completeness
5. **Timeout Protection**: AbortController with 10s timeout per fetch

## Weather Code Mapping

```typescript
const weatherCodes: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  95: 'Thunderstorm',
  // Add more as needed
};
```

## Dependencies - FINAL

```json
{
  "name": "morning-briefing-generator",
  "type": "module",
  "scripts": {
    "build": "tsc",
    "generate": "node dist/index.js",
    "dev": "tsx src/index.ts"
  },
  "dependencies": {
    "rss-parser": "^3.13.0",
    "date-fns": "^3.0.0",
    "date-fns-tz": "^2.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "tsx": "^4.0.0"
  }
}
```

## Key Benefits - VERIFIED

1. **Speed**: Realistic 15-20 second execution time
2. **Reliability**: All APIs verified working, no keys needed
3. **Maintainability**: Single parser library, consistent patterns
4. **Cost**: Completely free
5. **Simplicity**: Minimal dependencies, clear error handling

## Implementation Notes - UPDATED

1. **RSS Parsing**: Use rss-parser for everything (YouTube, BBC, tides, blogs)
2. **Date Filtering**: Use date-fns isWithinInterval() for 48-hour check
3. **Timezone**: Always display in Europe/London time
4. **Weather Logic**: Implement umbrella recommendations based on hourly rain probability
5. **Output**: Console.log() the markdown, let GitHub Actions capture it
6. **Testing**: Test locally with `npm run dev` before deploying

## Weather Implementation Details

```typescript
interface WeatherData {
  current: { temperature_2m: number; weather_code: number };
  hourly: {
    time: string[];
    precipitation_probability: number[];
    temperature_2m: number[];
  };
  daily: {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    sunrise: string[];
    sunset: string[];
  };
}

function getUmbrellaRecommendation(hourlyRain: number[]): string {
  const maxRain = Math.max(...hourlyRain.slice(0, 8)); // Next 8 hours
  if (maxRain > 50) return "🌂 Take umbrella - rain likely";
  if (maxRain > 30) return "🤔 Maybe take umbrella - possible rain";
  return "☀️ No umbrella needed";
}
```

## Known Limitations - UPDATED

1. **Tide Times**: Only available for London Bridge location
2. **BBC News**: No way to filter by exact topics via RSS
3. **Rate Limits**: No retry logic if services rate limit
4. **Weather Accuracy**: Forecast accuracy decreases beyond 8 hours
5. **Location**: Weather fixed to Islington coordinates
