import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { adminDb, adminStorage } from "@/lib/firebase-admin";
const pdfParse = require("pdf-parse");
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;

    if (!file || !userId) {
      return NextResponse.json(
        { error: "Missing file or userId" },
        { status: 400 }
      );
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name;
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
    await storageFile.save(fileBuffer, {
      metadata: { contentType: file.type },
    });
    await storageFile.makePublic(); // Optional, depending on access rules
    const fileUrl = storageFile.publicUrl();

    // Update document with fileUrl
    await docRef.update({ fileUrl });

    // 3. Extract text
    const pdfData = await pdfParse(fileBuffer);
    const textContent = pdfData.text;

    // Update page count
    await docRef.update({ pageCount: pdfData.numpages });

    // 4. Chunking
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const chunks = await splitter.createDocuments([textContent]);

    // 5. Generate embeddings and store in Pinecone
    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004",
      apiKey: process.env.GEMINI_API_KEY,
    });

    const pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
    const indexName = process.env.PINECONE_INDEX_NAME || "ai-study-assistant";
    const index = pc.Index(indexName);

    const vectors = await Promise.all(
      chunks.map(async (chunk, i) => {
        const [embedding] = await embeddings.embedDocuments([chunk.pageContent]);
        return {
          id: `${documentId}-chunk-${i}`,
          values: embedding,
          metadata: {
            documentId,
            userId,
            text_chunk: chunk.pageContent,
            pageNumber: chunk.metadata.loc?.pageNumber || 1,
          },
        };
      })
    );

    // Upsert in batches of 100 to Pinecone
    const batchSize = 100;
    for (let i = 0; i < vectors.length; i += batchSize) {
      const batch = vectors.slice(i, i + batchSize);
      await index.namespace(pineconeNamespace).upsert(batch);
    }

    // 6. Complete
    await docRef.update({ status: "completed" });

    return NextResponse.json({
      success: true,
      documentId,
      message: "Document processed successfully",
    });
  } catch (error: any) {
    console.error("Error processing document:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
