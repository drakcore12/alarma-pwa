import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { parseTimeToMs } from '../../utils/time';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimerFormProps {
  onClose: () => void;
}

export const TimerForm: React.FC<TimerFormProps> = ({ onClose }) => {
  const { addTimer } = useStore();
  const [name, setName] = useState('');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const durationMs = parseTimeToMs(hours, minutes, seconds);

    if (durationMs <= 0) {
      alert('La duración debe ser mayor a 0');
      return;
    }

    const timer = {
      id: Date.now().toString(),
      name: name || undefined,
      durationMs,
      remainingMs: durationMs,
      isRunning: false,
    };

    addTimer(timer);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="card-neomorphic max-w-md w-full"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold">
              Nuevo Temporizador
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[var(--surface)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Nombre (opcional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-xl neomorphic-inset focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                placeholder="Ej: Pomodoro 25 min"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Horas</label>
                <input
                  type="number"
                  min="0"
                  value={hours}
                  onChange={(e) => setHours(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 rounded-xl neomorphic-inset focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Minutos</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 rounded-xl neomorphic-inset focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Segundos</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={seconds}
                  onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 rounded-xl neomorphic-inset focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn-neomorphic"
              >
                Cancelar
              </button>
              <button type="submit" className="flex-1 btn-primary">
                Crear
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

