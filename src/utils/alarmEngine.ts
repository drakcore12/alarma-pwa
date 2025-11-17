// src/utils/alarmEngine.ts
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { Alarm } from '../types';

dayjs.extend(utc);
dayjs.extend(timezone);

// Mapa de días de la semana (dayjs: 0=Dom,1=Lun,...)
const weekdayMap: Record<string, number> = {
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
  sun: 0,
};

class AlarmEngine {
  private intervalId: number | null = null;
  private rafId: number | null = null;

  // Para no disparar mil veces la misma ocurrencia
  private lastTriggered: Map<string, string> = new Map();

  // La función que se ejecuta cada segundo (la inyecta App)
  private checkCallback: (() => void) | null = null;

  setCheckCallback(fn: () => void) {
    this.checkCallback = fn;
  }

  start() {
    if (this.intervalId !== null || this.rafId !== null) return;

    // Primer chequeo inmediato
    this.safeCheck();

    // 1) Chequeo cada segundo (puede sufrir drift)
    this.intervalId = window.setInterval(() => {
      this.safeCheck();
    }, 1000);

    // 2) Chequeo adicional con requestAnimationFrame
    const loop = () => {
      this.safeCheck();
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  stop() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.lastTriggered.clear();
  }

  // Chequeo seguro con try/catch para que un error no mate el motor
  private safeCheck() {
    try {
      if (this.checkCallback) this.checkCallback();
    } catch (e) {
      console.error('Error en alarma:', e);
    }
  }

  // Chequea UNA alarma. Devuelve true si se disparó ahora
  checkAlarm(alarm: Alarm, onTrigger: () => void): boolean {
    if (!alarm.active) return false;

    const now = dayjs();

    // Día de la semana
    const currentWeekday = now.day(); // 0=Dom, 1=Lun...
    const isWeekdayMatch = alarm.weekdays.some(
      (day) => weekdayMap[day] === currentWeekday
    );
    if (!isWeekdayMatch) return false;

    // ===========================
    // 1) SIN repetición personalizada
    // ===========================
    if (!alarm.repetitionWindow?.enabled) {
      // Hora objetivo del día (hh:mm:00.000)
      const target = now
        .hour(alarm.hour)
        .minute(alarm.minute)
        .second(0)
        .millisecond(0);

      // Tolerancia alrededor de la hora objetivo (por ejemplo ±30s)
      const TOLERANCIA_MS_HORA_SIMPLE = 30_000; // 30 segundos
      const diffMs = Math.abs(now.valueOf() - target.valueOf());

      if (diffMs > TOLERANCIA_MS_HORA_SIMPLE) {
        return false;
      }

      // Usamos la hora objetivo en la clave para asegurar que solo se dispare una vez por día/hora/minuto
      const occurrenceKey = `${alarm.id}-${target.format('YYYY-MM-DD-HH:mm')}`;
      const lastKey = this.lastTriggered.get(alarm.id);

      if (lastKey === occurrenceKey) return false;

      this.lastTriggered.set(alarm.id, occurrenceKey);
      onTrigger();
      return true;
    }

    // ===========================
    // 2) CON repetición personalizada
    // ===========================
    const { startTime, endTime, intervalMs } = alarm.repetitionWindow;

    if (!startTime || !endTime || !intervalMs || intervalMs <= 0) {
      return false;
    }

    const [shStr = '0', smStr = '0'] = startTime.split(':');
    const [ehStr = '0', emStr = '0'] = endTime.split(':');
    const sh = parseInt(shStr, 10) || 0;
    const sm = parseInt(smStr, 10) || 0;
    const eh = parseInt(ehStr, 10) || 0;
    const em = parseInt(emStr, 10) || 0;

    let start = now.hour(sh).minute(sm).second(0).millisecond(0);
    let end = now.hour(eh).minute(em).second(0).millisecond(0);

    // Ventana que cruza medianoche (ej: 20:00 → 02:00)
    if (end.isBefore(start)) {
      if (now.isBefore(end)) {
        start = start.subtract(1, 'day');
      } else {
        end = end.add(1, 'day');
      }
    }

    // Fuera de la ventana → nada
    if (now.isBefore(start) || now.isAfter(end)) {
      return false;
    }

    // Dentro de la ventana: calculamos pasos de intervalo
    const elapsedMs = now.valueOf() - start.valueOf();
    if (elapsedMs < 0) return false;

    const safeIntervalMs = intervalMs;

    const mod = elapsedMs % safeIntervalMs;
    const distanceToMultiple = Math.min(mod, safeIntervalMs - mod);

    // Ventana de tolerancia: 2000 ms alrededor del múltiplo más cercano
    const TOLERANCIA_MS = 2000;

    if (distanceToMultiple > TOLERANCIA_MS) {
      return false;
    }

    const step = Math.round(elapsedMs / safeIntervalMs);
    const occurrenceKey = `${alarm.id}-${now.format(
      'YYYY-MM-DD'
    )}-step-${step}`;
    const lastKey = this.lastTriggered.get(alarm.id);
    if (lastKey === occurrenceKey) return false;

    this.lastTriggered.set(alarm.id, occurrenceKey);
    onTrigger();
    return true;
  }
}

export const alarmEngine = new AlarmEngine();

/**
 * Helper para calcular la siguiente ocurrencia de una alarma
 * (para mostrarla en el card de la UI)
 */
export function getNextAlarmOccurrence(
  alarm: Alarm,
  fromDate: Date = new Date()
): Date | null {
  if (!alarm.active) return null;

  let now = dayjs(fromDate);

  const isAllowedDay = (d: dayjs.Dayjs) =>
    alarm.weekdays.some((day) => weekdayMap[day] === d.day());

  // Probamos como máximo los próximos 7 días
  for (let i = 0; i < 7; i++) {
    const day = now.add(i, 'day');

    if (!isAllowedDay(day)) continue;

    // 🔹 Caso sin repetición personalizada
    if (!alarm.repetitionWindow?.enabled) {
      let candidate = day
        .hour(alarm.hour)
        .minute(alarm.minute)
        .second(0)
        .millisecond(0);

      if (candidate.isAfter(now)) {
        return candidate.toDate();
      }
      continue;
    }

    // 🔹 Con repetición personalizada
    const { startTime, endTime, intervalMs } = alarm.repetitionWindow;

    if (!startTime || !endTime || !intervalMs || intervalMs <= 0) {
      continue;
    }

    const [shStr = '0', smStr = '0'] = startTime.split(':');
    const [ehStr = '0', emStr = '0'] = endTime.split(':');
    const sh = parseInt(shStr, 10) || 0;
    const sm = parseInt(smStr, 10) || 0;
    const eh = parseInt(ehStr, 10) || 0;
    const em = parseInt(emStr, 10) || 0;

    let start = day.hour(sh).minute(sm).second(0).millisecond(0);
    let end = day.hour(eh).minute(em).second(0).millisecond(0);

    // Ventana que cruza medianoche
    if (end.isBefore(start)) {
      end = end.add(1, 'day');
    }

    const ref = i === 0 ? now : start;

    if (ref.isAfter(end)) {
      continue;
    }

    let base = start;
    if (ref.isAfter(start)) {
      const elapsedMs = ref.valueOf() - start.valueOf();
      const steps = Math.ceil(elapsedMs / intervalMs);
      base = dayjs(start.valueOf() + steps * intervalMs);
    }

    if (base.isAfter(end)) {
      continue;
    }

    if (base.isAfter(now)) {
      return base.toDate();
    }
  }

  return null;
}
