
import React, { useState, useEffect } from 'react';
import type { AnalysisResult, Language } from '../types';
import { DownloadIcon } from './icons/DownloadIcon';
import { ImageEditIcon } from './icons/ImageEditIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';
import { t } from '../localization';

interface OutputDisplayProps {
  language: Language;
  generatedPrompt: string | null;
  generatedImage: string | null;
  isLoading: boolean;
  error: string | null;
  analysisResult: AnalysisResult | null;
  isAnalyzing: boolean;
  onSuggestionClick: (suggestion: string) => void;
  onImageClick: () => void;
  onPromptChange: (newPrompt: string) => void;
  onRegenerate: () => void;
}

const Skeleton: React.FC<{ className?: string }> = ({ className }) => {
    return <div className={`bg-brand-light-blue/50 rounded-md animate-pulse ${className}`} />;
};

export const OutputDisplay: React.FC<OutputDisplayProps> = ({
  language,
  generatedPrompt,
  generatedImage,
  isLoading,
  error,
  analysisResult,
  isAnalyzing,
  onSuggestionClick,
  onImageClick,
  onPromptChange,
  onRegenerate
}) => {
    const [isPromptEditing, setIsPromptEditing] = useState(false);

    useEffect(() => {
        // When a new image generation completes, reset the editing state.
        if (isLoading === false) {
          setIsPromptEditing(false);
        }
    }, [isLoading]);


    const handleCopy = (textToCopy: string | null) => {
        if(textToCopy && typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(textToCopy).catch(err => {
                console.warn('Clipboard copy failed:', err);
            });
        }
    }

    const handleDownload = () => {
        if (!generatedImage) return;
        const link = document.createElement('a');
        link.href = generatedImage;
        const mimeType = generatedImage.split(';')[0].split(':')[1];
        const extension = mimeType?.split('/')[1] || 'png';
        link.download = `promptgenius-image.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const textAreaClasses = [
        "w-full text-gray-300 bg-brand-dark-blue/50 p-4 rounded-md text-sm leading-relaxed border border-transparent transition-all resize-none",
        isPromptEditing 
        ? "focus:outline-none focus:ring-1 focus:ring-brand-orange focus:border-brand-orange cursor-text"
        : "cursor-default focus:ring-0 focus:border-transparent"
    ].join(' ');

  return (
    <div className="bg-brand-mid-blue rounded-lg p-6 border border-brand-light-blue/50 space-y-6">
      {analysisResult && (
        <div>
          <h2 className="text-lg font-semibold text-gray-300 mb-2">{t('imageAnalysis', language)}</h2>
          <div className="relative bg-brand-dark-blue/50 p-4 rounded-md space-y-4">
            <div>
                <p className="text-gray-300 text-sm leading-relaxed">{analysisResult.description}</p>
                <button 
                    onClick={() => handleCopy(analysisResult.description)}
                    className="absolute top-2 right-2 p-1.5 bg-brand-light-blue rounded-md hover:bg-brand-light-blue/70 text-gray-300 transition"
                    title={t('copyDescription', language)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                </button>
            </div>

            {analysisResult.suggestions.length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">{t('suggestedEdits', language)}</h3>
                    <div className="flex flex-wrap gap-2">
                        {analysisResult.suggestions.map((suggestion, index) => (
                            <button
                                key={index}
                                onClick={() => onSuggestionClick(suggestion)}
                                className="px-3 py-1.5 text-xs rounded-md transition-all duration-200 border bg-brand-light-blue border-brand-light-blue hover:border-brand-cyan/70 text-gray-200"
                            >
                                "{suggestion}"
                            </button>
                        ))}
                    </div>
                </div>
            )}
          </div>
        </div>
      )}
      
      {(generatedPrompt || (isLoading && !generatedImage)) && (
          <div className="relative">
            <h2 className="text-lg font-semibold text-gray-300 mb-2">{t('generatedPrompt', language)}</h2>
            {isLoading && !generatedPrompt && (
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
            )}
            {generatedPrompt && (
              <>
              <div className="relative">
                 <textarea
                    value={generatedPrompt}
                    onChange={(e) => onPromptChange(e.target.value)}
                    className={textAreaClasses}
                    rows={6}
                    aria-label={t('generatedPrompt', language)}
                    readOnly={!isPromptEditing}
                 />
                 <button 
                    onClick={() => handleCopy(generatedPrompt)}
                    className="absolute top-2 right-2 p-1.5 bg-brand-light-blue rounded-md hover:bg-brand-light-blue/70 text-gray-300 transition"
                    title={t('copyPrompt', language)}
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                 </button>
              </div>

              {generatedImage && !isLoading && (
                  <div className="mt-4">
                  {!isPromptEditing ? (
                    <button
                      onClick={() => setIsPromptEditing(true)}
                      className="w-full flex items-center justify-center py-2 px-4 border border-brand-light-blue rounded-md shadow-sm text-sm font-semibold text-gray-200 bg-brand-light-blue hover:bg-brand-light-blue/80 transition-all duration-300 group"
                    >
                      <ImageEditIcon className="w-5 h-5 mr-2" />
                      {t('modifyPrompt', language)}
                    </button>
                  ) : (
                    <button
                      onClick={onRegenerate}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-lg text-base font-bold text-brand-dark-blue bg-brand-orange hover:bg-brand-orange/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange focus:ring-offset-brand-dark-blue disabled:bg-brand-orange/50 disabled:cursor-not-allowed transition-all duration-300 group"
                    >
                      <SparklesIcon className="w-6 h-6 mr-2 transition-transform duration-300 group-hover:scale-110" />
                      {t('generateNewImage', language)}
                    </button>
                  )}
                </div>
              )}
              </>
            )}
          </div>
      )}

      <div>
        <h2 className="text-lg font-semibold text-gray-300 mb-2">{t('generatedImage', language)}</h2>
        <div className="relative group aspect-square bg-brand-dark-blue/50 rounded-lg flex items-center justify-center border border-brand-light-blue overflow-hidden">
          {(isLoading || isAnalyzing) && (
             <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                    <svg className="animate-spin mx-auto h-10 w-10 text-brand-cyan" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-2 text-sm">{isAnalyzing ? t('analyzing', language) : t('crafting', language)}</p>
                </div>
            </div>
          )}
          {!(isLoading || isAnalyzing) && error && (
            <div className="p-4">
              <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 flex items-start space-x-3">
                  <div className="flex-shrink-0">
                      <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
                  </div>
                  <div className="flex-1">
                      <h3 className="font-semibold text-red-300">{t('generationFailed', language)}</h3>
                      <p className="text-sm text-red-400/90 mt-1">{error}</p>
                  </div>
              </div>
            </div>
          )}
           {!(isLoading || isAnalyzing) && !error && generatedImage && (
            <>
              <button onClick={onImageClick} className="w-full h-full appearance-none cursor-pointer">
                <img src={generatedImage} alt="Generated masterpiece" className="w-full h-full object-cover" />
              </button>
              <button
                onClick={handleDownload}
                className="absolute top-3 right-3 p-2 bg-brand-dark-blue/60 rounded-full text-gray-200 hover:bg-brand-dark-blue/90 hover:text-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                title={t('downloadImage', language)}
                aria-label={t('downloadImage', language)}
              >
                  <DownloadIcon className="w-5 h-5" />
              </button>
            </>
           )}
           {!(isLoading || isAnalyzing) && !error && !generatedImage && (
            <p className="text-gray-500">{t('outputPlaceholder', language)}</p>
           )}
        </div>
      </div>
    </div>
  );
};
