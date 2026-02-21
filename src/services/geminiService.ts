import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface QuranicReference {
  verse: string;
  arabic: string;
  translation: string;
  surah: string;
  ayahNumber: number;
  context: string;
}

export interface SunnahReference {
  hadith: string;
  source: string;
  grade: string;
  explanation: string;
}

export interface GuidanceResponse {
  reflection: string;
  quran: QuranicReference[];
  sunnah: SunnahReference[];
  practicalSteps: string[];
}

export async function getGuidance(situation: string): Promise<GuidanceResponse> {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: situation,
    config: {
      systemInstruction: `You are "Nur Guide", a compassionate and deeply knowledgeable Islamic scholar and counselor. 
      Your goal is to help users find peace, direction, and wisdom by connecting their personal life situations to the Quran and Sunnah.
      
      Guidelines:
      1. Be empathetic and non-judgmental.
      2. Provide specific Quranic verses (Arabic text + English translation + Surah/Ayah number).
      3. Provide authentic Hadiths with their sources (e.g., Bukhari, Muslim).
      4. Offer a "Reflection" that bridges the divine wisdom with the user's specific situation.
      5. Provide 3-4 "Practical Steps" the user can take (spiritual or worldly).
      
      Format the output as a JSON object.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          reflection: { type: Type.STRING },
          quran: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                verse: { type: Type.STRING },
                arabic: { type: Type.STRING },
                translation: { type: Type.STRING },
                surah: { type: Type.STRING },
                ayahNumber: { type: Type.INTEGER },
                context: { type: Type.STRING }
              },
              required: ["verse", "arabic", "translation", "surah", "ayahNumber", "context"]
            }
          },
          sunnah: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                hadith: { type: Type.STRING },
                source: { type: Type.STRING },
                grade: { type: Type.STRING },
                explanation: { type: Type.STRING }
              },
              required: ["hadith", "source", "grade", "explanation"]
            }
          },
          practicalSteps: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["reflection", "quran", "sunnah", "practicalSteps"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}
