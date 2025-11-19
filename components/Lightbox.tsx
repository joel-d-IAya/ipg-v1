
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { CloseIcon } from './icons/CloseIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { ImageIcon } from './icons/ImageIcon';
import { t } from '../localization';
import type { Language } from '../types';

interface LightboxProps {
  language: Language;
  isOpen: boolean;
  images: string[];
  startIndex: number;
  onClose: () => void;
  onSelectForTransform: (imageUrl: string) => void;
}

const MIN_SCALE = 0.5;
const MAX_SCALE = 8;

export const Lightbox: React.FC<LightboxProps> = ({
  language,
  isOpen,
  images,
  startIndex,
  onClose,
  onSelectForTransform,
}) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const imageContainerRef = useRef<HTMLDivElement>(null);

  const resetZoomAndPan = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setIsPanning(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(startIndex);
      resetZoomAndPan();
    }
  }, [isOpen, startIndex, resetZoomAndPan]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex(prevIndex => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    resetZoomAndPan();
  }, [images.length, resetZoomAndPan]);

  const goToNext = useCallback(() => {
    setCurrentIndex(prevIndex => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    resetZoomAndPan();
  }, [images.length, resetZoomAndPan]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, goToPrevious, goToNext, onClose]);

  const handleDownload = () => {
    const imageUrl = images[currentIndex];
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `promptgenius-image-${currentIndex + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleSelect = () => {
    const imageUrl = images[currentIndex];
    if (imageUrl) {
        onSelectForTransform(imageUrl);
    }
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const scaleAmount = -e.deltaY * 0.001;
    const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale * (1 + scaleAmount)));
    
    if (imageContainerRef.current) {
        const rect = imageContainerRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const newX = mouseX - (mouseX - position.x) * (newScale / scale);
        const newY = mouseY - (mouseY - position.y) * (newScale / scale);
        
        setPosition({ x: newX, y: newY });
    }
    setScale(newScale);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    e.preventDefault();
    setIsPanning(true);
    setPanStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    e.preventDefault();
    setPosition({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
  };

  const handleMouseUpOrLeave = () => {
    setIsPanning(false);
  };


  if (!isOpen || images.length === 0) {
    return null;
  }

  const cursorClass = scale > 1 ? (isPanning ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default';


  return (
    <div
      className="fixed inset-0 bg-brand-dark-blue/90 backdrop-blur-sm flex flex-col items-center justify-center z-50 transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full h-full p-4 md:p-8 lg:p-16 flex flex-col items-center justify-center" onClick={e => e.stopPropagation()}>
        
        {/* Main Image Display */}
        <div 
            ref={imageContainerRef}
            className="relative w-full h-full flex items-center justify-center overflow-hidden"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onDoubleClick={resetZoomAndPan}
        >
            <img
                src={images[currentIndex]}
                alt={`Generated image ${currentIndex + 1}`}
                className={`max-w-none max-h-none object-contain transition-transform duration-100 ease-out ${cursorClass}`}
                style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    maxWidth: '100%',
                    maxHeight: '100%'
                }}
            />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white bg-black/30 rounded-full hover:bg-black/60 transition-colors"
          aria-label={t('close', language)}
        >
          <CloseIcon className="w-6 h-6" />
        </button>

        {/* Previous Button */}
        {images.length > 1 && (
            <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white bg-black/30 rounded-full hover:bg-black/60 transition-colors"
            aria-label={t('previous', language)}
            >
                <ChevronLeftIcon className="w-8 h-8" />
            </button>
        )}

        {/* Next Button */}
        {images.length > 1 && (
            <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white bg-black/30 rounded-full hover:bg-black/60 transition-colors"
            aria-label={t('next', language)}
            >
                <ChevronRightIcon className="w-8 h-8" />
            </button>
        )}

        {/* Controls */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 p-2 bg-black/40 rounded-lg flex items-center gap-4">
            <button onClick={handleSelect} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-brand-dark-blue bg-brand-cyan rounded-md hover:bg-brand-cyan/90 transition-colors">
                <ImageIcon className="w-5 h-5" />
                {t('useThisImage', language)}
            </button>
            <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand-light-blue rounded-md hover:bg-brand-light-blue/80 transition-colors">
                <DownloadIcon className="w-5 h-5" />
                {t('download', language)}
            </button>
        </div>

        {/* Counter */}
        {images.length > 1 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/40 rounded-full text-sm text-white">
                {currentIndex + 1} / {images.length}
            </div>
        )}

      </div>
    </div>
  );
};
