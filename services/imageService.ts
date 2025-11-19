


import { GoogleGenAI, Modality, GenerateContentResponse } from '@google/genai';
import { fileToBase64 } from "../utils/imageUtils";

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

  async generateImage(prompt: string, outputFormat: string): Promise<string> {
    console.log("Image Service: Generating image from text prompt with Imagen 4.");
    
    const aspectRatio = outputFormat.replace('format-', '').replace('_', ':');

    try {
        const response = await this.ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
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

  async editImage(sourceImageFile: File, prompt: string): Promise<string> {
    console.log("Image Service: Editing Image with Gemini 2.5 Flash Image");
    const { data: base64ImageData, mimeType } = await fileToBase64(sourceImageFile);

    const response: GenerateContentResponse = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
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