// Zonas horarias
export interface TimezoneClock {
  id: string;
  label: string;    // "New York"
  timezone: string; // "America/New_York"
  pinned?: boolean;
}

// Temporizador
export interface Timer {
  id: string;
  name?: string;
  durationMs: number;      // duración total en ms
  remainingMs: number;     // restante actual
  isRunning: boolean;
  startedAt?: number;      // timestamp para corregir drift
}

// Cronómetro
export interface Lap {
  id: string;
  lapNumber: number;
  lapTimeMs: number;
  totalTimeMs: number;
}

export interface Stopwatch {
  isRunning: boolean;
  startedAt?: number;      // timestamp
  elapsedMs: number;       // acumulado
  laps: Lap[];
}

// Alarmas
export type Weekday = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export interface AlarmRepetitionWindow {
  enabled: boolean;
  intervalMs: number;       // h/m/s/ms convertidos a ms
  startTime: string;        // "08:00"
  endTime: string;          // "12:00"
}

export interface Alarm {
  id: string;
  label?: string;
  hour: number;             // 0-23
  minute: number;           // 0-59
  active: boolean;
  weekdays: Weekday[];      // días activos
  repetitionWindow?: AlarmRepetitionWindow;
  createdAt: number;
}

// Tema
export interface Theme {
  id: string;
  name: string;
  mode: "light" | "dark";
  colors: {
    background: string;
    surface: string;
    primary: string;
    accent: string;
    textMain: string;
    textSoft: string;
    shadowLight: string;
    shadowDark: string;
  };
}

// Configuración de la app
export interface AppSettings {
  themeId: string;
  hourFormat: "12h" | "24h";
  soundVolume: number;      // 0-1
  notificationsEnabled: boolean;
}

