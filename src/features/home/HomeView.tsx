import React from 'react';
import { AnalogClockCard } from '../clock/AnalogClockCard';
import { useStore } from '../../store/useStore';
import { formatTimeShort, getWeekdayName } from '../../utils/time';
import { Clock, Timer, TimerReset } from 'lucide-react';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';

export const HomeView: React.FC = () => {
  const { alarms, timers, stopwatch, settings } = useStore();

  // Encontrar próxima alarma activa
  const now = dayjs();
  const activeAlarms = alarms.filter((a) => a.active);
  const nextAlarm = activeAlarms
    .map((alarm) => {
      const alarmTime = dayjs()
        .hour(alarm.hour)
        .minute(alarm.minute)
        .second(0)
        .millisecond(0);

      // Verificar si la alarma es hoy o mañana
      let targetTime = alarmTime;
      if (targetTime.isBefore(now)) {
        targetTime = targetTime.add(1, 'day');
      }

      // Verificar si el día de la semana coincide
      const weekdayMap: Record<string, number> = {
        mon: 1,
        tue: 2,
        wed: 3,
        thu: 4,
        fri: 5,
        sat: 6,
        sun: 0,
      };

      const targetWeekday = targetTime.day();
      const alarmWeekdays = alarm.weekdays.map((d) => weekdayMap[d]);

      if (!alarmWeekdays.includes(targetWeekday)) {
        // Buscar el próximo día válido
        for (let i = 1; i <= 7; i++) {
          const nextDay = targetTime.add(i, 'day');
          if (alarmWeekdays.includes(nextDay.day())) {
            targetTime = nextDay.hour(alarm.hour).minute(alarm.minute);
            break;
          }
        }
      }

      return { alarm, time: targetTime };
    })
    .sort((a, b) => a.time.diff(b.time))[0];

  const activeTimer = timers.find((t) => t.isRunning);
  const isStopwatchRunning = stopwatch.isRunning;

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center">
        <AnalogClockCard />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {nextAlarm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-neomorphic p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-[var(--primary)]" />
              <h3 className="text-lg font-display font-semibold">
                Próxima Alarma
              </h3>
            </div>
            <div className="text-2xl font-mono font-bold mb-2">
              {formatTimeShort(nextAlarm.time, settings.hourFormat)}
            </div>
            {nextAlarm.alarm.label && (
              <div className="text-sm text-[var(--text-soft)]">
                {nextAlarm.alarm.label}
              </div>
            )}
            <div className="flex gap-1 mt-2">
              {nextAlarm.alarm.weekdays.map((day) => (
                <span
                  key={day}
                  className="text-xs px-2 py-1 bg-[var(--primary)]/20 rounded"
                >
                  {getWeekdayName(day)}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {activeTimer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-neomorphic p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Timer className="w-6 h-6 text-[var(--accent)]" />
              <h3 className="text-lg font-display font-semibold">
                Temporizador Activo
              </h3>
            </div>
            <div className="text-2xl font-mono font-bold mb-2">
              {activeTimer.name || 'Temporizador'}
            </div>
            <div className="text-sm text-[var(--text-soft)]">
              Tiempo restante
            </div>
          </motion.div>
        )}

        {isStopwatchRunning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-neomorphic p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <TimerReset className="w-6 h-6 text-[var(--accent)]" />
              <h3 className="text-lg font-display font-semibold">
                Cronómetro Activo
              </h3>
            </div>
            <div className="text-2xl font-mono font-bold mb-2">
              En ejecución
            </div>
            <div className="text-sm text-[var(--text-soft)]">
              {stopwatch.laps.length} vueltas
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

