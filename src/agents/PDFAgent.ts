import { adminDb, adminStorage } from "@/lib/firebase-admin";

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";

export class PDFAgent {
  async processPDF(userId: string, fileBuffer: Buffer, fileName: string, fileType: string) {
    const pineconeNamespace = `${userId}-${Date.now()}`;

    // 1. Create a pending document in Firestore
    const docRef = await adminDb.collection("documents").add({
      userId,
      fileName,
      pineconeNamespace,
      uploadedAt: new Date(),
      status: "processing",
    });

    const documentId = docRef.id;

    // 2. Upload to Firebase Storage
    const bucket = adminStorage.bucket();
    const storageFile = bucket.file(`users/${userId}/${documentId}/${fileName}`);
    await storageFile.save(fileBuffer, { metadata: { contentType: fileType } });
    await storageFile.makePublic();
    const fileUrl = storageFile.publicUrl();

    await docRef.update({ fileUrl });

    // 3. Extract text
    const pdfParse = require("pdf-parse");
    const pdfData = await pdfParse(fileBuffer);
    await docRef.update({ pageCount: pdfData.numpages });

    // 4. Chunking
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const chunks = await splitter.createDocuments([pdfData.text]);

    // 5. Generate embeddings and store in Pinecone
    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004",
      apiKey: process.env.GEMINI_API_KEY,
    });

    const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
    const index = pc.Index(process.env.PINECONE_INDEX_NAME || "ai-study-assistant");

    const vectors = await Promise.all(
      chunks.map(async (chunk, i) => {
        const [embedding] = await embeddings.embedDocuments([chunk.pageContent]);
        return {
          id: `${documentId}-chunk-${i}`,
          values: embedding,
          metadata: { documentId, userId, text_chunk: chunk.pageContent },
        };
      })
    );

    const batchSize = 100;
    for (let i = 0; i < vectors.length; i += batchSize) {
      await index.namespace(pineconeNamespace).upsert(vectors.slice(i, i + batchSize));
    }

    // 6. Complete
    await docRef.update({ status: "completed" });
    return documentId;
  }
}
