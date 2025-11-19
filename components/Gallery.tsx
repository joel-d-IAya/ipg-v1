


import React from 'react';
import { t } from '../localization';
import type { Language } from '../types';

interface GalleryProps {
  language: Language;
  images: string[];
  currentImage: string | null;
  onImageSelect: (index: number) => void;
}

export const Gallery: React.FC<GalleryProps> = ({ language, images, currentImage, onImageSelect }) => {
  if (images.length === 0) {
    return null; // Don't render anything if there are no images yet
  }

  return (
    <div className="mt-12">
      <h2 className="text-xl font-semibold text-gray-300 mb-4 text-center">{t('sessionGallery', language)}</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 bg-brand-mid-blue p-4 rounded-lg border border-brand-light-blue/50">
        {images.map((imgSrc, index) => (
          <button
            key={index}
            onClick={() => onImageSelect(index)}
            className={`aspect-square rounded-md overflow-hidden focus:outline-none transition-all duration-300 transform hover:scale-105 ${
              currentImage === imgSrc ? 'ring-4 ring-brand-cyan ring-offset-2 ring-offset-brand-mid-blue' : 'ring-1 ring-brand-light-blue/50'
            }`}
          >
            <img
              src={imgSrc}
              alt={`Generated image ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};
