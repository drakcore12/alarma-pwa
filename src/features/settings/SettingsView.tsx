import React from 'react';
import { useStore } from '../../store/useStore';
import { useTheme } from '../../theme/ThemeProvider';
import { Bell, Volume2, Clock } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings } = useStore();
  const { theme, setTheme, themes } = useTheme();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-bold">Configuración</h2>

      <div className="card-neomorphic p-6 space-y-4">
        <h3 className="text-xl font-display font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Tema
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTheme(t.id);
                updateSettings({ themeId: t.id });
              }}
              className={`p-4 rounded-xl border-2 transition-all ${
                theme.id === t.id
                  ? 'border-[var(--primary)] neomorphic-pressed'
                  : 'border-transparent neomorphic-inset hover:neomorphic-hover'
              }`}
            >
              <div className="font-medium mb-2">{t.name}</div>
              <div className="text-sm text-[var(--text-soft)]">{t.mode}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="card-neomorphic p-6 space-y-4">
        <h3 className="text-xl font-display font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Formato de Hora
        </h3>
        <div className="flex gap-4">
          <button
            onClick={() => updateSettings({ hourFormat: '12h' })}
            className={`flex-1 py-3 rounded-xl font-medium transition-all ${
              settings.hourFormat === '12h'
                ? 'bg-[var(--primary)] text-white'
                : 'neomorphic-inset'
            }`}
          >
            12 horas (AM/PM)
          </button>
          <button
            onClick={() => updateSettings({ hourFormat: '24h' })}
            className={`flex-1 py-3 rounded-xl font-medium transition-all ${
              settings.hourFormat === '24h'
                ? 'bg-[var(--primary)] text-white'
                : 'neomorphic-inset'
            }`}
          >
            24 horas
          </button>
        </div>
      </div>

      <div className="card-neomorphic p-6 space-y-4">
        <h3 className="text-xl font-display font-semibold flex items-center gap-2">
          <Volume2 className="w-5 h-5" />
          Volumen de Sonidos
        </h3>
        <input
          type="range"
          min="0"
          max="100"
          value={settings.soundVolume * 100}
          onChange={(e) =>
            updateSettings({ soundVolume: parseInt(e.target.value) / 100 })
          }
          className="w-full"
        />
        <div className="text-sm text-[var(--text-soft)] text-center">
          {Math.round(settings.soundVolume * 100)}%
        </div>
      </div>

      <div className="card-neomorphic p-6 space-y-4">
        <h3 className="text-xl font-display font-semibold flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notificaciones
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Permitir notificaciones</div>
            <div className="text-sm text-[var(--text-soft)]">
              Recibir alertas de alarmas y temporizadores
            </div>
          </div>
          <button
            onClick={() =>
              updateSettings({
                notificationsEnabled: !settings.notificationsEnabled,
              })
            }
            className={`w-12 h-6 rounded-full transition-all ${
              settings.notificationsEnabled
                ? 'bg-[var(--primary)]'
                : 'bg-[var(--shadow-dark)]'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                settings.notificationsEnabled
                  ? 'translate-x-6'
                  : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

