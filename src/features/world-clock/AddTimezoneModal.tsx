import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { TimezoneClock } from '../../types';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Lista de zonas horarias comunes
const commonTimezones = [
  { label: 'Nueva York, USA', timezone: 'America/New_York' },
  { label: 'Los Ángeles, USA', timezone: 'America/Los_Angeles' },
  { label: 'Londres, Reino Unido', timezone: 'Europe/London' },
  { label: 'París, Francia', timezone: 'Europe/Paris' },
  { label: 'Berlín, Alemania', timezone: 'Europe/Berlin' },
  { label: 'Madrid, España', timezone: 'Europe/Madrid' },
  { label: 'Roma, Italia', timezone: 'Europe/Rome' },
  { label: 'Moscú, Rusia', timezone: 'Europe/Moscow' },
  { label: 'Tokio, Japón', timezone: 'Asia/Tokyo' },
  { label: 'Shanghai, China', timezone: 'Asia/Shanghai' },
  { label: 'Hong Kong', timezone: 'Asia/Hong_Kong' },
  { label: 'Singapur', timezone: 'Asia/Singapore' },
  { label: 'Dubái, UAE', timezone: 'Asia/Dubai' },
  { label: 'Mumbai, India', timezone: 'Asia/Kolkata' },
  { label: 'Sídney, Australia', timezone: 'Australia/Sydney' },
  { label: 'Melbourne, Australia', timezone: 'Australia/Melbourne' },
  { label: 'Auckland, Nueva Zelanda', timezone: 'Pacific/Auckland' },
  { label: 'São Paulo, Brasil', timezone: 'America/Sao_Paulo' },
  { label: 'Buenos Aires, Argentina', timezone: 'America/Argentina/Buenos_Aires' },
  { label: 'Ciudad de México, México', timezone: 'America/Mexico_City' },
];

interface AddTimezoneModalProps {
  onClose: () => void;
}

export const AddTimezoneModal: React.FC<AddTimezoneModalProps> = ({ onClose }) => {
  const { addWorldClock, worldClocks } = useStore();
  const [search, setSearch] = useState('');

  const filteredTimezones = commonTimezones.filter(
    (tz) =>
      tz.label.toLowerCase().includes(search.toLowerCase()) &&
      !worldClocks.some((wc) => wc.timezone === tz.timezone)
  );

  const handleAdd = (timezone: typeof commonTimezones[0]) => {
    const clock: TimezoneClock = {
      id: Date.now().toString(),
      label: timezone.label,
      timezone: timezone.timezone,
    };
    addWorldClock(clock);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="card-neomorphic max-w-2xl w-full max-h-[80vh] flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold">
              Añadir Zona Horaria
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[var(--surface)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar ciudad..."
              className="w-full px-4 py-2 rounded-xl neomorphic-inset focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {filteredTimezones.length === 0 ? (
              <div className="text-center text-[var(--text-soft)] py-8">
                No se encontraron ciudades
              </div>
            ) : (
              filteredTimezones.map((tz) => (
                <button
                  key={tz.timezone}
                  onClick={() => handleAdd(tz)}
                  className="w-full p-4 rounded-xl neomorphic-inset hover:neomorphic-hover text-left transition-all"
                >
                  <div className="font-medium">{tz.label}</div>
                  <div className="text-sm text-[var(--text-soft)]">
                    {tz.timezone}
                  </div>
                </button>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

