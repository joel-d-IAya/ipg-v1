
import React, { useRef } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { AnalyzeIcon } from './icons/AnalyzeIcon';
import { t } from '../localization';
import type { Language } from '../types';

interface ImageUploaderProps {
  language: Language;
  sourceImageUrl: string | null;
  onImageUpload: (file: File | null) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ language, sourceImageUrl, onImageUpload, onAnalyze, isAnalyzing }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onImageUpload(file);
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageUpload(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-400">{t('sourceImage', language)}</label>
      <div 
        className="aspect-square w-full bg-brand-dark-blue border-2 border-dashed border-brand-light-blue rounded-lg flex items-center justify-center text-center relative group cursor-pointer"
        onClick={() => !sourceImageUrl && fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
        />
        {sourceImageUrl ? (
          <>
            <img src={sourceImageUrl} alt="Source Preview" className="w-full h-full object-cover rounded-md" />
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md p-4 space-y-3">
              <button
                onClick={onAnalyze}
                disabled={isAnalyzing}
                className="w-40 flex items-center justify-center bg-brand-cyan text-brand-dark-blue px-4 py-2 rounded-md text-sm font-semibold hover:bg-brand-cyan/90 transition disabled:opacity-50"
              >
                {isAnalyzing ? (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                ) : (
                    <AnalyzeIcon className="w-5 h-5 mr-2" />
                )}
                {t('analyzeImage', language)}
              </button>
              <button
                onClick={handleRemoveImage}
                className="w-40 bg-red-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-red-700 transition"
              >
                {t('remove', language)}
              </button>
            </div>
          </>
        ) : (
          <div className="text-gray-400 p-4">
            <UploadIcon className="mx-auto h-10 w-10" />
            <p className="mt-2 text-sm">{t('uploadPrompt', language)}</p>
            <p className="text-xs text-gray-500">{t('uploadSubPrompt', language)}</p>
          </div>
        )}
      </div>
    </div>
  );
};
