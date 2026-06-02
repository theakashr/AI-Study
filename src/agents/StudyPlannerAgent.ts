import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { adminDb } from "@/lib/firebase-admin";

export class StudyPlannerAgent {
  private llm: ChatGoogleGenerativeAI;

  constructor() {
    this.llm = new ChatGoogleGenerativeAI({
      modelName: "gemini-1.5-pro",
    });
  }

  async generatePlan(userId: string, topics: string[], daysUntilExam: number) {
    const prompt = PromptTemplate.fromTemplate(`
      You are an expert Study Planner. The student has an exam in {daysUntilExam} days on the following topics:
      {topics}

      Generate a daily schedule and revision reminders.
      Format strictly as a JSON object with a "schedule" array containing objects with keys: "day", "topic", "activity".
    `);

    const chain = RunnableSequence.from([prompt, this.llm, new StringOutputParser()]);
    const response = await chain.invoke({ daysUntilExam: daysUntilExam.toString(), topics: topics.join(", ") });

    let plan = {};
    try {
      const cleanJson = response.replace(/```json/g, "").replace(/```/g, "");
      plan = JSON.parse(cleanJson);
    } catch (e) {
      console.error("Failed to parse study plan JSON", e);
    }

    const docRef = await adminDb.collection("studyPlans").add({
      userId,
      plan,
      createdAt: new Date(),
    });

    return docRef.id;
  }
}
