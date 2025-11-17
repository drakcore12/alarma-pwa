import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { AlarmCard } from './AlarmCard';
import { AlarmForm } from './AlarmForm';
import { Alarm } from '../../types';
import { Plus } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

export const AlarmList: React.FC = () => {
  const { alarms } = useStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAlarm, setEditingAlarm] = useState<Alarm | null>(null);

  const handleEdit = (alarm: Alarm) => {
    setEditingAlarm(alarm);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingAlarm(null);
  };

  const sortedAlarms = [...alarms].sort((a, b) => {
    const timeA = a.hour * 60 + a.minute;
    const timeB = b.hour * 60 + b.minute;
    return timeA - timeB;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold">Alarmas</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nueva Alarma
        </button>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {sortedAlarms.length === 0 ? (
            <div className="card-neomorphic p-8 text-center text-[var(--text-soft)]">
              No hay alarmas configuradas
            </div>
          ) : (
            sortedAlarms.map((alarm) => (
              <AlarmCard key={alarm.id} alarm={alarm} onEdit={handleEdit} />
            ))
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <AlarmForm alarm={editingAlarm} onClose={handleClose} />
        )}
      </AnimatePresence>
    </div>
  );
};

