
export type Language = 'en' | 'fr' | 'es';
export type CreationMode = 'transform' | 'create';

export interface Artist {
  name: string;
  style_fr: string;
  style_en: string;
  style_es: string;
}

export interface Transformation {
  categoryKey: string;
  valueKey: string;
  label_fr: string;
  label_es: string;
  label_en: string;
  instruction_fr: string;
  instruction_es: string;
  instruction_en: string;
}

export interface TransformationCategory {
    category_fr: string;
    category_es: string;
    category_en: string;
    description_fr: string;
    description_es: string;
    description_en: string;
    transformations: Transformation[];
}


export interface TransformationDB {
  [categoryKey: string]: TransformationCategory;
}

export interface RawInstructionsRequest {
  targetLanguage: Language;
  transformations: string[];
}

export interface AnalysisResult {
    description: string;
    suggestions: string[];
}
