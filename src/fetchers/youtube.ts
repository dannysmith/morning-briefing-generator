import Parser from 'rss-parser';
import type { VideoItem } from '../types/index.js';
import { isWithin48Hours } from '../utils/date.js';

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'Morning-Briefing-Generator/1.0'
  }
});

const YOUTUBE_CHANNELS = {
  't3dotgg': 'UCbRP3c757lWg9M-U7TyEkXA',
  'howiaipodcast': 'UCJKt_QVDyUbqdm3ag_py2eQ',
  'AlecSteele': 'UCWizIdwZdmr43zfxlCktmNw',
  'colinfurze': 'UCp68_FLety0O-n9QU6phsgw',
  'FallowLondon': 'UC4AHgEZmzfPREQJBFeLNDOg',
  'Pixlriffs': 'UC1hBl2MHLBkoXKEh21ZwECw'
};

async function fetchChannelVideos(channelName: string, channelId: string): Promise<VideoItem[]> {
  const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  
  try {
    const feed = await parser.parseURL(url);
    const videos: VideoItem[] = [];

    for (const item of feed.items || []) {
      if (!item.pubDate) continue;
      
      // Filter for videos from last 48 hours
      if (isWithin48Hours(item.pubDate)) {
        videos.push({
          channel: channelName,
          title: item.title || 'Untitled',
          published: item.pubDate,
          link: item.link || ''
        });
      }
    }

    return videos;
  } catch (error) {
    console.error(`Failed to fetch ${channelName} videos:`, error);
    return [];
  }
}

export async function fetchYouTubeVideos(): Promise<VideoItem[]> {
  const promises = Object.entries(YOUTUBE_CHANNELS).map(([name, id]) =>
    fetchChannelVideos(name, id)
  );

  try {
    const results = await Promise.allSettled(promises);
    const allVideos: VideoItem[] = [];

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        allVideos.push(...result.value);
      }
    });

    // Sort by publication date (newest first)
    return allVideos.sort((a, b) => 
      new Date(b.published).getTime() - new Date(a.published).getTime()
    );
  } catch (error) {
    console.error('Failed to fetch YouTube videos:', error);
    return [];
  }
}