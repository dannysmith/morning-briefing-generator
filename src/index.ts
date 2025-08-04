import { fetchWeather, getUmbrellaRecommendation, getRainTiming } from './fetchers/weather.js';
import { fetchBitcoin } from './fetchers/bitcoin.js';
import { fetchTides } from './fetchers/tides.js';
import { fetchYouTubeVideos } from './fetchers/youtube.js';
import { fetchNews } from './fetchers/news.js';
import { fetchRSSFeeds } from './fetchers/rss.js';
import { formatBriefing } from './utils/formatter.js';
import { formatLondonTime } from './utils/date.js';
import type { BriefingData } from './types/index.js';

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

  // Generate and output the briefing
  const formattedBriefing = formatBriefing(briefing);
  
  console.log('📋 Morning Briefing Generated:\n');
  console.log('=' .repeat(50));
  console.log(formattedBriefing);
  console.log('=' .repeat(50));

  // Log summary statistics
  console.log('\n📊 Summary:');
  console.log(`- Weather: ${weather.current > 0 ? '✅' : '❌'} Available`);
  console.log(`- Bitcoin: ${bitcoin ? '✅' : '❌'} ${bitcoin ? 'Significant change' : 'No significant change'}`);
  console.log(`- Tides: ${tides.length} entries`);
  console.log(`- News: ${news.length} articles`);
  console.log(`- Videos: ${videos.length} new videos`);
  console.log(`- Articles: ${articles.length} new articles`);
}

// Run the briefing generator
generateBriefing().catch(error => {
  console.error('❌ Failed to generate briefing:', error);
  process.exit(1);
});