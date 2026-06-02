import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to buffer for pdf-parse
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Extract text from PDF
    const pdf = require("pdf-parse");
    const pdfData = await pdf(buffer);
    const text = pdfData.text;

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "Could not extract text from the PDF" }, { status: 400 });
    }

    // Prepare Prompt
    const prompt = `You are an expert academic researcher. Summarize the following document into chapter-wise summaries and high-yield exam notes. Format your response strictly in Markdown, using headers, bullet points, and bold text for crucial terms. Keep it structured and easy to read.
    
Document Text:
${text.substring(0, 35000)} // Truncating to avoid massive token limits if PDF is huge
`;

    // Call Gemini 2.5 Flash
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return NextResponse.json({ summary: response.text });

  } catch (error: any) {
    console.error("Summary Agent Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate summary" }, { status: 500 });
  }
}
