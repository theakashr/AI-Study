import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/gemini";

export const maxDuration = 60; // Extend duration for processing large files

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    const modificationRequest = formData.get("modificationRequest") as string;
    const currentSummary = formData.get("currentSummary") as string;

    let contents: any[] = [];

    if (modificationRequest && currentSummary) {
      // Modify existing summary
      const prompt = `You are an expert academic assistant for an application called CognitoAI. 

Your task is to modify a set of existing study notes based on a user's specific request.

Here are the ORIGINAL NOTES:
<original_notes>
${currentSummary}
</original_notes>

Here is the USER'S REQUEST to change the notes:
<user_request>
${modificationRequest}
</user_request>

INSTRUCTIONS:
1. Apply the user's request to the original notes.
2. If the user asks to simplify, use simpler language while retaining core facts.
3. If the user asks to reformat (e.g., "turn this into a table"), output the same information in the requested format.
4. Do NOT add outside information unless the user explicitly asks you to expand on a topic.
5. Output ONLY the updated notes in markdown format. Do not include conversational filler like "Here are your updated notes."`;
      
      contents = [{ role: 'user', parts: [{ text: prompt }] }];

    } else {
      // Generate new summary from file
      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }

      const arrayBuffer = await file.arrayBuffer();
      const base64Data = Buffer.from(arrayBuffer).toString("base64");

      const prompt = `You are SummaryAgent, an expert academic note-making assistant.
  
  Your job is to analyze uploaded PDFs, lecture notes, textbooks, and study materials based on the provided document.
  
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
    }

    // Call Gemini 2.5 Flash natively
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents
    });

    return NextResponse.json({ summary: response.text });

  } catch (error: any) {
    console.error("Summary Agent Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate summary" }, { status: 500 });
  }
}
