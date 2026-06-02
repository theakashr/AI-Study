import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { adminDb } from "@/lib/firebase-admin";

export class FlashcardAgent {
  private llm: ChatGoogleGenerativeAI;

  constructor() {
    this.llm = new ChatGoogleGenerativeAI({
      modelName: "gemini-1.5-pro",
    });
  }

  async generateFlashcards(userId: string, documentId: string, textContext: string) {
    const prompt = PromptTemplate.fromTemplate(`
      Create active recall flashcards from the following text.
      Format strictly as a JSON array of objects with keys: "question" and "answer".
      
      TEXT:
      {textContext}
    `);

    const chain = RunnableSequence.from([prompt, this.llm, new StringOutputParser()]);
    const response = await chain.invoke({ textContext: textContext.substring(0, 30000) });

    let flashcards = [];
    try {
      const cleanJson = response.replace(/```json/g, "").replace(/```/g, "");
      flashcards = JSON.parse(cleanJson);
    } catch (e) {
      console.error("Failed to parse flashcards JSON", e);
    }

    const docRef = await adminDb.collection("flashcards").add({
      userId,
      documentId,
      flashcards,
      createdAt: new Date(),
    });

    return docRef.id;
  }
}
