# ⏰ Alarma - Control Center de Tiempo

Una aplicación web moderna y completa para gestión de tiempo con diseño neumórfico, múltiples funcionalidades y temas personalizables.

## 🚀 Características

### ✨ Funcionalidades Principales

- **Reloj Analógico**: Reloj analógico en tiempo real con animaciones suaves
- **Reloj Digital**: Muestra hora y fecha actual
- **Relojes Mundiales**: Visualiza múltiples zonas horarias simultáneamente
- **Temporizadores**: Crea y gestiona múltiples temporizadores en paralelo
- **Cronómetro**: Cronómetro con precisión de milisegundos y sistema de vueltas (laps)
- **Alarmas Avanzadas**: Sistema completo de alarmas con:
  - Repetición por días de la semana
  - Repetición personalizada con intervalos (horas/minutos/segundos/milisegundos)
  - Ventanas de tiempo (hora de inicio y fin)
  - Notificaciones del navegador

### 🎨 Diseño

- **Neumorfismo**: Diseño moderno con efectos neumórficos
- **Temas Múltiples**: 3 temas predefinidos (Aurora Light, Midnight Dark, Cyber Mint)
- **Modo Claro/Oscuro**: Soporte completo para ambos modos
- **Animaciones Suaves**: Transiciones fluidas con Framer Motion
- **Responsive**: Diseño adaptable a diferentes tamaños de pantalla

## 🛠️ Tecnologías

- **React 18** + **TypeScript**
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Estilos y diseño
- **Framer Motion** - Animaciones
- **Zustand** - Estado global con persistencia
- **Day.js** - Manejo de fechas y zonas horarias
- **React Router** - Navegación
- **Lucide React** - Iconos

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone <repo-url>
cd Alarma
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

4. Abre tu navegador en `http://localhost:5173`

## 🏗️ Estructura del Proyecto

```
src/
  components/          # Componentes reutilizables
    AnalogClock.tsx
    DigitalClock.tsx
    Navigation.tsx
  features/           # Funcionalidades por módulo
    clock/
    world-clock/
    timer/
    stopwatch/
    alarms/
    settings/
    home/
  theme/             # Sistema de temas
    themes.ts
    ThemeProvider.tsx
  hooks/             # Custom hooks
    useAnalogClock.ts
    useCurrentTime.ts
  store/             # Estado global (Zustand)
    useStore.ts
  utils/             # Utilidades
    time.ts
    alarmEngine.ts
  types/             # Tipos TypeScript
    index.ts
  styles/            # Estilos globales
    globals.css
  App.tsx
  main.tsx
```

## 🎯 Uso

### Reloj Analógico
El reloj analógico se actualiza en tiempo real con animaciones suaves. Puedes verlo en la vista principal.

### Relojes Mundiales
1. Ve a la sección "Mundial"
2. Haz clic en "Añadir Ciudad"
3. Selecciona una ciudad de la lista
4. La hora se mostrará con la diferencia respecto a tu hora local

### Temporizadores
1. Ve a "Temporizador"
2. Crea un nuevo temporizador especificando horas, minutos y segundos
3. Inicia, pausa o reinicia según necesites
4. Múltiples temporizadores pueden ejecutarse en paralelo

### Cronómetro
1. Ve a "Cronómetro"
2. Inicia el cronómetro
3. Registra vueltas (laps) mientras corre
4. Pausa o reinicia cuando lo necesites

### Alarmas
1. Ve a "Alarmas"
2. Crea una nueva alarma especificando:
   - Hora y minuto
   - Días de la semana
   - (Opcional) Repetición personalizada con intervalos
3. Activa/desactiva alarmas según necesites
4. Las alarmas activas aparecerán en el dashboard principal

### Configuración
- Cambia entre temas disponibles
- Selecciona formato de hora (12h/24h)
- Ajusta el volumen de sonidos
- Habilita/deshabilita notificaciones

## 🎨 Temas

### Aurora (Light)
- Fondo claro con tonos azul-gris
- Ideal para uso diurno

### Midnight (Dark)
- Fondo oscuro con acentos índigo
- Perfecto para uso nocturno

### Cyber Mint (Dark)
- Tema oscuro con acentos verdes
- Estilo cyberpunk

## 📝 Notas

- Los datos se guardan automáticamente en el localStorage
- Las notificaciones requieren permisos del navegador
- El reloj analógico se actualiza cada 50ms para movimiento suave
- Los temporizadores y cronómetros usan timestamps para evitar drift

## 🚧 Próximas Mejoras

- [ ] Sonidos personalizados para alarmas
- [ ] Widgets personalizables
- [ ] Exportar/importar configuración
- [ ] Modo pantalla completa
- [ ] Más zonas horarias
- [ ] Recordatorios adicionales

## 📄 Licencia

MIT

---

Desarrollado con ❤️ usando React y TypeScript

# alarma-pwa
