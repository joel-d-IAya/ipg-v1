
import type { Language } from './types';

const translations = {
  // API Key Error
  configError: {
    fr: 'Erreur de Configuration',
    en: 'Configuration Error',
    es: 'Error de Configuración',
  },
  apiKeyMissing: {
    fr: "La variable d'environnement API_KEY n'est pas définie.",
    en: 'The API_KEY environment variable is not set.',
    es: 'La variable de entorno API_KEY no está configurada.',
  },
  apiKeyInstructions: {
    fr: "Veuillez vous assurer qu'elle est configurée dans votre environnement pour utiliser cette application. Vous devrez peut-être redémarrer votre serveur de développement après l'avoir définie.",
    en: 'Please ensure it is configured in your environment to use this application. You may need to restart your development server after setting it.',
    es: 'Por favor, asegúrese de que esté configurada en su entorno para usar esta aplicación. Es posible que deba reiniciar su servidor de desarrollo después de configurarla.',
  },
  // ControlPanel
  transformMyImage: {
    fr: 'TRANSFORMER MON IMAGE',
    en: 'TRANSFORM MY IMAGE',
    es: 'TRANSFORMAR MI IMAGEN',
  },
  createAnImage: {
    fr: 'CRÉER UNE IMAGE',
    en: 'CREATE AN IMAGE',
    es: 'CREAR UNA IMAGEN',
  },
  transformMyImageAction: {
    fr: 'Transformer Mon Image',
    en: 'Transform My Image',
    es: 'Transformar Mi Imagen',
  },
  createAnImageAction: {
    fr: 'Créer une Image',
    en: 'Create An Image',
    es: 'Crear una Imagen',
  },
  editingInstructions: {
    fr: 'Instructions de modification',
    en: 'Editing Instructions',
    es: 'Instrucciones de Edición',
  },
  basePrompt: {
    fr: 'Décrivez votre image',
    en: 'Describe your image',
    es: 'Describe tu imagen',
  },
  editingPlaceholder: {
    fr: "Ex: Ajouter un filtre rétro, mettre en noir et blanc...",
    en: 'e.g., Add a retro filter, make it black and white...',
    es: 'Ej: Añadir un filtro retro, poner en blanco y negro...',
  },
  basePromptPlaceholder: {
    fr: "Ex: Un chaton mignon jouant avec une pelote de laine, ou une voiture de sport rouge filant sur une route de montagne",
    en: 'e.g., A cute kitten playing with a ball of yarn, or a red sports car speeding down a mountain road',
    es: 'Ej: Un lindo gatito jugando con un ovillo de lana, o un coche deportivo rojo a toda velocidad por una carretera de montaña',
  },
  aspectRatio: {
    fr: 'Ratio de l\'image',
    en: 'Aspect Ratio',
    es: 'Relación de Aspecto',
  },
  useSearch: {
    fr: 'Utiliser Google Search pour plus de précision',
    en: 'Use Google Search for accuracy',
    es: 'Usar Google Search para mayor precisión',
  },
  temperature: {
    fr: 'Température',
    en: 'Temperature',
    es: 'Temperatura',
  },
  temperatureTooltip: {
    fr: 'Contrôle le caractère aléatoire. Des valeurs plus basses favorisent des réponses plus probables et moins surprenantes. Des valeurs plus élevées encouragent des résultats plus créatifs et inattendus.',
    en: 'Controls randomness. Lower values favor more likely and less surprising responses. Higher values encourage more creative and unexpected results.',
    es: 'Controla la aleatoriedad. Los valores más bajos favorecen respuestas más probables y menos sorprendentes. Los valores más altos fomentan resultados más creativos e inesperados.',
  },
  generating: {
    fr: 'Génération...',
    en: 'Generating...',
    es: 'Generando...',
  },
  // Artist Modal
  selectArtistTitle: {
    fr: "Sélectionner un Artiste",
    en: "Select an Artist",
    es: "Seleccionar un Artista",
  },
  selectArtistAction: {
    fr: "Sélectionner l'Artiste",
    en: "Select the Artist",
    es: "Seleccionar el Artista",
  },
  otherArtist: {
    fr: "Autre...",
    en: "Other...",
    es: "Otro...",
  },
  otherArtistPlaceholder: {
    fr: "Nom de l'artiste",
    en: "Artist's Name",
    es: "Nombre del Artista",
  },
  inStyleOf: {
    fr: "Dans le style de",
    en: "In the style of",
    es: "Al estilo de",
  },
  // OutputDisplay
  imageAnalysis: {
    fr: "Analyse de l'image",
    en: 'Image Analysis',
    es: 'Análisis de la Imagen',
  },
  copyDescription: {
    fr: 'Copier la description',
    en: 'Copy Description',
    es: 'Copiar Descripción',
  },
  suggestedEdits: {
    fr: 'Modifications suggérées :',
    en: 'Suggested Edits:',
    es: 'Ediciones Sugeridas:',
  },
  generatedPrompt: {
    fr: 'Prompt Généré',
    en: 'Generated Prompt',
    es: 'Prompt Generado',
  },
  copyPrompt: {
    fr: 'Copier le prompt',
    en: 'Copy Prompt',
    es: 'Copiar Prompt',
  },
  modifyPrompt: {
    fr: 'Modifier le prompt généré',
    en: 'Modify The Generated Prompt',
    es: 'Modificar el Prompt Generado',
  },
  generateNewImage: {
    fr: 'Générer une nouvelle image',
    en: 'Generate A New Image',
    es: 'Generar una Nueva Imagen',
  },
  generatedImage: {
    fr: 'Image Générée',
    en: 'Generated Image',
    es: 'Imagen Generada',
  },
  analyzing: {
    fr: 'Analyse de votre image...',
    en: 'Analyzing your image...',
    es: 'Analizando tu imagen...',
  },
  crafting: {
    fr: 'Création de votre vision...',
    en: 'Crafting your vision...',
    es: 'Creando tu visión...',
  },
  downloadImage: {
    fr: "Télécharger l'image",
    en: 'Download Image',
    es: 'Descargar Imagen',
  },
  outputPlaceholder: {
    fr: 'Votre image apparaîtra ici',
    en: 'Your image will appear here',
    es: 'Tu imagen aparecerá aquí',
  },
  // ImageUploader
  sourceImage: {
    fr: 'Image Source',
    en: 'Source Image',
    es: 'Imagen de Origen',
  },
  analyzeImage: {
    fr: "Analyser l'image",
    en: 'Analyze Image',
    es: 'Analizar Imagen',
  },
  remove: {
    fr: 'Supprimer',
    en: 'Remove',
    es: 'Eliminar',
  },
  uploadPrompt: {
    fr: 'Cliquez pour télécharger une image',
    en: 'Click to upload an image',
    es: 'Haz clic para subir una imagen',
  },
  uploadSubPrompt: {
    fr: "pour activer l'analyse et la modification",
    en: 'to enable analysis & editing',
    es: 'para habilitar el análisis y la edición',
  },
  // Gallery
  sessionGallery: {
    fr: 'Galerie de la session',
    en: 'Session Gallery',
    es: 'Galería de la Sesión',
  },
  // SelectionSummary
  selectionSummaryTitle: {
    fr: 'Vos options sélectionnées',
    en: 'Your Selected Options',
    es: 'Sus Opciones Seleccionadas',
  },
  // Lightbox
  useThisImage: {
    fr: 'Utiliser cette image',
    en: 'Use this Image',
    es: 'Usar esta Imagen',
  },
  download: {
      fr: 'Télécharger',
      en: 'Download',
      es: 'Descargar',
  },
  next: {
      fr: 'Suivant',
      en: 'Next',
      es: 'Siguiente',
  },
  previous: {
      fr: 'Précédent',
      en: 'Previous',
      es: 'Anterior',
  },
  close: {
      fr: 'Fermer',
      en: 'Close',
      es: 'Cerrar',
  },
  // Errors
  generationFailed: {
    fr: 'La génération a échoué',
    en: 'Generation Failed',
    es: 'La Generación Falló',
  },
  errorAnalysis: {
    fr: "Une erreur s'est produite lors de l'analyse. Veuillez réessayer.",
    en: 'An error occurred during analysis. Please try again.',
    es: 'Ocurrió un error during el análisis. Por favor, inténtalo de nuevo.',
  },
  errorTransform: {
    fr: "Une erreur s'est produite lors de la transformation de l'image. Veuillez réessayer.",
    en: 'An error occurred during image transformation. Please try again.',
    es: 'Ocurrió un error durante la transformación de la imagen. Por favor, inténtalo de nuevo.',
  },
  errorCreate: {
    fr: "Une erreur s'est produite lors de la génération. Veuillez réessayer.",
    en: 'An error occurred during generation. Please try again.',
    es: 'Ocurrió un error durante la generación. Por favor, inténtalo de nuevo.',
  },
  errorUpload: {
    fr: "Veuillez télécharger une image à transformer.",
    en: 'Please upload an image to transform.',
    es: 'Por favor, sube una imagen para transformar.',
  },
};

type TranslationKey = keyof typeof translations;

export const t = (key: TranslationKey, lang: Language): string => {
  if (!translations[key]) {
    console.warn(`Translation key "${key}" not found.`);
    return key;
  }
  return translations[key][lang];
};
