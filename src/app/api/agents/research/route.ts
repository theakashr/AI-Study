import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "No query provided" }, { status: 400 });
    }

    const prompt = `You are an expert Research Agent. The user wants to research the following query: "${query}"

Generate a comprehensive, highly-detailed academic report.
Include:
1. Executive Summary
2. Detailed exploration of the topic
3. Real-world applications or case studies
4. Future outlook / Unresolved questions
5. References (Provide at least 3 realistic citations, books, or papers relevant to the topic).

Format the output strictly in professional Markdown with headers, bold text, and bullet points.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return NextResponse.json({ report: response.text });

  } catch (error: any) {
    console.error("Research Agent Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate research report" }, { status: 500 });
  }
}
