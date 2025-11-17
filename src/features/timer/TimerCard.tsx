import React, { useEffect, useRef } from 'react';
import { Timer } from '../../types';
import { useStore } from '../../store/useStore';
import { formatDuration } from '../../utils/time';
import { Play, Pause, Square, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface TimerCardProps {
  timer: Timer;
}

export const TimerCard: React.FC<TimerCardProps> = ({ timer }) => {
  const { updateTimer, removeTimer } = useStore();
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (timer.isRunning && timer.startedAt) {
      intervalRef.current = window.setInterval(() => {
        const now = Date.now();
        const elapsed = now - timer.startedAt!;
        const remaining = Math.max(0, timer.remainingMs - elapsed);

        if (remaining <= 0) {
          updateTimer(timer.id, {
            isRunning: false,
            remainingMs: 0,
          });
          // Aquí podrías disparar una notificación
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        } else {
          updateTimer(timer.id, { remainingMs: remaining });
        }
      }, 50);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timer.isRunning, timer.startedAt, timer.id, timer.remainingMs, updateTimer]);

  const handleStart = () => {
    updateTimer(timer.id, {
      isRunning: true,
      startedAt: Date.now(),
    });
  };

  const handlePause = () => {
    updateTimer(timer.id, {
      isRunning: false,
    });
  };

  const handleReset = () => {
    updateTimer(timer.id, {
      isRunning: false,
      remainingMs: timer.durationMs,
      startedAt: undefined,
    });
  };

  const progress = timer.durationMs > 0 
    ? ((timer.durationMs - timer.remainingMs) / timer.durationMs) * 100 
    : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="card-neomorphic p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-display font-semibold">
            {timer.name || 'Temporizador'}
          </h3>
          <div className="text-3xl font-mono font-bold mt-2">
            {formatDuration(timer.remainingMs)}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="w-full h-2 rounded-full neomorphic-inset overflow-hidden">
          <motion.div
            className="h-full bg-[var(--primary)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {timer.isRunning ? (
          <button
            onClick={handlePause}
            className="btn-neomorphic flex items-center gap-2 flex-1"
          >
            <Pause className="w-4 h-4" />
            Pausar
          </button>
        ) : (
          <button
            onClick={handleStart}
            className="btn-primary flex items-center gap-2 flex-1"
            disabled={timer.remainingMs <= 0}
          >
            <Play className="w-4 h-4" />
            Iniciar
          </button>
        )}

        <button
          onClick={handleReset}
          className="btn-neomorphic p-3"
          disabled={timer.isRunning}
        >
          <Square className="w-4 h-4" />
        </button>

        <button
          onClick={() => removeTimer(timer.id)}
          className="btn-neomorphic p-3 text-red-500 hover:bg-red-500/10"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

