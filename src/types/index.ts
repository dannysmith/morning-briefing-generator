export interface WeatherData {
  current: {
    temperature_2m: number;
    weather_code: number;
  };
  hourly: {
    time: string[];
    precipitation_probability: number[];
    temperature_2m: number[];
    precipitation: number[];
    rain: number[];
    weather_code: number[];
  };
  daily: {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    sunrise: string[];
    sunset: string[];
  };
}

export interface BitcoinData {
  bitcoin: {
    usd: number;
    usd_24h_change: number;
  };
}

export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  category?: string;
}

export interface VideoItem {
  channel: string;
  title: string;
  published: string;
  link: string;
}

export interface TideData {
  time: string;
  type: 'High' | 'Low';
  height: string;
}

export interface BriefingData {
  weather: {
    current: number;
    high: number;
    umbrellaRecommendation: string;
    rainTiming: string;
    sunrise: string;
    sunset: string;
  };
  tides: TideData[];
  bitcoin?: {
    price: number;
    change: number;
  };
  news: NewsItem[];
  videos: VideoItem[];
  articles: NewsItem[];
}