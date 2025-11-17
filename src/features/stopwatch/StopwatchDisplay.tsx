import React, { useEffect, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { formatDuration } from '../../utils/time';
import { Play, Pause, Square, Flag } from 'lucide-react';
import { motion } from 'framer-motion';

export const StopwatchDisplay: React.FC = () => {
  const { stopwatch, updateStopwatch, resetStopwatch } = useStore();
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (stopwatch.isRunning && stopwatch.startedAt) {
      intervalRef.current = window.setInterval(() => {
        const now = Date.now();
        const elapsed = stopwatch.elapsedMs + (now - stopwatch.startedAt!);
        updateStopwatch({ elapsedMs: elapsed });
      }, 10); // Actualizar cada 10ms para precisión
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
  }, [stopwatch.isRunning, stopwatch.startedAt, stopwatch.elapsedMs, updateStopwatch]);

  const handleStart = () => {
    updateStopwatch({
      isRunning: true,
      startedAt: Date.now(),
    });
  };

  const handlePause = () => {
    updateStopwatch({
      isRunning: false,
      elapsedMs: stopwatch.elapsedMs + (Date.now() - (stopwatch.startedAt || Date.now())),
      startedAt: undefined,
    });
  };

  const handleReset = () => {
    resetStopwatch();
  };

  const handleLap = () => {
    if (!stopwatch.isRunning) return;

    const now = Date.now();
    const currentElapsed = stopwatch.elapsedMs + (now - (stopwatch.startedAt || now));
    const lastLapTime = stopwatch.laps.length > 0 
      ? stopwatch.laps[stopwatch.laps.length - 1].totalTimeMs 
      : 0;
    const lapTime = currentElapsed - lastLapTime;

    const newLap = {
      id: Date.now().toString(),
      lapNumber: stopwatch.laps.length + 1,
      lapTimeMs: lapTime,
      totalTimeMs: currentElapsed,
    };

    updateStopwatch({
      laps: [...stopwatch.laps, newLap],
    });
  };

  return (
    <div className="space-y-6">
      <div className="card-neomorphic p-8 flex flex-col items-center">
        <div className="text-7xl font-mono font-bold mb-6">
          {formatDuration(stopwatch.elapsedMs)}
        </div>

        <div className="flex items-center gap-4">
          {stopwatch.isRunning ? (
            <>
              <button
                onClick={handlePause}
                className="btn-neomorphic flex items-center gap-2"
              >
                <Pause className="w-5 h-5" />
                Pausar
              </button>
              <button
                onClick={handleLap}
                className="btn-neomorphic flex items-center gap-2"
              >
                <Flag className="w-5 h-5" />
                Vuelta
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleStart}
                className="btn-primary flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Iniciar
              </button>
              <button
                onClick={handleReset}
                className="btn-neomorphic flex items-center gap-2"
                disabled={stopwatch.elapsedMs === 0}
              >
                <Square className="w-5 h-5" />
                Reiniciar
              </button>
            </>
          )}
        </div>
      </div>

      {stopwatch.laps.length > 0 && (
        <div className="card-neomorphic p-6">
          <h3 className="text-xl font-display font-semibold mb-4">Vueltas</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {[...stopwatch.laps].reverse().map((lap) => (
              <motion.div
                key={lap.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 rounded-xl neomorphic-inset"
              >
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-[var(--text-soft)]">
                    Vuelta {lap.lapNumber}
                  </span>
                  <span className="text-lg font-mono">
                    {formatDuration(lap.lapTimeMs)}
                  </span>
                </div>
                <span className="text-sm text-[var(--text-soft)] font-mono">
                  {formatDuration(lap.totalTimeMs)}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

