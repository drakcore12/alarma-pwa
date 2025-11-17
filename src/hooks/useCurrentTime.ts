import { useState, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const useCurrentTime = (timezone?: string) => {
  const [currentTime, setCurrentTime] = useState<Dayjs>(() => {
    return timezone ? dayjs().tz(timezone) : dayjs();
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(timezone ? dayjs().tz(timezone) : dayjs());
    }, 1000);

    return () => clearInterval(interval);
  }, [timezone]);

  return currentTime;
};

