import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "No topic provided" }, { status: 400 });
    }

    const prompt = `You are a rigorous Quiz Examiner. Generate a highly accurate evaluation assessment on the following topic: "${topic}".
    
You must generate exactly 5 multiple choice questions (mcq).
Mix conceptual and application-based questions.
For MCQs, provide 4 options, the exact correct answer (must perfectly match one of the options), and a detailed explanation of *why* it is correct.

Output ONLY a valid JSON array matching this exact schema, with no markdown formatting around it (no \`\`\`json):
[
  {
    "type": "mcq",
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "answer": "A",
    "explanation": "..."
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const quizData = JSON.parse(response.text || "[]");
    return NextResponse.json({ quiz: quizData });

  } catch (error: any) {
    console.error("Quiz Agent Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate quiz" }, { status: 500 });
  }
}
