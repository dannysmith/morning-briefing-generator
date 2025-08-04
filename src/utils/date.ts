import { formatInTimeZone } from 'date-fns-tz';
import { isWithinInterval, subHours, formatDistanceToNow } from 'date-fns';

const LONDON_TZ = 'Europe/London';

export function formatLondonTime(date: Date | string, format: string = 'HH:mm'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatInTimeZone(dateObj, LONDON_TZ, format);
}

export function isWithin48Hours(dateString: string): boolean {
  const date = new Date(dateString);
  const now = new Date();
  const fortyEightHoursAgo = subHours(now, 48);
  
  return isWithinInterval(date, {
    start: fortyEightHoursAgo,
    end: now
  });
}

export function getCurrentDateString(): string {
  return formatInTimeZone(new Date(), LONDON_TZ, 'EEEE, do MMMM yyyy');
}

export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const hoursDiff = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  if (hoursDiff < 1) {
    return 'just now';
  } else if (hoursDiff < 24) {
    const hours = Math.floor(hoursDiff);
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  } else if (hoursDiff < 48) {
    return 'yesterday';
  } else {
    return formatDistanceToNow(date, { addSuffix: true });
  }
}