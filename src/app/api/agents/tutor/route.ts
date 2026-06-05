import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/gemini";

export const maxDuration = 60; // Prevent Vercel Timeout

export async function POST(req: NextRequest) {
  try {
    const { messages, context } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages array" }, { status: 400 });
    }

    const systemPrompt = `You are a patient, brilliant university professor acting as a Tutor Agent.
Your task is to explain difficult concepts with clear examples and real-world analogies.

CONTEXT KNOWLEDGE BASE:
${context ? context.substring(0, 50000) : "No specific context provided. Rely on your general academic knowledge."}

RULES:
1. Do not just define a term; use a real-world analogy to make it intuitive.
2. Explicitly cite the parts of the provided context you are referencing (if applicable).
3. End your explanations with a quick conceptual check-in question to keep the student engaged.
4. Format in clean Markdown.`;

    // Format messages for Gemini Chat (alternating user/model)
    const formattedMessages = messages.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Inject system prompt into the first user message if this is the start of the chat
    // Actually, in @google/genai we can use systemInstruction if supported, or just prepend to first message.
    if (formattedMessages.length > 0 && formattedMessages[0].role === 'user') {
      formattedMessages[0].parts[0].text = `[SYSTEM INSTRUCTIONS]:\n${systemPrompt}\n\n[USER MESSAGE]:\n${formattedMessages[0].parts[0].text}`;
    }

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: formattedMessages,
    });

    return NextResponse.json({ reply: response.text });

  } catch (error: any) {
    console.error("Tutor Agent Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate tutor response" }, { status: 500 });
  }
}
