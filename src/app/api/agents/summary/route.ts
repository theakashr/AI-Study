import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const maxDuration = 60; // Prevent Vercel 504 Timeout

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
    const prompt = `You are SummaryAgent, an expert academic note-making assistant.

Your job is to analyze uploaded PDFs, lecture notes, textbooks, and study materials based on the following document:

Document Text:
${text.substring(0, 35000)}

When a document is uploaded:
1. Read and understand the content.
2. Identify chapters and topics.
3. Generate exam-oriented notes.
4. Extract important definitions.
5. Extract formulas and equations.
6. Highlight key points.
7. Create a "Most Important Questions" section.
8. Create a "2 Marks Questions" section.
9. Create a "5 Marks Questions" section.
10. Create a final revision sheet.

Output Format:

# Chapter Name

## Overview

## Key Concepts

## Important Definitions

## Important Formulas

## Exam Notes

## Frequently Asked Questions

## Quick Revision

Keep explanations concise and student-friendly.`;

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
