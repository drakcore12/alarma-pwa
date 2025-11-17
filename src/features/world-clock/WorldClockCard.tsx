import React from 'react';
import { TimezoneClock } from '../../types';
import { useCurrentTime } from '../../hooks/useCurrentTime';
import { formatTimeShort } from '../../utils/time';

import { useStore } from '../../store/useStore';
import { Trash2, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

interface WorldClockCardProps {
  clock: TimezoneClock;
}

export const WorldClockCard: React.FC<WorldClockCardProps> = ({ clock }) => {
  const currentTime = useCurrentTime(clock.timezone);
  const localTime = useCurrentTime();
  const { removeWorldClock, settings } = useStore();

  const timeDiff = currentTime.diff(localTime, 'hour', true);
  const diffString = timeDiff >= 0 
    ? `+${timeDiff.toFixed(1)}h` 
    : `${timeDiff.toFixed(1)}h`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="card-neomorphic p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-[var(--primary)]" />
          <div>
            <h3 className="text-xl font-display font-semibold">{clock.label}</h3>
            <p className="text-sm text-[var(--text-soft)]">{clock.timezone}</p>
          </div>
        </div>
        <button
          onClick={() => removeWorldClock(clock.id)}
          className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="text-3xl font-mono font-bold mb-2">
        {formatTimeShort(currentTime, settings.hourFormat)}
      </div>
      <div className="text-sm text-[var(--text-soft)]">
        Diferencia: {diffString}
      </div>
    </motion.div>
  );
};

