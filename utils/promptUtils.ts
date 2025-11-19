
import { TRANSFORMATIONS_DB, ARTISTS } from '../constants';
import type { RawInstructionsRequest } from '../types';

export const getRawInstructions = (request: RawInstructionsRequest): string => {
    const { targetLanguage, transformations } = request;

    const selectedInstructions: string[] = [];

    transformations.forEach(key => {
        let baseKey = key;
        let customValue = null;

        if (key.includes(':')) {
            const parts = key.split(':', 2);
            baseKey = parts[0];
            customValue = parts[1];
        }

        const [categoryKey] = baseKey.split('-');
        const category = TRANSFORMATIONS_DB[categoryKey];
        if (category) {
            const transformation = category.transformations.find(t => t.valueKey === baseKey);
            if (transformation) {
                let instruction = (transformation as any)[`instruction_${targetLanguage}`];
                if (customValue) {
                    if (baseKey === 'artistic_styles-famous_artist_style') {
                        const artist = ARTISTS.find(a => a.name === customValue);
                        let styleContext = "";
                        if (artist) {
                            styleContext = ` (${(artist as any)[`style_${targetLanguage}`]})`;
                        }
                        instruction = instruction.replace('{artistName}', customValue + styleContext);
                    } else {
                        instruction = instruction.replace('{artistName}', customValue);
                    }
                }
                selectedInstructions.push(instruction);
            }
        }
    });

    return selectedInstructions.join('. ').trim();
};
