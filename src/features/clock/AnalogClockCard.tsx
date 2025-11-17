import React from 'react';
import { AnalogClock } from '../../components/AnalogClock';
import { DigitalClock } from '../../components/DigitalClock';

export const AnalogClockCard: React.FC = () => {
  return (
    <div className="card-neomorphic flex flex-col items-center gap-8 p-8">
      <AnalogClock size={320} />
      <DigitalClock />
    </div>
  );
};

