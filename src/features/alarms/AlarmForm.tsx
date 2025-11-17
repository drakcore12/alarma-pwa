import React, { useState, useEffect } from 'react';
import { Alarm, Weekday } from '../../types';
import { useStore } from '../../store/useStore';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AlarmFormProps {
  alarm?: Alarm | null;
  onClose: () => void;
}

export const AlarmForm: React.FC<AlarmFormProps> = ({ alarm, onClose }) => {
  const { addAlarm, updateAlarm } = useStore();

  const [label, setLabel] = useState(alarm?.label || '');
  const [hour, setHour] = useState(alarm?.hour ?? 7);
  const [minute, setMinute] = useState(alarm?.minute ?? 0);
  const [weekdays, setWeekdays] = useState<Weekday[]>(
    alarm?.weekdays || ['mon', 'tue', 'wed', 'thu', 'fri']
  );
  const [repetitionEnabled, setRepetitionEnabled] = useState(
    alarm?.repetitionWindow?.enabled || false
  );
  const [intervalHours, setIntervalHours] = useState(0);
  const [intervalMinutes, setIntervalMinutes] = useState(15);
  const [intervalSeconds, setIntervalSeconds] = useState(0);
  const [startTime, setStartTime] = useState(
    alarm?.repetitionWindow?.startTime || '08:00'
  );
  const [endTime, setEndTime] = useState(
    alarm?.repetitionWindow?.endTime || '12:00'
  );

  useEffect(() => {
    if (alarm?.repetitionWindow) {
      const intervalMs = alarm.repetitionWindow.intervalMs;
      const hours = Math.floor(intervalMs / 3600000);
      const minutes = Math.floor((intervalMs % 3600000) / 60000);
      const seconds = Math.floor((intervalMs % 60000) / 1000);
      setIntervalHours(hours);
      setIntervalMinutes(minutes);
      setIntervalSeconds(seconds);
    }
  }, [alarm]);

  const toggleWeekday = (day: Weekday) => {
    setWeekdays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const intervalMs =
      intervalHours * 3600000 + intervalMinutes * 60000 + intervalSeconds * 1000;

    // 👉 Si la repetición está activada, tomamos la hora de startTime
    let hourToSave = hour;
    let minuteToSave = minute;

    if (repetitionEnabled && startTime) {
      const [hStr = '0', mStr = '0'] = startTime.split(':');
      const h = parseInt(hStr, 10);
      const m = parseInt(mStr, 10);
      hourToSave = Number.isFinite(h) ? h : 0;
      minuteToSave = Number.isFinite(m) ? m : 0;
    }

    const alarmData: Alarm = {
      id: alarm?.id || Date.now().toString(),
      label: label || undefined,
      hour: hourToSave,
      minute: minuteToSave,
      active: alarm?.active ?? true,
      weekdays,
      repetitionWindow: repetitionEnabled
        ? {
            enabled: true,
            intervalMs,
            startTime,
            endTime,
          }
        : undefined,
      createdAt: alarm?.createdAt || Date.now(),
    };

    if (alarm) {
      updateAlarm(alarm.id, alarmData);
    } else {
      addAlarm(alarmData);
    }

    onClose();
  };

  const weekdaysList: Weekday[] = [
    'mon',
    'tue',
    'wed',
    'thu',
    'fri',
    'sat',
    'sun',
  ];
  const weekdayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="card-neomorphic max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold">
              {alarm ? 'Editar Alarma' : 'Nueva Alarma'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[var(--surface)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Nombre (opcional)
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full px-4 py-2 rounded-xl neomorphic-inset focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                placeholder="Ej: Alarma gimnasio"
              />
            </div>

            {/* Hora / Minuto SOLO cuando NO hay repetición personalizada */}
            {!repetitionEnabled && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Hora</label>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={hour}
                    onChange={(e) => setHour(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 rounded-xl neomorphic-inset focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Minuto</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={minute}
                    onChange={(e) => setMinute(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 rounded-xl neomorphic-inset focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>
              </div>
            )}

            {/* Días de la semana */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Días de la semana
              </label>
              <div className="flex gap-2">
                {weekdaysList.map((day, idx) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleWeekday(day)}
                    className={`flex-1 py-2 rounded-xl font-medium transition-all ${
                      weekdays.includes(day)
                        ? 'bg-[var(--primary)] text-white'
                        : 'neomorphic-inset'
                    }`}
                  >
                    {weekdayNames[idx]}
                  </button>
                ))}
              </div>
            </div>

            {/* Repetición personalizada */}
            <div>
              <label className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  checked={repetitionEnabled}
                  onChange={(e) => setRepetitionEnabled(e.target.checked)}
                  className="w-5 h-5"
                />
                <span className="font-medium">Repetición personalizada</span>
              </label>

              {repetitionEnabled && (
                <div className="space-y-4 p-4 rounded-xl neomorphic-inset">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Intervalo - Horas
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={intervalHours}
                        onChange={(e) =>
                          setIntervalHours(parseInt(e.target.value) || 0)
                        }
                        className="w-full px-4 py-2 rounded-xl neomorphic-inset focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Minutos
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={intervalMinutes}
                        onChange={(e) =>
                          setIntervalMinutes(parseInt(e.target.value) || 0)
                        }
                        className="w-full px-4 py-2 rounded-xl neomorphic-inset focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Segundos
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={intervalSeconds}
                        onChange={(e) =>
                          setIntervalSeconds(parseInt(e.target.value) || 0)
                        }
                        className="w-full px-4 py-2 rounded-xl neomorphic-inset focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Hora de inicio
                      </label>
                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl neomorphic-inset focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Hora de fin
                      </label>
                      <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl neomorphic-inset focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Botones */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn-neomorphic"
              >
                Cancelar
              </button>
              <button type="submit" className="flex-1 btn-primary">
                {alarm ? 'Guardar' : 'Crear'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
