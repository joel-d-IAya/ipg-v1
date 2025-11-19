
import React from 'react';
import { t } from '../localization';
import type { Language } from '../types';
import { InfoIcon } from './icons/InfoIcon';

interface TemperatureSliderProps {
  language: Language;
  temperature: number;
  setTemperature: (value: number) => void;
}

export const TemperatureSlider: React.FC<TemperatureSliderProps> = ({ language, temperature, setTemperature }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2 group relative">
        <label htmlFor="temperature" className="block text-sm font-medium text-gray-400">
          {t('temperature', language)}
        </label>
        <div className="text-gray-500 cursor-help">
            <InfoIcon className="w-4 h-4" />
        </div>
        <div className="absolute bottom-full left-0 mb-2 w-64 bg-brand-dark-blue p-2 text-xs text-gray-300 rounded-md border border-brand-light-blue shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            {t('temperatureTooltip', language)}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <input
          id="temperature"
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={temperature}
          onChange={(e) => setTemperature(parseFloat(e.target.value))}
          className="temperature-slider w-full"
        />
        <span className="bg-brand-dark-blue text-gray-300 text-sm font-mono px-2 py-1 rounded-md w-16 text-center">
          {temperature.toLocaleString(language, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
        </span>
      </div>
    </div>
  );
};