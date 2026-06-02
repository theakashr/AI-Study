import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "No topic provided" }, { status: 400 });
    }

    const prompt = `You are a Cognitive Science Specialist trained in active recall and spaced repetition mechanics.
Generate a targeted flashcard deck for the following topic: "${topic}".

You must generate exactly 10 flashcard pairs.
Rules:
- Keep the "front" (Question) concise and challenging.
- Keep the "back" (Answer) punchy, focusing on specific definitions, formula applications, or key lists.

Output ONLY a valid JSON array matching this exact schema, with no markdown formatting around it (no \`\`\`json):
[
  {
    "front": "What is the formula for...?",
    "back": "..."
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const flashcards = JSON.parse(response.text || "[]");
    return NextResponse.json({ flashcards });

  } catch (error: any) {
    console.error("Flashcard Agent Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate flashcards" }, { status: 500 });
  }
}
