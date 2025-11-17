import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './theme/ThemeProvider';
import { Navigation } from './components/Navigation';
import { HomeView } from './features/home/HomeView';
import { WorldClockList } from './features/world-clock/WorldClockList';
import { TimerList } from './features/timer/TimerList';
import { StopwatchDisplay } from './features/stopwatch/StopwatchDisplay';
import { AlarmList } from './features/alarms/AlarmList';
import { SettingsView } from './features/settings/SettingsView';
import { useStore } from './store/useStore';
import { alarmEngine } from './utils/alarmEngine';
import { AlarmRinger } from './features/alarms/AlarmRinger';  

import './styles/globals.css';

function App() {
  const { settings } = useStore();

  useEffect(() => {
    alarmEngine.setCheckCallback(() => {
      const { alarms, settings, setRingingAlarm } = useStore.getState();

      alarms.forEach((alarm) => {
        alarmEngine.checkAlarm(alarm, () => {
          if (settings.notificationsEnabled &&
              'Notification' in window &&
              Notification.permission === 'granted') {
            new Notification(alarm.label || 'Alarma', {
              body: `Es hora de ${alarm.label || 'tu alarma'}`,
              icon: '/logo-192.png',
            });
          }

          // 🔔 Marcar alarma como sonando
          setRingingAlarm(alarm.id);
        });
      });
    });

    alarmEngine.start();

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      alarmEngine.stop();
    };
  }, [settings.notificationsEnabled]);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-display font-bold text-center mb-8">
              Alarma Digital
            </h1>

            <Navigation />

            <Routes>
              <Route path="/" element={<HomeView />} />
              <Route path="/world-clock" element={<WorldClockList />} />
              <Route path="/timer" element={<TimerList />} />
              <Route path="/stopwatch" element={<StopwatchDisplay />} />
              <Route path="/alarms" element={<AlarmList />} />
              <Route path="/settings" element={<SettingsView />} />
            </Routes>

            {/* 🔔 COMPONENTE GLOBAL PARA SONIDO + MODAL */}
            <AlarmRinger />
          </div>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
