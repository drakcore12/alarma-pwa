import React from 'react';
import { useAnalogClock } from '../hooks/useAnalogClock';

interface AnalogClockProps {
  timezone?: string;
  size?: number;
  showCenterDot?: boolean;
}

export const AnalogClock: React.FC<AnalogClockProps> = ({
  timezone,
  size = 300,
  showCenterDot = true,
}) => {
  const time = useAnalogClock(timezone);

  // Calcular ángulos
  const hourAngle = (time.hours % 12) * 30 + time.minutes * 0.5;
  const minuteAngle = time.minutes * 6 + time.seconds * 0.1;
  const secondAngle = time.seconds * 6 + time.milliseconds * 0.006;

  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 20;

  // Longitudes de las manecillas
  const hourHandLength = radius * 0.5;
  const minuteHandLength = radius * 0.7;
  const secondHandLength = radius * 0.85;

  return (
    <div
      className="relative card-neomorphic rounded-full flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="absolute inset-0">
        {/* Marcas de horas */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const x1 = centerX + (radius - 15) * Math.cos(angle);
          const y1 = centerY + (radius - 15) * Math.sin(angle);
          const x2 = centerX + radius * Math.cos(angle);
          const y2 = centerY + radius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="var(--text-soft)"
              strokeWidth="2"
            />
          );
        })}

        {/* Marcas de minutos */}
        {Array.from({ length: 60 }).map((_, i) => {
          if (i % 5 === 0) return null; // Ya están las horas
          const angle = (i * 6 - 90) * (Math.PI / 180);
          const x1 = centerX + (radius - 8) * Math.cos(angle);
          const y1 = centerY + (radius - 8) * Math.sin(angle);
          const x2 = centerX + radius * Math.cos(angle);
          const y2 = centerY + radius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="var(--text-soft)"
              strokeWidth="1"
              opacity={0.5}
            />
          );
        })}

        {/* Manecilla de horas */}
        <g
          style={{
            transform: `rotate(${hourAngle}deg)`,
            transformOrigin: `${centerX}px ${centerY}px`,
            transition: 'transform 0.1s linear',
          }}
        >
          <line
            x1={centerX}
            y1={centerY}
            x2={centerX}
            y2={centerY - hourHandLength}
            stroke="var(--text-main)"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>

        {/* Manecilla de minutos */}
        <g
          style={{
            transform: `rotate(${minuteAngle}deg)`,
            transformOrigin: `${centerX}px ${centerY}px`,
            transition: 'transform 0.1s linear',
          }}
        >
          <line
            x1={centerX}
            y1={centerY}
            x2={centerX}
            y2={centerY - minuteHandLength}
            stroke="var(--text-main)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>

        {/* Manecilla de segundos */}
        <g
          style={{
            transform: `rotate(${secondAngle}deg)`,
            transformOrigin: `${centerX}px ${centerY}px`,
            transition: 'transform 0.05s linear',
          }}
        >
          <line
            x1={centerX}
            y1={centerY}
            x2={centerX}
            y2={centerY - secondHandLength}
            stroke="var(--primary)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>

        {/* Centro */}
        {showCenterDot && (
          <circle
            cx={centerX}
            cy={centerY}
            r="6"
            fill="var(--primary)"
            className="neomorphic-inset"
          />
        )}
      </svg>
    </div>
  );
};

