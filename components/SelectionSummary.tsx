
import React from 'react';
import { TRANSFORMATIONS_DB, ARTISTS } from '../constants';
import type { Language } from '../types';
import { t } from '../localization';

interface SelectionSummaryProps {
  language: Language;
  selectedTransformations: string[];
  outputFormat: string;
}

export const SelectionSummary: React.FC<SelectionSummaryProps> = ({
  language,
  selectedTransformations,
  outputFormat,
}) => {
  const allSelections = [...selectedTransformations, outputFormat];
  
  // Use a map to preserve category order from the DB
  const categoryOrder = Object.keys(TRANSFORMATIONS_DB);
  const groupedSummary = new Map<string, string[]>();

  allSelections.forEach(selectionKey => {
    if (!selectionKey) return;
    
    let baseKey = selectionKey;
    let customValue = null;

    if (selectionKey.includes(':')) {
        const parts = selectionKey.split(':', 2);
        baseKey = parts[0];
        customValue = parts[1];
    }
    
    const [categoryKey] = baseKey.split('-');
    const categoryData = TRANSFORMATIONS_DB[categoryKey];

    if (categoryData) {
      const transformation = categoryData.transformations.find(t => t.valueKey === baseKey);
      if (transformation) {
        const categoryName = (categoryData as any)[`category_${language}`] || categoryData.category_en;
        let label = (transformation as any)[`label_${language}`] || transformation.label_en;

        if (customValue) {
            if (baseKey === 'artistic_styles-famous_artist_style') {
                const artist = ARTISTS.find(a => a.name === customValue);
                let styleSuffix = "";
                if (artist) {
                    styleSuffix = ` (${(artist as any)[`style_${language}`] || artist.style_en})`;
                }
                label = `${t('inStyleOf', language)} ${customValue}${styleSuffix}`;
            } else {
                label = customValue;
            }
        }

        if (!groupedSummary.has(categoryName)) {
            groupedSummary.set(categoryName, []);
        }
        groupedSummary.get(categoryName)?.push(label);
      }
    }
  });

  if (groupedSummary.size === 0) {
    return null;
  }
  
  // Sort the map entries according to the original DB order
  const sortedGroupedSummary = new Map([...groupedSummary.entries()].sort(([a], [b]) => {
    const aCat = Object.values(TRANSFORMATIONS_DB).find(cat => ((cat as any)[`category_${language}`] || cat.category_en) === a);
    const bCat = Object.values(TRANSFORMATIONS_DB).find(cat => ((cat as any)[`category_${language}`] || cat.category_en) === b);
    
    const aFullName = aCat ? aCat.category_en : '';
    const bFullName = bCat ? bCat.category_en : '';
    
    const aIndex = categoryOrder.findIndex(key => TRANSFORMATIONS_DB[key]?.category_en === aFullName);
    const bIndex = categoryOrder.findIndex(key => TRANSFORMATIONS_DB[key]?.category_en === bFullName);

    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
  }));


  return (
    <div className="bg-brand-dark-blue/50 p-3 rounded-md border border-brand-light-blue/30 text-xs text-gray-400">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">{t('selectionSummaryTitle', language)}</h3>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {Array.from(sortedGroupedSummary.entries()).map(([category, labels]) => (
          <div key={category}>
            <span className="font-semibold text-gray-300">{category.split(' / ')[0]}:</span> {labels.join(', ')}
          </div>
        ))}
      </div>
    </div>
  );
};
