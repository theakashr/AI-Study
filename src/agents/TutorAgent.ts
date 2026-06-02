import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

export class TutorAgent {
  private llm: ChatGoogleGenerativeAI;
  private embeddings: GoogleGenerativeAIEmbeddings;
  private pinecone: Pinecone;
  private indexName: string;

  constructor() {
    this.llm = new ChatGoogleGenerativeAI({
      modelName: "gemini-1.5-pro", // Mapped to Gemini Pro 3.1 features conceptually
      maxRetries: 2,
    });
    this.embeddings = new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004",
    });
    this.pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
    this.indexName = process.env.PINECONE_INDEX_NAME || "ai-study-assistant";
  }

  async askQuestion(userId: string, question: string) {
    // 1. Generate embedding for the question
    const [questionEmbedding] = await this.embeddings.embedDocuments([question]);

    // 2. Query Pinecone for relevant context
    const index = this.pinecone.Index(this.indexName);
    const queryResponse = await index.query({
      vector: questionEmbedding,
      topK: 5,
      includeMetadata: true,
      filter: { userId }, // Filter by user to ensure privacy
    });

    // 3. Extract context snippets
    const context = queryResponse.matches
      .map((match: any) => match.metadata.text_chunk)
      .join("\n\n---\n\n");

    // 4. Construct prompt
    const prompt = PromptTemplate.fromTemplate(`
      You are an expert AI Tutor. Your goal is to explain difficult concepts clearly, provide examples, and cite your sources based on the provided context.
      
      CONTEXT:
      {context}

      STUDENT QUESTION:
      {question}

      Provide a detailed, encouraging response. If the answer is not in the context, use your general knowledge but clarify that it's not from the uploaded materials.
    `);

    // 5. Build and execute LangChain sequence
    const chain = RunnableSequence.from([prompt, this.llm, new StringOutputParser()]);

    const response = await chain.invoke({
      context: context || "No specific document context found.",
      question,
    });

    return { response, sources: queryResponse.matches };
  }
}
