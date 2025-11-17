import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { WorldClockCard } from './WorldClockCard';
import { AddTimezoneModal } from './AddTimezoneModal';
import { Plus } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

export const WorldClockList: React.FC = () => {
  const { worldClocks } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold">Relojes Mundiales</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Añadir Ciudad
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {worldClocks.length === 0 ? (
            <div className="col-span-full card-neomorphic p-8 text-center text-[var(--text-soft)]">
              No hay relojes configurados. Añade ciudades para ver sus horarios.
            </div>
          ) : (
            worldClocks.map((clock) => (
              <WorldClockCard key={clock.id} clock={clock} />
            ))
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isModalOpen && <AddTimezoneModal onClose={() => setIsModalOpen(false)} />}
      </AnimatePresence>
    </div>
  );
};

