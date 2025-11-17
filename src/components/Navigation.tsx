import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Clock, Globe, Timer, TimerReset, Bell, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/', label: 'Inicio', icon: Clock },
  { path: '/world-clock', label: 'Mundial', icon: Globe },
  { path: '/timer', label: 'Temporizador', icon: Timer },
  { path: '/stopwatch', label: 'Cronómetro', icon: TimerReset },
  { path: '/alarms', label: 'Alarmas', icon: Bell },
  { path: '/settings', label: 'Configuración', icon: Settings },
];

export const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="card-neomorphic p-4 mb-6">
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link key={item.path} to={item.path}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                  isActive
                    ? 'bg-[var(--primary)] text-white'
                    : 'neomorphic-inset hover:neomorphic-hover'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden sm:inline">{item.label}</span>
              </motion.button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

