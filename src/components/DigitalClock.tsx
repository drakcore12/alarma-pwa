import React from 'react';
import { useCurrentTime } from '../hooks/useCurrentTime';
import { formatTime, formatDate } from '../utils/time';
import { useStore } from '../store/useStore';

interface DigitalClockProps {
  timezone?: string;
  showDate?: boolean;
}

export const DigitalClock: React.FC<DigitalClockProps> = ({
  timezone,
  showDate = true,
}) => {
  const currentTime = useCurrentTime(timezone);
  const { settings } = useStore();

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-6xl font-display font-bold tracking-tight">
        {formatTime(currentTime, settings.hourFormat)}
      </div>
      {showDate && (
        <div className="text-lg text-[var(--text-soft)]">
          {formatDate(currentTime)}
        </div>
      )}
    </div>
  );
};

