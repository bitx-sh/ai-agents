/**
 * @file Vector Store Implementation
 * @module @github-stars-ai/utils/vector-store
 */

import { Document } from "@langchain/core/documents";
import { Embeddings } from "@langchain/core/embeddings";
import { VectorStore } from "@langchain/core/vectorstores";
import { TypesenseVectorStore } from "@langchain/community/vectorstores/typesense";
import { BaseCallbackConfig } from "@langchain/core/callbacks/manager";
import { z } from "zod";

/**
 * Vector store configuration schema
 */
export const VectorStoreConfigSchema = z.object({
  type: z.enum(["typesense", "memory"]),
  typesense: z
    .object({
      apiKey: z.string(),
      nodes: z.array(
        z.object({
          host: z.string(),
          port: z.number(),
          protocol: z.string(),
        }),
      ),
      connectionTimeoutSeconds: z.number().default(10),
      collectionName: z.string().default("github_stars"),
    })
    .optional(),
  memory: z
    .object({
      maxDocuments: z.number().default(10000),
    })
    .optional(),
});

export type VectorStoreConfig = z.infer<typeof VectorStoreConfigSchema>;

/**
 * In-memory vector store implementation
 */
class InMemoryVectorStore extends VectorStore {
  private documents: Document[] = [];
  private embeddings: Embeddings;
  private maxDocuments: number;

  constructor(
    embeddings: Embeddings,
    config: VectorStoreConfig["memory"] = {},
  ) {
    super(embeddings, {});
    this.embeddings = embeddings;
    this.maxDocuments = config.maxDocuments || 10000;
  }

  async addDocuments(documents: Document[]): Promise<void> {
    if (this.documents.length + documents.length > this.maxDocuments) {
      throw new Error(`Exceeds maximum document limit of ${this.maxDocuments}`);
    }

    const embeddings = await this.embeddings.embedDocuments(
      documents.map((doc) => doc.pageContent),
    );

    documents.forEach((doc, i) => {
      this.documents.push({
        ...doc,
        metadata: {
          ...doc.metadata,
          embedding: embeddings[i],
        },
      });
    });
  }

  async similaritySearch(
    query: string,
    k = 4,
    filter?: Record<string, unknown>,
    _callbacks?: BaseCallbackConfig,
  ): Promise<Document[]> {
    const queryEmbedding = await this.embeddings.embedQuery(query);

    const documents = this.documents
      .map((doc) => ({
        document: doc,
        score: this.cosineSimilarity(
          queryEmbedding,
          doc.metadata.embedding as number[],
        ),
      }))
      .filter((result) => {
        if (!filter) return true;
        return Object.entries(filter).every(
          ([key, value]) => doc.metadata[key] === value,
        );
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, k);

    return documents.map((result) => result.document);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }
}

/**
 * Vector store factory
 */
export class VectorStoreFactory {
  static async create(
    embeddings: Embeddings,
    config: VectorStoreConfig,
  ): Promise<VectorStore> {
    switch (config.type) {
      case "typesense":
        if (!config.typesense) {
          throw new Error("Typesense configuration required");
        }
        return new TypesenseVectorStore(embeddings, {
          apiKey: config.typesense.apiKey,
          nodes: config.typesense.nodes,
          connectionTimeoutSeconds: config.typesense.connectionTimeoutSeconds,
          collectionName: config.typesense.collectionName,
        });

      case "memory":
        return new InMemoryVectorStore(embeddings, config.memory);

      default:
        throw new Error(`Unsupported vector store type: ${config.type}`);
    }
  }
}

/**
 * Document processor for vector storage
 */
export class DocumentProcessor {
  static async process(
    documents: Document[],
    options: {
      maxTokens?: number;
      chunkSize?: number;
      chunkOverlap?: number;
    } = {},
  ): Promise<Document[]> {
    const { maxTokens = 8192, chunkSize = 1000, chunkOverlap = 200 } = options;

    return documents.flatMap((doc) => {
      // Split document into chunks if it exceeds maxTokens
      if (doc.pageContent.length > maxTokens) {
        return this.chunkDocument(doc, chunkSize, chunkOverlap);
      }
      return doc;
    });
  }

  private static chunkDocument(
    document: Document,
    chunkSize: number,
    overlap: number,
  ): Document[] {
    const text = document.pageContent;
    const chunks: Document[] = [];
    let start = 0;

    while (start < text.length) {
      const end = Math.min(start + chunkSize, text.length);
      chunks.push(
        new Document({
          pageContent: text.slice(start, end),
          metadata: {
            ...document.metadata,
            chunk: chunks.length,
            start,
            end,
          },
        }),
      );
      start = end - overlap;
    }

    return chunks;
  }
}
