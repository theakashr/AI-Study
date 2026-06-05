import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const maxDuration = 60; // Prevent Vercel Serverless timeout

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const topic = formData.get("topic") as string;
    const file = formData.get("file") as File | null;

    if (!topic && !file) {
      return NextResponse.json({ error: "Please provide either a topic or a file" }, { status: 400 });
    }

    let base64Data = "";
    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      base64Data = Buffer.from(arrayBuffer).toString("base64");
    }

    const prompt = `You are a rigorous Quiz Examiner. Generate a highly accurate evaluation assessment based on the provided document or topic:
    
${file ? `Analyze the attached PDF Document and generate questions based on it.` : `Topic: "${topic}"`}

You must generate exactly 20 multiple choice questions (mcq).
Mix conceptual and application-based questions.
For MCQs, provide 4 options, the exact correct answer (must perfectly match one of the options), and a brief 1-sentence explanation of *why* it is correct.

Output ONLY a valid JSON array matching this exact schema, with no markdown formatting around it (no \`\`\`json):
[
  {
    "type": "mcq",
    "question": "...",
    "options": ["Option 1 text", "Option 2 text", "Option 3 text", "Option 4 text"],
    "answer": "The exact text of the correct option",
    "explanation": "..."
  }
]`;

    let contents: any[] = [];
    if (file && base64Data) {
      contents = [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: file.type || "application/pdf"
              }
            },
            { text: prompt }
          ]
        }
      ];
    } else {
      contents = [{ role: 'user', parts: [{ text: prompt }] }];
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        responseMimeType: "application/json",
      }
    });

    let rawText = response.text || "[]";
    rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    let quizData;
    try {
      quizData = JSON.parse(rawText);
      
      // If Gemini returned an object instead of an array, extract the array
      if (!Array.isArray(quizData)) {
        if (quizData.quiz && Array.isArray(quizData.quiz)) {
          quizData = quizData.quiz;
        } else if (quizData.questions && Array.isArray(quizData.questions)) {
          quizData = quizData.questions;
        } else {
          // Try to find any array inside the object
          const possibleArray = Object.values(quizData).find(val => Array.isArray(val));
          if (possibleArray) {
            quizData = possibleArray;
          } else {
            console.error("AI returned invalid JSON structure:", quizData);
            throw new Error("AI returned an invalid quiz format. Please try again.");
          }
        }
      }
    } catch (parseError) {
      console.error("Failed to parse Quiz JSON. Raw text:", rawText);
      throw new Error("Failed to parse the generated quiz. Please try again.");
    }
    
    return NextResponse.json({ quiz: quizData });

  } catch (error: any) {
    console.error("Quiz Agent Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate quiz" }, { status: 500 });
  }
}
