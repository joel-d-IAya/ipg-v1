
import { GoogleGenAI, Modality, GenerateContentResponse } from '@google/genai';
import { fileToBase64 } from "../utils/imageUtils";

/**
 * Nano Banana 2 — gemini-3.1-flash-image-preview
 * Used for ALL image generation and editing tasks.
 * Supports every aspect ratio (including custom), faster and better quality/price than Imagen 4.
 */
const NANO_BANANA_2_MODEL = 'gemini-3.1-flash-image-preview';

class ImageService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  private _processImageResponse(response: GenerateContentResponse, action: 'generation' | 'editing'): string {
    if (!response.candidates || response.candidates.length === 0) {
      let errorMessage = `Image ${action} failed: The model returned no content.`;
      if (response.promptFeedback?.blockReason) {
        errorMessage += ` Blocked for safety reasons (${response.promptFeedback.blockReason}).`;
      }
      throw new Error(errorMessage);
    }

    const candidate = response.candidates[0];
    const parts = candidate.content?.parts;

    if (parts) {
      for (const part of parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }

    if (candidate.finishReason && candidate.finishReason !== 'STOP') {
      throw new Error(`Image ${action} failed. Model stopped: ${candidate.finishReason}.`);
    }

    throw new Error(`Image ${action} failed: No image data found in the model's response.`);
  }

  /**
   * Generates an image using Nano Banana 2.
   * Supports all aspect ratios natively — ratio is passed as a prompt hint.
   * @param outputFormat - format key (e.g. "format-16_9", "format-libre")
   * @param customAspectRatio - used only when outputFormat is "format-libre"
   */
  async generateImage(prompt: string, outputFormat: string, customAspectRatio?: string): Promise<string> {
    const isLibre = outputFormat === 'format-libre';
    const isAuto = outputFormat === 'format-auto';

    let aspectHint = '';
    if (isLibre) {
      aspectHint = customAspectRatio
        ? ` The image should have an aspect ratio of approximately ${customAspectRatio}.`
        : '';
    } else if (!isAuto) {
      // Convert format key to ratio string: "format-16_9" → "16:9"
      const ratio = outputFormat.replace('format-', '').replace('_', ':');
      aspectHint = ` The image should have an aspect ratio of ${ratio}.`;
    }

    console.log(`Image Service [NB2]: Generating${aspectHint ? ` — ${aspectHint.trim()}` : ' — auto ratio'}`);

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
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`Image generation failed. ${message}`);
    }
  }

  /**
   * Edits an existing image using Nano Banana 2.
   * The model receives the actual image pixels as inlineData and applies targeted modifications.
   * The prompt is structured to preserve the original subject and only change what's requested.
   *
   * @param userInstruction - What the user wants to change (e.g. "change the background to a beach")
   * @param transformationContext - Optional stylistic instructions from selected transformations
   */
  async editImage(sourceImageFile: File, userInstruction: string, transformationContext?: string): Promise<string> {
    console.log(`Image Service [NB2]: Editing image — "${userInstruction}"`);
    const { data: base64ImageData, mimeType } = await fileToBase64(sourceImageFile);

    // Build an explicit editing prompt that tells the model to preserve the subject
    const editingPrompt = [
      `You are an expert image editor. You MUST edit the provided image directly.`,
      `IMPORTANT RULES:`,
      `1. Keep the main subject(s) EXACTLY as they appear in the original image — same person, same pose, same face, same clothing.`,
      `2. Only modify what is explicitly requested.`,
      `3. Do NOT recreate or reimagine the subject. This is an EDIT, not a new generation.`,
      ``,
      `EDIT INSTRUCTION: ${userInstruction}`,
      transformationContext ? `STYLE NOTES: ${transformationContext}` : '',
    ].filter(Boolean).join('\n');

    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: NANO_BANANA_2_MODEL,
        contents: {
          parts: [
            { inlineData: { data: base64ImageData, mimeType } },
            { text: editingPrompt },
          ],
        },
        config: {
          responseModalities: [Modality.IMAGE],
        },
      });
      return this._processImageResponse(response, 'editing');
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`Image editing failed. ${message}`);
    }
  }
}

export const imageService = new ImageService();