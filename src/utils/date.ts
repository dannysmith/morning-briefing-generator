import { formatInTimeZone } from 'date-fns-tz';
import { isWithinInterval, subHours } from 'date-fns';

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