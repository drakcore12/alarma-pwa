import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export interface ClockTime {
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

export const useAnalogClock = (timezone?: string) => {
  const [time, setTime] = useState<ClockTime>(() => {
    const now = timezone ? dayjs().tz(timezone) : dayjs();
    return {
      hours: now.hour(),
      minutes: now.minute(),
      seconds: now.second(),
      milliseconds: now.millisecond(),
    };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = timezone ? dayjs().tz(timezone) : dayjs();
      setTime({
        hours: now.hour(),
        minutes: now.minute(),
        seconds: now.second(),
        milliseconds: now.millisecond(),
      });
    }, 50); // Actualizar cada 50ms para movimiento suave

    return () => clearInterval(interval);
  }, [timezone]);

  return time;
};

