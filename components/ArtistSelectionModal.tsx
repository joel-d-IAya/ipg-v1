
import React, { useState, useEffect } from 'react';
import { ARTISTS } from '../constants';
import { t } from '../localization';
import type { Language } from '../types';
import { CheckIcon } from './icons/CheckIcon';
import { CloseIcon } from './icons/CloseIcon';

interface ArtistSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (artistName: string) => void;
  language: Language;
}

export const ArtistSelectionModal: React.FC<ArtistSelectionModalProps> = ({ isOpen, onClose, onSelect, language }) => {
  const [selectedArtist, setSelectedArtist] = useState<string>(ARTISTS[0]?.name || '');
  const [otherArtist, setOtherArtist] = useState<string>('');
  const isOtherSelected = selectedArtist === 'Other';

  useEffect(() => {
    if (isOpen && ARTISTS.length > 0) {
      setSelectedArtist(ARTISTS[0].name);
      setOtherArtist('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const artistToSelect = isOtherSelected ? otherArtist.trim() : selectedArtist;
    if (artistToSelect) {
      onSelect(artistToSelect);
    }
  };
  
  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-brand-dark-blue/80 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="bg-brand-mid-blue rounded-lg p-6 border border-brand-light-blue/50 w-full max-w-md m-4 transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-200">{t('selectArtistTitle', language)}</h2>
            <button type="button" onClick={onClose} className="p-1 text-gray-400 hover:text-white transition-colors">
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="artist-select" className="sr-only">Select an Artist</label>
              <select
                id="artist-select"
                value={selectedArtist}
                onChange={(e) => setSelectedArtist(e.target.value)}
                className="w-full bg-brand-dark-blue border border-brand-light-blue rounded-md shadow-sm p-3 focus:outline-none focus:ring-brand-orange focus:border-brand-orange transition-all"
              >
                {ARTISTS.map(artist => (
                  <option key={artist.name} value={artist.name}>
                    {artist.name} ({ (artist as any)[`style_${language}`] || artist.style_en })
                  </option>
                ))}
                <option value="Other">{t('otherArtist', language)}</option>
              </select>
            </div>
            
            {isOtherSelected && (
              <div>
                <label htmlFor="other-artist" className="sr-only">{t('otherArtistPlaceholder', language)}</label>
                <input
                  type="text"
                  id="other-artist"
                  value={otherArtist}
                  onChange={(e) => setOtherArtist(e.target.value)}
                  placeholder={t('otherArtistPlaceholder', language)}
                  className="w-full bg-brand-dark-blue border border-brand-light-blue rounded-md shadow-sm p-3 focus:outline-none focus:ring-brand-orange focus:border-brand-orange transition-all"
                  required
                />
              </div>
            )}
          </div>
          
          <div className="mt-6">
            <button
              type="submit"
              disabled={isOtherSelected && !otherArtist.trim()}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-lg text-base font-bold text-brand-dark-blue bg-brand-orange hover:bg-brand-orange/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange focus:ring-offset-brand-dark-blue disabled:bg-brand-orange/50 disabled:cursor-not-allowed transition-all"
            >
              <CheckIcon className="w-5 h-5 mr-2" />
              {t('selectArtistAction', language)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
