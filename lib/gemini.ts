import { GoogleGenAI } from "@google/genai";
import { SUMMARY_SYSTEM_PROMPT } from "../utils/prompts";

// Inisialisasi GoogleGenAI dengan API Key
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export const generateSummaryFromGemini = async (
  pdfText: string
): Promise<string> => {
  try {
    const prompt = `${SUMMARY_SYSTEM_PROMPT}\n\nTransform this document into an engaging, easy-to-read summary with contextually relevant emojis and proper markdown formatting:\n\n${pdfText}`;

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      config: {
        temperature: 0.7,
        maxOutputTokens: 1500,
      },
    });

    return result?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
