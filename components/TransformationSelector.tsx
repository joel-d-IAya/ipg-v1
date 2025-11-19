
import React, { useState } from 'react';
import { TRANSFORMATIONS_DB } from '../constants';
import type { Language } from '../types';

interface TransformationSelectorProps {
    selectedTransformations: string[];
    setSelectedTransformations: (keys: string[]) => void;
    outputFormat: string;
    setOutputFormat: (format: string) => void;
    language: Language;
    onOpenArtistModal: () => void;
}

interface AccordionItemProps {
    title: string;
    description: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, description, isOpen, onToggle, children }) => {
    return (
        <div className="border-b border-brand-light-blue/50">
            <button
                onClick={onToggle}
                className="w-full text-left py-4 px-2 flex justify-between items-center hover:bg-brand-light-blue/20 transition-colors"
            >
                <div>
                    <h4 className="font-semibold text-brand-cyan">{title}</h4>
                    <p className="text-sm text-gray-400 font-light">{description}</p>
                </div>
                <svg
                    className={`w-5 h-5 text-gray-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && (
                <div className="p-4 bg-black/10">
                    {children}
                </div>
            )}
        </div>
    );
};

// Define camera angle sub-types for special selection logic
const CAMERA_ANGLE_PERSPECTIVES = new Set([
    'camera_angle-eye_level', 'camera_angle-high_angle', 'camera_angle-low_angle', 
    'camera_angle-top_down_shot', 'camera_angle-aerial_view'
]);
const CAMERA_ANGLE_ORIENTATIONS = new Set([
    'camera_angle-frontal_view', 'camera_angle-three_quarter_profile', 
    'camera_angle-profile_shot', 'camera_angle-rear_view'
]);


export const TransformationSelector: React.FC<TransformationSelectorProps> = ({
    selectedTransformations,
    setSelectedTransformations,
    outputFormat,
    setOutputFormat,
    language,
    onOpenArtistModal
}) => {
    const [openCategory, setOpenCategory] = useState<string>('framing');

    const handleToggleCategory = (categoryKey: string) => {
        setOpenCategory(prev => (prev === categoryKey ? '' : categoryKey));
    };
    
    const handleToggleTransformation = (key: string) => {
        const [categoryKey] = key.split('-');

        // If the clicked item is already selected, just deselect it.
        if (selectedTransformations.includes(key)) {
            setSelectedTransformations(selectedTransformations.filter(t => t !== key));
            return;
        }

        // --- Handle adding a new selection ---

        // Special logic for "Camera Angle"
        if (categoryKey === 'camera_angle') {
            const isPerspective = CAMERA_ANGLE_PERSPECTIVES.has(key);
            const isOrientation = CAMERA_ANGLE_ORIENTATIONS.has(key);

            // Filter out existing selections of the same sub-type (perspective or orientation)
            let newSelection = selectedTransformations.filter(t => {
                const [cat] = t.split('-');
                if (cat !== 'camera_angle') return true; // keep other categories
                if (isPerspective && CAMERA_ANGLE_PERSPECTIVES.has(t)) return false; // remove old perspective
                if (isOrientation && CAMERA_ANGLE_ORIENTATIONS.has(t)) return false; // remove old orientation
                return true;
            });

            // Add the new key
            newSelection.push(key);
            setSelectedTransformations(newSelection);
            return;
        }

        // Default logic for all other single-select categories
        const newSelection = selectedTransformations.filter(t => {
            const [cat] = t.split('-');
            return cat !== categoryKey; // Remove any existing selection in the same category
        });

        newSelection.push(key); // Add the new selection
        setSelectedTransformations(newSelection);
    };

    const transformationCategories = Object.entries(TRANSFORMATIONS_DB);

    return (
        <div className="space-y-0 bg-brand-mid-blue rounded-lg border border-brand-light-blue/50 overflow-hidden">
            {transformationCategories.map(([categoryKey, categoryData]) => {
                if (!categoryData) return null;
                
                // Safe access to dynamic properties
                const title = (categoryData as any)[`category_${language}`] || categoryData.category_en;
                const description = (categoryData as any)[`description_${language}`] || categoryData.description_en;

                return (
                    <AccordionItem
                        key={categoryKey}
                        title={title}
                        description={description}
                        isOpen={openCategory === categoryKey}
                        onToggle={() => handleToggleCategory(categoryKey)}
                    >
                        <div className="flex flex-wrap gap-2">
                            {categoryData.transformations && categoryData.transformations.map(t => {
                                const isFormatCategory = categoryKey === 'format';
                                const isFamousArtistStyle = t.valueKey === 'artistic_styles-famous_artist_style';

                                const isSelected = isFormatCategory 
                                    ? outputFormat === t.valueKey 
                                    : isFamousArtistStyle
                                        ? selectedTransformations.some(s => s.startsWith(t.valueKey))
                                        : selectedTransformations.includes(t.valueKey);
                                
                                const handleClick = () => {
                                    if (isFamousArtistStyle) {
                                        onOpenArtistModal();
                                    } else if (isFormatCategory) {
                                        setOutputFormat(t.valueKey);
                                    } else {
                                        handleToggleTransformation(t.valueKey);
                                    }
                                };
                                
                                const label = (t as any)[`label_${language}`] || t.label_en;

                                return (
                                    <button
                                        key={t.valueKey}
                                        onClick={handleClick}
                                        className={`px-3 py-1.5 text-sm rounded-md transition-all duration-200 border ${
                                            isSelected 
                                            ? 'bg-brand-cyan border-brand-cyan text-brand-dark-blue font-semibold' 
                                            : 'bg-brand-light-blue border-brand-light-blue hover:border-brand-cyan/70 text-gray-200'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    </AccordionItem>
                );
            })}
        </div>
    );
};
