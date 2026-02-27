


import { GoogleGenAI, Modality, GenerateContentResponse } from '@google/genai';
import { fileToBase64 } from "../utils/imageUtils";

const NANO_BANANA_2_MODEL = 'gemini-3.1-flash-image-preview';
const IMAGEN_MODEL = 'imagen-4.0-generate-001';

class ImageService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  private _processImageResponse(response: GenerateContentResponse, action: 'generation' | 'editing'): string {
    // Check for prompt blocking which results in no candidates
    if (!response.candidates || response.candidates.length === 0) {
      let errorMessage = `Image ${action} failed: The model returned no content.`;
      if (response.promptFeedback?.blockReason) {
        errorMessage += ` This might be due to the prompt being blocked for safety reasons (Reason: ${response.promptFeedback.blockReason}).`;
      }
      throw new Error(errorMessage);
    }

    const candidate = response.candidates[0];
    const parts = candidate.content?.parts;

    // Find and return the image data
    if (parts) {
      for (const part of parts) {
        if (part.inlineData) {
          const base64ImageBytes: string = part.inlineData.data;
          return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
        }
      }
    }

    // If no image data, check why generation finished
    if (candidate.finishReason && candidate.finishReason !== 'STOP') {
      throw new Error(`Image ${action} failed. The model stopped generating for the following reason: ${candidate.finishReason}.`);
    }

    // Fallback error
    throw new Error(`Image ${action} failed: No image data was found in the model's response.`);
  }

  /**
   * Generates an image from a text prompt.
   * - Standard aspect ratios → Imagen 4 (faster, higher quality)
   * - Free/custom format → Nano Banana 2 (gemini-3.1-flash-image-preview) which supports custom ratios
   */
  async generateImage(prompt: string, outputFormat: string, customAspectRatio?: string): Promise<string> {
    const isCustomFormat = outputFormat === 'format-libre';

    if (isCustomFormat) {
      // Route to Nano Banana 2 for free/custom aspect ratio
      console.log(`Image Service: Generating image with Nano Banana 2 (${NANO_BANANA_2_MODEL}) - Free/Custom format.`);
      const aspectHint = customAspectRatio ? ` The image should have an aspect ratio of approximately ${customAspectRatio}.` : '';
      try {
        const response: GenerateContentResponse = await this.ai.models.generateContent({
          model: NANO_BANANA_2_MODEL,
          contents: { parts: [{ text: `${prompt}${aspectHint}` }] },
          config: {
            responseModalities: [Modality.IMAGE],
          },
        });
        return this._processImageResponse(response, 'generation');
      } catch (err) {
        console.error("Error during free-format generation with Nano Banana 2:", err);
        const message = err instanceof Error ? err.message : String(err);
        throw new Error(`Image generation failed. ${message}`);
      }
    }

    // Standard format → Imagen 4
    console.log(`Image Service: Generating image with Imagen 4 (${IMAGEN_MODEL}).`);
    const aspectRatio = outputFormat.replace('format-', '').replace('_', ':');

    try {
      const response = await this.ai.models.generateImages({
        model: IMAGEN_MODEL,
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: aspectRatio as any,
        },
      });

      if (!response.generatedImages || response.generatedImages.length === 0) {
        throw new Error('Image generation failed: The model returned no content. This could be due to a safety policy violation.');
      }

      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    } catch (err) {
      console.error("Error during image generation:", err);
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`Image generation failed. ${message}`);
    }
  }

  /**
   * Edits an existing image using Nano Banana 2 (gemini-3.1-flash-image-preview).
   * Optimized for speed, high volume, and real-time web search integration.
   */
  async editImage(sourceImageFile: File, prompt: string): Promise<string> {
    console.log(`Image Service: Editing image with Nano Banana 2 (${NANO_BANANA_2_MODEL}).`);
    const { data: base64ImageData, mimeType } = await fileToBase64(sourceImageFile);

    const response: GenerateContentResponse = await this.ai.models.generateContent({
      model: NANO_BANANA_2_MODEL,
      contents: {
        parts: [
          { inlineData: { data: base64ImageData, mimeType } },
          { text: prompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    return this._processImageResponse(response, 'editing');
  }
}

export const imageService = new ImageService();