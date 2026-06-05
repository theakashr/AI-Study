import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/gemini";

export const maxDuration = 60; // Extend duration for processing

export async function POST(req: NextRequest) {
  try {
    const { transcript } = await req.json();

    if (!transcript) {
      return NextResponse.json({ error: "No transcript provided" }, { status: 400 });
    }

    const prompt = `You are an advanced Multi-Agent Academic Assistant, specifically acting as the Voice Agent.
Your persona is a charismatic, highly articulate audio scriptwriter and podcast host.

The user just said: "${transcript}"

Generate a helpful, conversational response. 
CRITICAL RULES FOR VOICE SYNTHESIS:
1. Write in a natural, conversational tone.
2. DO NOT use markdown, bullet points, asterisks, brackets, or code snippets. The response will be read aloud by a Text-to-Speech engine, so special characters will sound glitchy.
3. Use natural transition words. Keep sentences relatively short and punchy for natural pauses.`;

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return NextResponse.json({ reply: response.text });

  } catch (error: any) {
    console.error("Voice Agent Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate voice response" }, { status: 500 });
  }
}
