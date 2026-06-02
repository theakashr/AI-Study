import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const maxDuration = 60; // Prevent Vercel 504 Timeout

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const topic = formData.get("topic") as string;
    const file = formData.get("file") as File;

    if (!topic && !file) {
      return NextResponse.json({ error: "Please provide either a topic or a file" }, { status: 400 });
    }

    let extractedText = "";
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const pdf = require("pdf-parse");
      const pdfData = await pdf(buffer);
      extractedText = pdfData.text;
      
      if (!extractedText || extractedText.trim().length === 0) {
        return NextResponse.json({ error: "Could not extract text from the PDF" }, { status: 400 });
      }
    }

    const prompt = `You are a rigorous Quiz Examiner. Generate a highly accurate evaluation assessment based on the following ${file ? 'document' : 'topic'}:
    
${file ? `Document Text:\n${extractedText.substring(0, 35000)}` : `Topic: "${topic}"`}

You must generate exactly 20 multiple choice questions (mcq).
Mix conceptual and application-based questions.
For MCQs, provide 4 options, the exact correct answer (must perfectly match one of the options), and a brief 1-sentence explanation of *why* it is correct.

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
