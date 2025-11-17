import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Timer, Stopwatch, Alarm, TimezoneClock, AppSettings } from '../types';

interface AppState {
  // Settings
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;

  // Timers
  timers: Timer[];
  addTimer: (timer: Timer) => void;
  updateTimer: (id: string, updates: Partial<Timer>) => void;
  removeTimer: (id: string) => void;

  // Stopwatch
  stopwatch: Stopwatch;
  updateStopwatch: (updates: Partial<Stopwatch>) => void;
  resetStopwatch: () => void;

  // Alarms
  alarms: Alarm[];
  addAlarm: (alarm: Alarm) => void;
  updateAlarm: (id: string, updates: Partial<Alarm>) => void;
  removeAlarm: (id: string) => void;

  // WORLD CLOCKS
  worldClocks: TimezoneClock[];
  addWorldClock: (clock: TimezoneClock) => void;
  removeWorldClock: (id: string) => void;
  updateWorldClock: (id: string, updates: Partial<TimezoneClock>) => void;

  // 🔔 ALARMA SONANDO
  ringingAlarmId: string | null;
  setRingingAlarm: (id: string | null) => void;
  clearRingingAlarm: () => void;
}

const defaultSettings: AppSettings = {
  themeId: 'light-aurora',
  hourFormat: '24h',
  soundVolume: 0.7,
  notificationsEnabled: false,
};

const defaultStopwatch: Stopwatch = {
  isRunning: false,
  elapsedMs: 0,
  laps: [],
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // SETTINGS
      settings: defaultSettings,
      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),

      // TIMERS
      timers: [],
      addTimer: (timer) =>
        set((state) => ({ timers: [...state.timers, timer] })),
      updateTimer: (id, updates) =>
        set((state) => ({
          timers: state.timers.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),
      removeTimer: (id) =>
        set((state) => ({
          timers: state.timers.filter((t) => t.id !== id),
        })),

      // STOPWATCH
      stopwatch: defaultStopwatch,
      updateStopwatch: (updates) =>
        set((state) => ({
          stopwatch: { ...state.stopwatch, ...updates },
        })),
      resetStopwatch: () => set({ stopwatch: defaultStopwatch }),

      // ALARMS
      alarms: [],
      addAlarm: (alarm) =>
        set((state) => ({ alarms: [...state.alarms, alarm] })),
      updateAlarm: (id, updates) =>
        set((state) => ({
          alarms: state.alarms.map((a) =>
            a.id === id ? { ...a, ...updates } : a
          ),
        })),
      removeAlarm: (id) =>
        set((state) => ({
          alarms: state.alarms.filter((a) => a.id !== id),
        })),

      // WORLD CLOCKS
      worldClocks: [],
      addWorldClock: (clock) =>
        set((state) => ({ worldClocks: [...state.worldClocks, clock] })),
      removeWorldClock: (id) =>
        set((state) => ({
          worldClocks: state.worldClocks.filter((c) => c.id !== id),
        })),
      updateWorldClock: (id, updates) =>
        set((state) => ({
          worldClocks: state.worldClocks.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),

      // 🔔 RINGING ALARM
      ringingAlarmId: null,
      setRingingAlarm: (id) => set({ ringingAlarmId: id }),
      clearRingingAlarm: () => set({ ringingAlarmId: null }),
    }),
    {
      name: 'alarma-storage',
      partialize: (state) => ({
        settings: state.settings,
        timers: state.timers,
        stopwatch: state.stopwatch,
        alarms: state.alarms,
        worldClocks: state.worldClocks,
        ringingAlarmId: state.ringingAlarmId,
      }),
    }
  )
);
