

import { GoogleGenAI, GenerateContentResponse, Type } from '@google/genai';
import { fileToBase64 } from '../utils/imageUtils';
import type { Language, AnalysisResult } from '../types';

class ModelsWrapper {
  private ai: GoogleGenAI;
  constructor(aiInstance: GoogleGenAI) {
      this.ai = aiInstance;
  }
  async generateContent(request: any): Promise<GenerateContentResponse> {
    console.log("Gemini Service: Calling generateContent with request:", request);
    return await this.ai.models.generateContent(request);
  }
}

class GeminiService {
  models: ModelsWrapper;
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    this.models = new ModelsWrapper(this.ai);
  }

  async synthesizePrompt(basePrompt: string, rawInstructions: string, language: Language, temperature: number): Promise<string> {
    const systemInstruction = `You are "PromptGenius", an expert at writing prompts for image generation models. Your task is to combine a user's base idea and a list of stylistic instructions into a single, highly descriptive paragraph that will be used as a prompt to generate an image.

Rules:
- The final prompt must be in ${language}.
- The prompt must vividly describe the final image.
- Do NOT write instructions for an artist. Write a description of a picture.
- Do NOT use phrases like "The image should be..." or "Create a photo of...".
- Start the description directly, without any preamble like "Here is the prompt:".
- Creatively fuse the base idea and the stylistic instructions into a natural-sounding description.`;

    const userPrompt = `Base Idea: "${basePrompt}"\n\nStylistic Instructions:\n- ${rawInstructions.split('. ').join('\n- ')}\n\nSynthesize these into a single descriptive paragraph suitable for an image generation model.`;

    const response = await this.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userPrompt,
        config: { 
            systemInstruction,
            temperature: temperature 
        }
    });

    return response.text.trim();
  }

  async analyzeImage(imageFile: File): Promise<AnalysisResult> {
    const { data, mimeType } = await fileToBase64(imageFile);
    const prompt = `Analyze this image in detail. Describe its subject, style, lighting, and composition. Also provide exactly three creative and distinct suggestions for how to artistically edit it.`;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        description: {
          type: Type.STRING,
          description: "A detailed paragraph describing the image's subject, style, lighting, and composition.",
        },
        suggestions: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "A list of exactly three, creative, and distinct suggestions for how to artistically edit this photo. Each suggestion should be a short, actionable instruction.",
        },
      },
      required: ['description', 'suggestions'],
    };

    const response = await this.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: { parts: [{ text: prompt }, { inlineData: { data, mimeType } }] },
      config: {
        responseMimeType: "application/json",
        responseSchema,
      },
    });

    try {
      const json = JSON.parse(response.text);
      // Ensure suggestions is an array of strings, even if the model messes up.
      const suggestions = Array.isArray(json.suggestions) 
        ? json.suggestions.map(String).slice(0, 3) 
        : [];
      return { 
        description: String(json.description || 'Could not analyze description.'), 
        suggestions: suggestions
      };
    } catch (e) {
      console.error("Failed to parse JSON response from image analysis:", e);
      console.error("Raw response text:", response.text);
      throw new Error("Failed to get a valid analysis from the model.");
    }
  }
}

export const geminiService = new GeminiService();