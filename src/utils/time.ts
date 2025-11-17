import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/es';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('es');

export const formatTime = (
  time: Dayjs | Date | number,
  format: '12h' | '24h' = '24h'
): string => {
  const d = dayjs(time);
  return format === '12h' ? d.format('hh:mm:ss A') : d.format('HH:mm:ss');
};

export const formatDate = (time: Dayjs | Date | number): string => {
  return dayjs(time).format('dddd, D MMMM YYYY');
};

export const formatTimeShort = (
  time: Dayjs | Date | number,
  format: '12h' | '24h' = '24h'
): string => {
  const d = dayjs(time);
  return format === '12h' ? d.format('hh:mm A') : d.format('HH:mm');
};

export const getTimeInTimezone = (timezone: string): Dayjs => {
  return dayjs().tz(timezone);
};

export const formatDuration = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = Math.floor((ms % 1000) / 10);

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
};

export const formatDurationLong = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = ms % 1000;

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0) parts.push(`${seconds}s`);
  if (milliseconds > 0 && parts.length === 0) parts.push(`${milliseconds}ms`);

  return parts.join(' ') || '0s';
};

export const parseTimeToMs = (
  hours: number = 0,
  minutes: number = 0,
  seconds: number = 0,
  milliseconds: number = 0
): number => {
  return hours * 3600000 + minutes * 60000 + seconds * 1000 + milliseconds;
};

export const getWeekdayName = (weekday: string): string => {
  const names: Record<string, string> = {
    mon: 'Lun',
    tue: 'Mar',
    wed: 'Mié',
    thu: 'Jue',
    fri: 'Vie',
    sat: 'Sáb',
    sun: 'Dom',
  };
  return names[weekday] || weekday;
};

