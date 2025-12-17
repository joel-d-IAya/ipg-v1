import React from 'react';
import { LANGUAGES } from '../constants';
import type { Language } from '../types';
import iayaLogo from '../assets/logo.png';

interface HeaderProps {
    language: Language;
    setLanguage: (lang: Language) => void;
}

const TITLES: Record<Language, string> = {
    fr: 'IAya Magic Image Generator',
    en: 'IAya Magic Image Generator',
    es: 'IAya Magic Image Generator'
};

export const Header: React.FC<HeaderProps> = ({ language, setLanguage }) => {
  return (
    <header className="border-b border-brand-cyan/20">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
            <img src={iayaLogo} alt="IAya Logo" className="h-8 w-auto mr-4" />
            <h1 className="text-xl font-medium text-brand-cyan">
            {TITLES[language]}
            </h1>
        </div>
        <div className="bg-brand-mid-blue/50 rounded-full p-1 flex items-center">
          {LANGUAGES.map(lang => (
            <button
              key={lang.value}
              onClick={() => setLanguage(lang.value)}
              className={`px-3 py-1 text-sm font-medium rounded-full transition-colors duration-300 focus:outline-none ${
                language === lang.value
                  ? 'bg-brand-cyan text-brand-dark-blue'
                  : 'text-gray-300 hover:bg-brand-light-blue'
              }`}
              aria-pressed={language === lang.value}
            >
              {lang.short.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};