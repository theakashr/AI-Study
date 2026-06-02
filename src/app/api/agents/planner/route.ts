import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { subjects, examDate, hoursPerDay } = await req.json();

    if (!subjects || !examDate || !hoursPerDay) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const prompt = `You are a hyper-organized Study Planner and productivity coach. 
Generate an optimal daily study schedule and structured revision reminders based on the following:
- Subjects: ${subjects}
- Exam Date: ${examDate}
- Study Hours Per Day: ${hoursPerDay} hours

Rules:
1. Break down the material into realistic, 45-minute study blocks (Pomodoro style) separated by 15-minute breaks.
2. Build a spaced repetition follow-up timeline (e.g., Review 1, Review 2).
3. Deliver the schedule strictly in a clean, professional Markdown table format.
4. Do not include excessive conversational text, just the generated schedule and a brief encouraging note at the end.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return NextResponse.json({ schedule: response.text });

  } catch (error: any) {
    console.error("Study Planner Agent Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate schedule" }, { status: 500 });
  }
}
