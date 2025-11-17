import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { TimerCard } from './TimerCard';
import { TimerForm } from './TimerForm';
import { Plus } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

export const TimerList: React.FC = () => {
  const { timers } = useStore();
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold">Temporizadores</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nuevo Temporizador
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {timers.length === 0 ? (
            <div className="col-span-full card-neomorphic p-8 text-center text-[var(--text-soft)]">
              No hay temporizadores configurados
            </div>
          ) : (
            timers.map((timer) => <TimerCard key={timer.id} timer={timer} />)
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isFormOpen && <TimerForm onClose={() => setIsFormOpen(false)} />}
      </AnimatePresence>
    </div>
  );
};

