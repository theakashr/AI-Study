import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

export class SummaryAgent {
  private llm: ChatGoogleGenerativeAI;

  constructor() {
    this.llm = new ChatGoogleGenerativeAI({
      modelName: "gemini-1.5-pro",
    });
  }

  async generateSummary(documentText: string, level: "chapter" | "exam" = "chapter") {
    const promptTemplate = level === "chapter" 
      ? `Summarize the following text chapter-by-chapter, extracting key concepts and definitions: {text}`
      : `Create exam-oriented revision notes from the following text, focusing on the most critical points: {text}`;

    const prompt = PromptTemplate.fromTemplate(promptTemplate);
    const chain = RunnableSequence.from([prompt, this.llm, new StringOutputParser()]);

    return await chain.invoke({ text: documentText.substring(0, 30000) }); // Basic limit handling
  }
}
