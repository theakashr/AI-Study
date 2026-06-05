import { GoogleGenAI } from "@google/genai";

export function getGeminiClient() {
  const keys = [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3
  ].filter(Boolean) as string[];

  if (keys.length === 0) {
    throw new Error("No Gemini API keys found in environment variables.");
  }

  // Load balancing: pick a random key to distribute requests
  const randomIndex = Math.floor(Math.random() * keys.length);
  const selectedKey = keys[randomIndex];

  console.log(`Using API Key index ${randomIndex + 1} of ${keys.length} for this request.`);
  
  return new GoogleGenAI({ apiKey: selectedKey });
}
