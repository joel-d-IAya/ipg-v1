
import React from 'react';
import { ImageUploader } from './ImageUploader';
import { TransformationSelector } from './TransformationSelector';
import { SparklesIcon } from './icons/SparklesIcon';
import type { Language, CreationMode } from '../types';
import { SearchIcon } from './icons/SearchIcon';
import { CheckIcon } from './icons/CheckIcon';
import { t } from '../localization';
import { SelectionSummary } from './SelectionSummary';
import { TemperatureSlider } from './TemperatureSlider';

interface ControlPanelProps {
  language: Language;
  creationMode: CreationMode;
  setCreationMode: (mode: CreationMode) => void;
  basePrompt: string;
  setBasePrompt: (prompt: string) => void;
  sourceImageUrl: string | null;
  handleImageUpload: (file: File | null) => void;
  selectedTransformations: string[];
  setSelectedTransformations: (keys: string[]) => void;
  outputFormat: string;
  setOutputFormat: (format: string) => void;
  customAspectRatio: string;
  setCustomAspectRatio: (ratio: string) => void;
  isLoading: boolean;
  onGenerate: () => void;
  useSearchGrounding: boolean;
  setUseSearchGrounding: (value: boolean) => void;
  temperature: number;
  setTemperature: (value: number) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  onOpenArtistModal: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  language, creationMode, setCreationMode, basePrompt, setBasePrompt,
  sourceImageUrl, handleImageUpload, selectedTransformations,
  setSelectedTransformations, outputFormat, setOutputFormat,
  customAspectRatio, setCustomAspectRatio,
  isLoading, onGenerate, useSearchGrounding, setUseSearchGrounding,
  temperature, setTemperature, onAnalyze, isAnalyzing, onOpenArtistModal
}) => {
  const isTransformMode = creationMode === 'transform';

  const promptLabel = isTransformMode ? t('editingInstructions', language) : t('basePrompt', language);
  const promptPlaceholder = isTransformMode
    ? t('editingPlaceholder', language)
    : t('basePromptPlaceholder', language);

  const buttonContent = isLoading ? (
    <>
      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-brand-dark-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      {t('generating', language)}
    </>
  ) : (
    <>
      <SparklesIcon className="w-6 h-6 mr-2 transition-transform duration-300 group-hover:scale-110" />
      {isTransformMode ? t('transformMyImageAction', language) : t('createAnImageAction', language)}
    </>
  );

  const summaryAndActionBlock = (
    <div>
      <SelectionSummary
        language={language}
        selectedTransformations={selectedTransformations}
        outputFormat={outputFormat}
      />
      <div className="mt-4">
        <button
          onClick={onGenerate}
          disabled={isLoading || isAnalyzing}
          className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-lg text-base font-bold text-brand-dark-blue bg-brand-orange hover:bg-brand-orange/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange focus:ring-offset-brand-dark-blue disabled:bg-brand-orange/50 disabled:cursor-not-allowed transition-all duration-300 group"
        >
          {buttonContent}
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-brand-mid-blue rounded-lg p-6 border border-brand-light-blue/50 space-y-6">

      {/* Mode Switcher */}
      <div className="flex bg-brand-dark-blue p-1 rounded-lg">
        <button
          onClick={() => setCreationMode('transform')}
          className={`w-1/2 py-2.5 text-sm font-semibold rounded-md flex items-center justify-center transition-colors duration-300 ${isTransformMode ? 'bg-brand-cyan text-brand-dark-blue' : 'text-gray-300 hover:bg-brand-light-blue/50'
            }`}
        >
          {isTransformMode && <CheckIcon className="w-5 h-5 mr-2" />}
          {t('transformMyImage', language)}
        </button>
        <button
          onClick={() => setCreationMode('create')}
          className={`w-1/2 py-2.5 text-sm font-semibold rounded-md flex items-center justify-center transition-colors duration-300 ${!isTransformMode ? 'bg-brand-cyan text-brand-dark-blue' : 'text-gray-300 hover:bg-brand-light-blue/50'
            }`}
        >
          {!isTransformMode && <CheckIcon className="w-5 h-5 mr-2" />}
          {t('createAnImage', language)}
        </button>
      </div>

      {/* Main Inputs */}
      {isTransformMode ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <ImageUploader
            language={language}
            sourceImageUrl={sourceImageUrl}
            onImageUpload={handleImageUpload}
            onAnalyze={onAnalyze}
            isAnalyzing={isAnalyzing}
          />
          <div className="space-y-2 flex flex-col">
            <label htmlFor="basePrompt" className="block text-sm font-medium text-gray-400">
              {promptLabel}
            </label>
            <textarea
              id="basePrompt"
              value={basePrompt}
              onChange={(e) => setBasePrompt(e.target.value)}
              className="w-full bg-brand-dark-blue border border-brand-light-blue rounded-md shadow-sm p-3 focus:outline-none focus:ring-brand-orange focus:border-brand-orange transition-all flex-1 resize-none"
              placeholder={promptPlaceholder}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="basePrompt" className="block text-sm font-medium text-gray-400">
              {promptLabel}
            </label>
            <textarea
              id="basePrompt"
              rows={4}
              value={basePrompt}
              onChange={(e) => setBasePrompt(e.target.value)}
              className="w-full bg-brand-dark-blue border border-brand-light-blue rounded-md shadow-sm p-3 focus:outline-none focus:ring-brand-orange focus:border-brand-orange transition-all"
              placeholder={promptPlaceholder}
            />
          </div>
          <div className="flex items-center pt-1">
            <input
              type="checkbox"
              id="search-grounding"
              checked={useSearchGrounding}
              onChange={(e) => setUseSearchGrounding(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-brand-cyan bg-brand-dark-blue focus:ring-brand-cyan"
            />
            <label htmlFor="search-grounding" className="ml-2 flex items-center text-sm text-gray-400">
              <SearchIcon className="w-4 h-4 mr-1.5" />
              {t('useSearch', language)}
            </label>
          </div>
        </div>
      )}

      <TemperatureSlider
        language={language}
        temperature={temperature}
        setTemperature={setTemperature}
      />

      {/* --- Summary & Button Block (TOP) --- */}
      {summaryAndActionBlock}


      {/* Transformation Options */}
      <fieldset className="transition-opacity duration-300">
        <legend className="sr-only">Image creation and transformation options</legend>
        <TransformationSelector
          selectedTransformations={selectedTransformations}
          setSelectedTransformations={setSelectedTransformations}
          outputFormat={outputFormat}
          setOutputFormat={setOutputFormat}
          language={language}
          onOpenArtistModal={onOpenArtistModal}
          customAspectRatio={customAspectRatio}
          setCustomAspectRatio={setCustomAspectRatio}
        />
      </fieldset>

      {/* --- Summary & Button Block (BOTTOM) --- */}
      {summaryAndActionBlock}
    </div>
  );
};
