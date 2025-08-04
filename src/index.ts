import { fetchWeather, getUmbrellaRecommendation, getRainTiming } from './fetchers/weather.js';
import { fetchBitcoin } from './fetchers/bitcoin.js';
import { fetchTides } from './fetchers/tides.js';
import { fetchYouTubeVideos } from './fetchers/youtube.js';
import { fetchNews } from './fetchers/news.js';
import { fetchRSSFeeds } from './fetchers/rss.js';
import { formatBriefing } from './utils/formatter.js';
import { formatLondonTime } from './utils/date.js';
import type { BriefingData } from './types/index.js';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { config } from './config.js';

async function generateBriefing(): Promise<void> {
  console.log('🌅 Generating morning briefing...\n');

  // Fetch all data in parallel
  const [
    weatherData,
    bitcoinData,
    tidesData,
    videosData,
    newsData,
    articlesData
  ] = await Promise.allSettled([
    fetchWeather(),
    fetchBitcoin(),
    fetchTides(),
    fetchYouTubeVideos(),
    fetchNews(),
    fetchRSSFeeds()
  ]);

  // Process weather data
  const weather = weatherData.status === 'fulfilled' && weatherData.value ? {
    current: Math.round(weatherData.value.current.temperature_2m),
    high: Math.round(weatherData.value.daily.temperature_2m_max[0]),
    umbrellaRecommendation: getUmbrellaRecommendation(weatherData.value.hourly.precipitation_probability),
    rainTiming: getRainTiming(weatherData.value.hourly.time, weatherData.value.hourly.precipitation_probability),
    sunrise: formatLondonTime(weatherData.value.daily.sunrise[0]),
    sunset: formatLondonTime(weatherData.value.daily.sunset[0])
  } : {
    current: 0,
    high: 0,
    umbrellaRecommendation: '❓ Weather data unavailable',
    rainTiming: 'Weather data unavailable',
    sunrise: 'N/A',
    sunset: 'N/A'
  };

  // Extract successful results, defaulting to empty arrays for failures
  const bitcoin = bitcoinData.status === 'fulfilled' ? bitcoinData.value : undefined;
  const tides = tidesData.status === 'fulfilled' ? tidesData.value : [];
  const videos = videosData.status === 'fulfilled' ? videosData.value : [];
  const news = newsData.status === 'fulfilled' ? newsData.value : [];
  const articles = articlesData.status === 'fulfilled' ? articlesData.value : [];

  // Build briefing data
  const briefing: BriefingData = {
    weather,
    tides,
    bitcoin,
    news,
    videos,
    articles
  };

  // Generate the briefing
  const formattedBriefing = formatBriefing(briefing);
  
  // Create dailybriefs directory if it doesn't exist
  const dailyBriefsDir = join(process.cwd(), 'dailybriefs');
  if (!existsSync(dailyBriefsDir)) {
    mkdirSync(dailyBriefsDir, { recursive: true });
    console.log('📁 Created dailybriefs directory');
  }

  // Generate filename with date in London timezone
  const dateString = formatInTimeZone(new Date(), config.location.timezone, 'yyyy-MM-dd');
  const datedFilename = join(dailyBriefsDir, `${dateString}.md`);
  const latestFilename = join(dailyBriefsDir, 'latest.md');

  // Check if today's briefing already exists (duplicate run protection)
  if (existsSync(datedFilename)) {
    console.log(`⚠️  Today's briefing already exists: ${dateString}.md`);
    console.log('   Updating latest.md only...');
    writeFileSync(latestFilename, formattedBriefing, 'utf8');
    console.log(`📝 Updated: dailybriefs/latest.md`);
  } else {
    // Write to both files
    writeFileSync(datedFilename, formattedBriefing, 'utf8');
    writeFileSync(latestFilename, formattedBriefing, 'utf8');
    
    console.log(`📝 Morning briefing written to:`);
    console.log(`   - dailybriefs/${dateString}.md (archived)`);
    console.log(`   - dailybriefs/latest.md (always current)`);
  }

  // Log summary statistics
  console.log('\n📊 Summary:');
  console.log(`- Weather: ${weather.current > 0 ? '✅' : '❌'} Available`);
  console.log(`- Bitcoin: ${bitcoin ? '✅' : '❌'} ${bitcoin ? 'Significant change' : 'No significant change'}`);
  console.log(`- Tides: ${tides.length} entries`);
  console.log(`- News: ${news.length} articles`);
  console.log(`- Videos: ${videos.length} new videos`);
  console.log(`- Articles: ${articles.length} new articles`);
  
  // Exit successfully
  process.exit(0);
}

// Run the briefing generator
generateBriefing().catch(error => {
  console.error('❌ Failed to generate briefing:', error);
  process.exit(1);
});