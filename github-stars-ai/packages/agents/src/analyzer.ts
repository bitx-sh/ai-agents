/**
 * @file Analyzer Agent Implementation
 * @module @github-stars-ai/agents/analyzer
 */

import { HumanMessage } from "@langchain/core/messages";
import { BaseAgent, BaseAgentConfig, StateAnnotation } from "./base";
import { TypesenseVectorStore } from "@langchain/community/vectorstores/typesense";
import { Document } from "@langchain/core/documents";
import { 
  CodePattern, 
  RepoAnalysis,
  extractCodePatterns,
  groupDocumentsByRepo 
} from "#utils/code-analysis";
import { RepoMetadata } from "#utils/github";

export interface AnalyzerConfig extends BaseAgentConfig {
  typesenseConfig?: {
    apiKey: string;
    nodes: { host: string; port: number; protocol: string }[];
    connectionTimeoutSeconds?: number;
  };
}

/**
 * Analyzer Agent responsible for deep code analysis
 */
export class AnalyzerAgent extends BaseAgent {
  private vectorStore: TypesenseVectorStore;

  constructor(config: AnalyzerConfig) {
    super({
      ...config,
      name: 'analyzer',
      systemPrompt: `You are an expert code analyst responsible for:
1. Deep analysis of repository contents
2. Pattern recognition and categorization
3. Best practice identification
4. Knowledge base creation
5. Code example extraction

Your analysis should focus on reusable patterns and architectural insights.`,
    });

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
      const { repos, classification } = state.metadata as {
        repos: RepoMetadata[];
        classification: Record<string, unknown>;
      };

      // Retrieve relevant documents from vector store
      const documents = await this.retrieveRelevantDocuments(repos);

      // Extract code patterns
      const patterns = await this.analyzeCodePatterns(documents);

      // Analyze repositories
      const analyses = await this.analyzeRepositories(documents, patterns);

      // Generate comprehensive analysis
      const analysisResponse = await this.chat([
        new HumanMessage(`
          Create a comprehensive analysis of these repositories and patterns:
          
          Repositories: ${JSON.stringify(repos, null, 2)}
          Classification: ${JSON.stringify(classification, null, 2)}
          Patterns: ${JSON.stringify(patterns, null, 2)}
          Detailed Analyses: ${JSON.stringify(analyses, null, 2)}

          Focus on:
          1. Common architectural patterns
          2. Best practices and conventions
          3. Innovative solutions and approaches
          4. Technology choices and trade-offs
          5. Code quality and maintainability patterns

          Return a structured JSON object with your analysis.
        `),
      ]);

      const analysis = JSON.parse(analysisResponse.content[0].text);

      return {
        ...state,
        status: 'analysis_complete',
        metadata: {
          ...state.metadata,
          patterns,
          analyses,
          analysis,
        },
        messages: [
          ...state.messages,
          analysisResponse,
        ],
      };
    } catch (error) {
      return this.handleError(error as Error, state);
    }
  }

  /**
   * Retrieve relevant documents from vector store
   */
  private async retrieveRelevantDocuments(repos: RepoMetadata[]): Promise<Document[]> {
    if (!this.vectorStore) {
      throw new Error('Vector store not configured');
    }

    const documents: Document[] = [];
    
    for (const repo of repos) {
      const results = await this.vectorStore.similaritySearch(
        repo.description || repo.name,
        10,
        { repoId: repo.id }
      );
      documents.push(...results);
    }

    return documents;
  }

  /**
   * Analyze code patterns across repositories
   */
  private async analyzeCodePatterns(documents: Document[]): Promise<CodePattern[]> {
    const extractedPatterns = extractCodePatterns(documents);

    const patternsResponse = await this.chat([
      new HumanMessage(`
        Analyze these code patterns and provide detailed insights:
        ${JSON.stringify(extractedPatterns, null, 2)}

        For each pattern:
        1. Provide a clear description
        2. Identify usage context
        3. List benefits and considerations
        4. Suggest improvements

        Return an array of enhanced pattern objects.
      `),
    ]);

    return JSON.parse(patternsResponse.content[0].text);
  }

  /**
   * Analyze individual repositories
   */
  private async analyzeRepositories(
    documents: Document[],
    patterns: CodePattern[]
  ): Promise<Record<string, RepoAnalysis>> {
    const repoGroups = groupDocumentsByRepo(documents);
    const analyses: Record<string, RepoAnalysis> = {};

    for (const [repoName, repoDocs] of Object.entries(repoGroups)) {
      const analysisResponse = await this.chat([
        new HumanMessage(`
          Analyze this repository's code and structure:
          Repository: ${repoName}
          Documents: ${JSON.stringify(repoDocs, null, 2)}
          Identified Patterns: ${JSON.stringify(patterns, null, 2)}

          Create a detailed analysis including:
          1. Architectural patterns
          2. Component relationships
          3. Dependencies and their usage
          4. Best practices implemented
          5. Notable code examples

          Return a structured analysis object.
        `),
      ]);

      analyses[repoName] = JSON.parse(analysisResponse.content[0].text);
    }

    return analyses;
  }
}
