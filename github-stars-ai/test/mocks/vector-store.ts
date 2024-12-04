/**
 * @file Vector Store Mock
 */

import { Document } from "@langchain/core/documents";
import { VectorStore } from "@langchain/core/vectorstores";

export class MockVectorStore extends VectorStore {
  private documents: Document[] = [];

  async addDocuments(documents: Document[]): Promise<void> {
    this.documents.push(...documents);
  }

  async similaritySearch(
    query: string,
    k = 4,
    filter?: Record<string, unknown>
  ): Promise<Document[]> {
    // Simple mock implementation
    return this.documents
      .filter((doc) => {
        if (!filter) return true;
        return Object.entries(filter).every(
          ([key, value]) => doc.metadata[key] === value
        );
      })
      .slice(0, k);
  }

  async clear(): Promise<void> {
    this.documents = [];
  }
}
