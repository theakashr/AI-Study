const { GoogleGenAI } = require("@google/genai");

async function test() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = `You are a rigorous Quiz Examiner. Generate a highly accurate evaluation assessment based on the provided document or topic:
    
Topic: "History"

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

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    }
  });

  console.log(response.text);
}

test().catch(console.error);
