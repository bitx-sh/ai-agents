/**
 * @file Retriever Agent Implementation
 * @module @github-stars-ai/agents/retriever
 */

import { HumanMessage } from "@langchain/core/messages";
import { BaseAgent, BaseAgentConfig, StateAnnotation } from "./base";
import { GitHubClient, RepoMetadata } from "#utils/github";
import { TypesenseVectorStore } from "@langchain/community/vectorstores/typesense";
import { Document } from "@langchain/core/documents";

export interface RetrieverConfig extends BaseAgentConfig {
  githubToken: string;
  typesenseConfig?: {
    apiKey: string;
    nodes: { host: string; port: number; protocol: string }[];
    connectionTimeoutSeconds?: number;
  };
}

/**
 * Retriever Agent responsible for fetching and organizing GitHub data
 */
export class RetrieverAgent extends BaseAgent {
  private github: GitHubClient;
  private vectorStore: TypesenseVectorStore;

  constructor(config: RetrieverConfig) {
    super({
      ...config,
      name: 'retriever',
      systemPrompt: `You are a GitHub repository analyst responsible for:
1. Retrieving and organizing repository data
2. Initial classification of repositories
3. Identifying key characteristics and patterns
4. Preparing data for detailed analysis

Focus on extracting meaningful patterns and relationships between repositories.`,
    });

    this.github = new GitHubClient({ token: config.githubToken });

    if (config.typesenseConfig) {
      this.vectorStore = new TypesenseVectorStore(
        this.model.embeddings,
        {
          apiKey: config.typesenseConfig.apiKey,
          nodes: config.typesenseConfig.nodes,
          connectionTimeoutSeconds: config.typesenseConfig.connectionTimeoutSeconds || 10,
        }
      );
    }
  }

  async execute(state: typeof StateAnnotation.State) {
    try {
      const { username } = state.metadata as { username: string };

      // Fetch starred repositories
      const repos = await this.github.getStarredRepos(username);

      // Create initial classification
      const classificationResponse = await this.chat([
        new HumanMessage(`
          Analyze and classify these GitHub repositories:
          ${JSON.stringify(repos, null, 2)}

          Create a classification based on:
          1. Primary programming languages
          2. Project types (library, application, tool, etc.)
          3. Domain categories
          4. Common patterns and approaches

          Return a structured JSON object with your analysis.
        `),
      ]);

      // Store repository content in vector store
      await this.storeRepoContent(repos);

      const classification = JSON.parse(classificationResponse.content[0].text);

      return {
        ...state,
        status: 'retrieval_complete',
        metadata: {
          ...state.metadata,
          repos,
          classification,
        },
        messages: [
          ...state.messages,
          classificationResponse,
        ],
      };
    } catch (error) {
      return this.handleError(error as Error, state);
    }
  }

  /**
   * Store repository content in vector store for later analysis
   */
  private async storeRepoContent(repos: RepoMetadata[]) {
    const documents: Document[] = [];

    for (const repo of repos) {
      try {
        // Load repository content
        const content = await this.github.loadRepoContent(repo.url);

        // Add metadata to documents
        const enrichedDocs = content.map(doc => new Document({
          pageContent: doc.pageContent,
          metadata: {
            ...doc.metadata,
            repoId: repo.id,
            repoName: repo.name,
            repoUrl: repo.url,
            language: repo.language,
            topics: repo.topics,
          },
        }));

        documents.push(...enrichedDocs);
      } catch (error) {
        console.error(`Error loading content for ${repo.fullName}:`, error);
      }
    }

    // Store documents in vector store if available
    if (this.vectorStore) {
      await this.vectorStore.addDocuments(documents);
    }

    return documents;
  }
}
