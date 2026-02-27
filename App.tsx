
import React, { useState, useCallback, useEffect } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { OutputDisplay } from './components/OutputDisplay';
import { Header } from './components/Header';
import { Gallery } from './components/Gallery';
import { Lightbox } from './components/Lightbox';
import { geminiService } from './services/geminiService';
import { imageService } from './services/imageService';
import { getRawInstructions } from './utils/promptUtils';
import { dataUrlToFile } from './utils/imageUtils';
import { t } from './localization';
import type { Language, CreationMode, AnalysisResult } from './types';
import { ArtistSelectionModal } from './components/ArtistSelectionModal';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      if (typeof navigator !== 'undefined' && navigator.language) {
        const browserLang = navigator.language.split('-')[0];
        if (browserLang === 'fr') return 'fr';
        if (browserLang === 'es') return 'es';
      }
    } catch (e) {
      console.warn('Language detection failed, defaulting to English', e);
    }
    return 'en';
  });

  // UI/Mode state
  const [creationMode, setCreationMode] = useState<CreationMode>('transform');
  const [isArtistModalOpen, setIsArtistModalOpen] = useState<boolean>(false);


  // Shared state
  const [basePrompt, setBasePrompt] = useState<string>('');
  const [temperature, setTemperature] = useState<number>(1.0);

  // Creation-specific state
  const [useSearchGrounding, setUseSearchGrounding] = useState<boolean>(true);
  const [selectedTransformations, setSelectedTransformations] = useState<string[]>(['artistic_styles-photorealistic']);
  const [outputFormat, setOutputFormat] = useState<string>('format-16_9');
  const [customAspectRatio, setCustomAspectRatio] = useState<string>('');

  // Transform-specific state
  const [sourceImageFile, setSourceImageFile] = useState<File | null>(null);
  const [sourceImageUrl, setSourceImageUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  // Output state
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);

  // Lightbox state
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [selectedLightboxImageIndex, setSelectedLightboxImageIndex] = useState<number>(0);


  // API Key Check
  const [isApiKeyMissing, setIsApiKeyMissing] = useState(false);

  useEffect(() => {
    if (!process.env.API_KEY) {
      setIsApiKeyMissing(true);
    }
  }, []);

  const handleImageUpload = (file: File | null) => {
    setSourceImageFile(file);
    setGeneratedImage(null);
    setAnalysisResult(null);
    setGeneratedPrompt(null);
    setError(null);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSourceImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSourceImageUrl(null);
    }
  };

  const handleCreationModeChange = (mode: CreationMode) => {
    setCreationMode(mode);
    setGeneratedPrompt(null);
    setGeneratedImage(null);
    setAnalysisResult(null);
    setError(null);
    setBasePrompt('');
    if (mode === 'create') {
      handleImageUpload(null);
    }
  };

  const handleBasePromptChange = (prompt: string) => {
    setBasePrompt(prompt);
    setGeneratedPrompt(null);
  };

  const handleTransformationsChange = (keys: string[]) => {
    setSelectedTransformations(keys);
    setGeneratedPrompt(null);
  };

  const handleAnalyze = useCallback(async () => {
    if (!sourceImageFile) return;
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await geminiService.analyzeImage(sourceImageFile);
      setAnalysisResult(result);
    } catch (err) {
      setError(t('errorAnalysis', language));
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [sourceImageFile, language]);

  const handleSuggestionClick = (suggestion: string) => {
    setBasePrompt(suggestion);
    setGeneratedPrompt(null);
  };

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    // --- Iteration Flow ---
    // If a prompt already exists, the user is iterating. Use the existing prompt directly.
    if (generatedPrompt) {
      try {
        const imageUrl = await imageService.generateImage(generatedPrompt, outputFormat, customAspectRatio);
        setGeneratedImage(imageUrl);
        setGallery(prev => [imageUrl, ...prev]);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
      return; // End the function here for iteration
    }

    // --- Initial Generation Flow (if generatedPrompt is null) ---
    setAnalysisResult(null);

    // --- Transform Flow ---
    if (creationMode === 'transform') {
      if (!sourceImageFile) {
        setError(t('errorUpload', language));
        setIsLoading(false);
        return;
      }
      try {
        setGeneratedPrompt(t('analyzing', language));
        const analysis = await geminiService.analyzeImage(sourceImageFile);
        const sourceImageDescription = analysis.description;

        const rawInstructions = getRawInstructions({
          targetLanguage: language,
          transformations: selectedTransformations,
        });

        const combinedPromptForSynthesis = `Based on an image described as: "${sourceImageDescription}". Now, apply this modification: "${basePrompt}".`;

        setGeneratedPrompt(t('generating', language));
        const synthesizedPrompt = await geminiService.synthesizePrompt(combinedPromptForSynthesis, rawInstructions, language, temperature);
        setGeneratedPrompt(synthesizedPrompt);

        let finalPrompt = synthesizedPrompt;

        if (useSearchGrounding) {
          setGeneratedPrompt('Enriching prompt with Google Search...');
          const serviceConfig = {
            tools: [{ googleSearch: {} }],
            temperature: temperature
          };
          const response = await geminiService.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: synthesizedPrompt,
            config: serviceConfig,
          });
          finalPrompt = response.text;
          setGeneratedPrompt(finalPrompt);
        }

        const imageUrl = await imageService.generateImage(finalPrompt, outputFormat, customAspectRatio);
        setGeneratedImage(imageUrl);
        setGallery(prev => [imageUrl, ...prev]);

      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // --- Creation Flow ---
    if (creationMode === 'create') {
      try {
        const rawInstructions = getRawInstructions({
          targetLanguage: language,
          transformations: [...selectedTransformations, outputFormat],
        });

        setGeneratedPrompt(t('generating', language));

        const synthesizedPrompt = await geminiService.synthesizePrompt(basePrompt, rawInstructions, language, temperature);
        setGeneratedPrompt(synthesizedPrompt);

        let finalPrompt = synthesizedPrompt;

        if (useSearchGrounding) {
          setGeneratedPrompt('Enriching prompt with Google Search...');
          const serviceConfig = {
            tools: [{ googleSearch: {} }],
            temperature: temperature
          };
          const response = await geminiService.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: synthesizedPrompt,
            config: serviceConfig,
          });
          finalPrompt = response.text;
          setGeneratedPrompt(finalPrompt);
        }

        const imageUrl = await imageService.generateImage(finalPrompt, outputFormat, customAspectRatio);
        setGeneratedImage(imageUrl);
        setGallery(prev => [imageUrl, ...prev]);

      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  }, [creationMode, language, outputFormat, customAspectRatio, sourceImageFile, basePrompt, selectedTransformations, useSearchGrounding, generatedPrompt, temperature]);

  const handleOpenLightbox = (index: number) => {
    setSelectedLightboxImageIndex(index);
    setIsLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setIsLightboxOpen(false);
  };

  const handleSelectForTransformFromLightbox = async (imageUrl: string) => {
    const file = await dataUrlToFile(imageUrl, `transformed-image-${Date.now()}.png`);
    handleImageUpload(file);
    setCreationMode('transform');
    setBasePrompt('');
    handleCloseLightbox();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenArtistModal = () => setIsArtistModalOpen(true);
  const handleCloseArtistModal = () => setIsArtistModalOpen(false);
  const handleArtistSelect = (artistName: string) => {
    // Enforce single-selection for artistic styles by removing any existing style
    const otherTransformations = selectedTransformations.filter(
      t => !t.startsWith('artistic_styles-')
    );
    // Add the new famous artist style with the selected name
    const newArtistStyle = `artistic_styles-famous_artist_style:${artistName}`;
    setSelectedTransformations([...otherTransformations, newArtistStyle]);
    setGeneratedPrompt(null);
    handleCloseArtistModal();
  };

  if (isApiKeyMissing) {
    return (
      <div className="min-h-screen bg-brand-dark-blue text-gray-200 font-sans flex items-center justify-center p-4">
        <div className="bg-brand-mid-blue rounded-lg p-8 border border-red-500/50 max-w-lg text-center shadow-2xl">
          <h1 className="text-2xl font-bold text-red-400 mb-4">{t('configError', language)}</h1>
          <p className="text-gray-300">
            <code>{t('apiKeyMissing', language)}</code>
          </p>
          <p className="text-gray-400 mt-2 text-sm">
            {t('apiKeyInstructions', language)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark-blue text-gray-200 font-sans">
      <Header language={language} setLanguage={setLanguage} />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <ControlPanel
            language={language}
            creationMode={creationMode}
            setCreationMode={handleCreationModeChange}
            basePrompt={basePrompt}
            setBasePrompt={handleBasePromptChange}
            sourceImageUrl={sourceImageUrl}
            handleImageUpload={handleImageUpload}
            selectedTransformations={selectedTransformations}
            setSelectedTransformations={handleTransformationsChange}
            outputFormat={outputFormat}
            setOutputFormat={setOutputFormat}
            customAspectRatio={customAspectRatio}
            setCustomAspectRatio={setCustomAspectRatio}
            isLoading={isLoading}
            onGenerate={handleGenerate}
            useSearchGrounding={useSearchGrounding}
            setUseSearchGrounding={setUseSearchGrounding}
            temperature={temperature}
            setTemperature={setTemperature}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
            onOpenArtistModal={handleOpenArtistModal}
          />
          <OutputDisplay
            language={language}
            generatedPrompt={generatedPrompt}
            onPromptChange={setGeneratedPrompt}
            generatedImage={generatedImage}
            isLoading={isLoading}
            error={error}
            analysisResult={analysisResult}
            isAnalyzing={isAnalyzing}
            onSuggestionClick={handleSuggestionClick}
            onImageClick={() => {
              if (generatedImage) {
                const index = gallery.indexOf(generatedImage);
                if (index !== -1) {
                  handleOpenLightbox(index);
                }
              }
            }}
            onRegenerate={handleGenerate}
          />
        </div>

        <Gallery
          language={language}
          images={gallery}
          currentImage={generatedImage}
          onImageSelect={handleOpenLightbox}
        />

        <Lightbox
          language={language}
          isOpen={isLightboxOpen}
          images={gallery}
          startIndex={selectedLightboxImageIndex}
          onClose={handleCloseLightbox}
          onSelectForTransform={handleSelectForTransformFromLightbox}
        />

        <ArtistSelectionModal
          isOpen={isArtistModalOpen}
          onClose={handleCloseArtistModal}
          onSelect={handleArtistSelect}
          language={language}
        />

      </main>
    </div>
  );
};

export default App;
