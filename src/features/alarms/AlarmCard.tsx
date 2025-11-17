import React from 'react';
import { Alarm } from '../../types';
import { formatTimeShort, getWeekdayName } from '../../utils/time';
import { useStore } from '../../store/useStore';
import { Clock, Trash2, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getNextAlarmOccurrence } from '../../utils/alarmEngine'; // 👈 nuevo import

interface AlarmCardProps {
  alarm: Alarm;
  onEdit?: (alarm: Alarm) => void;
}

export const AlarmCard: React.FC<AlarmCardProps> = ({ alarm, onEdit }) => {
  const { updateAlarm, removeAlarm } = useStore();
  const { settings } = useStore();

  const toggleActive = () => {
    updateAlarm(alarm.id, { active: !alarm.active });
  };

  // Hora base (por si no hay siguiente calculable)
  const baseDate = new Date(2000, 0, 1, alarm.hour, alarm.minute);
  const baseFormatted = formatTimeShort(baseDate, settings.hourFormat);

  // 👉 Próxima vez que va a sonar
  const nextDate = getNextAlarmOccurrence(alarm);
  const nextFormatted = nextDate
    ? formatTimeShort(nextDate, settings.hourFormat)
    : baseFormatted;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="card-neomorphic p-4 flex items-center justify-between gap-4"
    >
      <div className="flex items-center gap-4 flex-1">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-[var(--primary)]" />
          <div>
            {/* 👇 Aquí ahora mostramos la próxima hora que sonará */}
            <div className="text-2xl font-display font-semibold">
              {nextFormatted}
            </div>

            {alarm.label && (
              <div className="text-sm text-[var(--text-soft)]">
                {alarm.label}
              </div>
            )}

            {/* opcional: info extra tipo “próxima ocurrencia” */}
            {nextDate && (
              <div className="text-xs text-[var(--text-soft)]">
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-1">
          {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((day) => (
            <div
              key={day}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                alarm.weekdays.includes(day as any)
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--surface)] text-[var(--text-soft)]'
              }`}
            >
              {getWeekdayName(day).charAt(0)}
            </div>
          ))}
        </div>

        {alarm.repetitionWindow?.enabled && (
          <div className="text-xs text-[var(--text-soft)] px-2 py-1 bg-[var(--surface)] rounded-lg">
            Rep: {alarm.repetitionWindow.startTime} - {alarm.repetitionWindow.endTime}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleActive}
          className={`w-12 h-6 rounded-full transition-all ${
            alarm.active ? 'bg-[var(--primary)]' : 'bg-[var(--shadow-dark)]'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white transition-transform ${
              alarm.active ? 'translate-x-6' : 'translate-x-0.5'
            }`}
          />
        </button>

        {onEdit && (
          <button
            onClick={() => onEdit(alarm)}
            className="p-2 rounded-lg hover:bg-[var(--surface)] transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={() => removeAlarm(alarm.id)}
          className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};
