require('dotenv').config({path: '.env.local'});
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function test() {
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
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      responseMimeType: 'application/json'
    }
  });

  console.log('RAW_TEXT:', response.text);
  
  let rawText = response.text || "[]";
  rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
  
  let quizData = JSON.parse(rawText);
  
  // If Gemini returned an object instead of an array, extract the array
  if (!Array.isArray(quizData)) {
    console.log("NOT AN ARRAY!");
    if (quizData.quiz && Array.isArray(quizData.quiz)) {
      quizData = quizData.quiz;
    } else if (quizData.questions && Array.isArray(quizData.questions)) {
      quizData = quizData.questions;
    } else {
      const possibleArray = Object.values(quizData).find(val => Array.isArray(val));
      if (possibleArray) {
        quizData = possibleArray;
      }
    }
  }

  console.log("Extracted Array Length:", quizData.length);
}

test().catch(console.error);
