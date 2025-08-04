# Morning Briefing Generator

A TypeScript application that generates a daily morning briefing with weather, news, YouTube videos, RSS feeds, and other useful information. Runs automatically via GitHub Actions at 7 AM UTC daily.

## Configuration

Edit `src/config.ts` to customize:
- Location coordinates and timezone
- YouTube channels to monitor
- RSS feeds to check
- News sources and keywords
- Weather and Bitcoin alert thresholds

## Running

```bash
# Development (fastest for testing)
npm install
npm run dev

# Production build
npm run build-bundle
npm run generate-bundled
```

## GitHub Actions

The bundled script at `scripts/generate-briefing.js` runs automatically via GitHub Actions. After making changes to the source code, run `npm run build-bundle` to update the bundled version.

Files are saved to:
- `dailybriefs/YYYY-MM-DD.md` - permanent archive
- `dailybriefs/latest.md` - always the most recent briefing