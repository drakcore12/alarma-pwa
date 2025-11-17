import { useEffect, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatTimeShort } from '../../utils/time';

export const AlarmRinger: React.FC = () => {
  const { ringingAlarmId, alarms, clearRingingAlarm, settings } = useStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const alarm = alarms.find((a) => a.id === ringingAlarmId) || null;

  useEffect(() => {
    if (!alarm) return;

    if (!audioRef.current) {
      audioRef.current = new Audio('/sounds/alarm.mp3');
      audioRef.current.loop = true;
    }

    audioRef.current.volume = settings.soundVolume;

    audioRef.current
      .play()
      .catch((err) => console.warn('Audio bloqueado:', err));

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [alarm, settings.soundVolume]);

  if (!alarm) return null;

  const date = new Date(2000, 0, 1, alarm.hour, alarm.minute);
  const timeLabel = formatTimeShort(date, settings.hourFormat);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[500] bg-black/60 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="card-neomorphic p-6 max-w-md w-full relative"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <button
            onClick={clearRingingAlarm}
            className="absolute top-3 right-3 p-2 rounded-lg hover:bg-[var(--surface)]"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center space-y-4">
            <h2 className="text-3xl font-display font-bold">¡Alarma!</h2>

            <div className="text-4xl font-display font-semibold">
              {timeLabel}
            </div>

            {alarm.label && (
              <p className="text-lg text-[var(--text-soft)]">{alarm.label}</p>
            )}

            <button
              onClick={clearRingingAlarm}
              className="btn-primary w-full py-3 rounded-xl mt-6"
            >
              Detener
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
