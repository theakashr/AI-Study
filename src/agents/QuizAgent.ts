import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { adminDb } from "@/lib/firebase-admin";

export class QuizAgent {
  private llm: ChatGoogleGenerativeAI;

  constructor() {
    this.llm = new ChatGoogleGenerativeAI({
      modelName: "gemini-1.5-pro",
    });
  }

  async generateQuiz(userId: string, documentId: string, textContext: string, difficulty: "easy" | "medium" | "hard") {
    const prompt = PromptTemplate.fromTemplate(`
      You are an expert educator. Create a {difficulty} level quiz based on the following text.
      Include 3 Multiple Choice Questions, 2 True/False Questions, and 1 Short Answer Question.
      Format the output strictly as a JSON array of objects with the following keys:
      "question", "type" (MCQ, TF, ShortAnswer), "options" (array of strings, empty for short answer), "correctAnswer", and "explanation".
      
      TEXT:
      {textContext}
    `);

    const chain = RunnableSequence.from([prompt, this.llm, new StringOutputParser()]);
    const response = await chain.invoke({ difficulty, textContext: textContext.substring(0, 30000) });

    let questions = [];
    try {
      const cleanJson = response.replace(/```json/g, "").replace(/```/g, "");
      questions = JSON.parse(cleanJson);
    } catch (e) {
      console.error("Failed to parse quiz JSON", e);
    }

    const quizRef = await adminDb.collection("quizzes").add({
      userId,
      documentId,
      difficulty,
      questions,
      createdAt: new Date(),
    });

    return quizRef.id;
  }
}
