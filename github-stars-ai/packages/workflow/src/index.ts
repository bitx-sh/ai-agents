/**
 * @file Workflow Orchestration
 * @module @github-stars-ai/workflow
 */

import { StateGraph } from "@langchain/langgraph";
import { MemorySaver } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";
import { 
  ManagerAgent, 
  RetrieverAgent, 
  AnalyzerAgent, 
  GeneratorAgent 
} from "#agents";
import { GitHubClient } from "#utils/github";
import { loadConfig } from "#config";
import { z } from "zod";

/**
 * Workflow configuration schema
 */
export const WorkflowConfigSchema = z.object({
  anthropicApiKey: z.string(),
  githubToken: z.string(),
  typesense: z.object({
    apiKey: z.string(),
    nodes: z.array(z.object({
      host: z.string(),
      port: z.number(),
      protocol: z.string(),
    })),
  }).optional(),
  maxConcurrency: z.number().default(5),
  maxRetries: z.number().default(3),
  timeout: z.number().default(300000), // 5 minutes
});

export type WorkflowConfig = z.infer<typeof WorkflowConfigSchema>;

/**
 * Workflow state schema
 */
export const WorkflowStateSchema = z.object({
  messages: z.array(z.any()),
  status: z.string(),
  error: z.any().nullable(),
  metadata: z.record(z.unknown()),
  requestId: z.string(),
  startTime: z.number(),
});

export type WorkflowState = z.infer<typeof WorkflowStateSchema>;

/**
 * GitHub Stars Analysis Workflow
 */
export class GitHubStarsWorkflow {
  private config: WorkflowConfig;
  private graph: StateGraph;
  private memory: MemorySaver;
  private github: GitHubClient;

  constructor(config: WorkflowConfig) {
    this.config = WorkflowConfigSchema.parse(config);
    this.github = new GitHubClient({
      token: config.githubToken,
      maxConcurrency: config.maxConcurrency,
    });
    this.memory = new MemorySaver();
    this.graph = this.createWorkflowGraph();
  }

  /**
   * Create the workflow graph with all agents
   */
  private createWorkflowGraph(): StateGraph {
    // Load agent configs
    const managerConfig = loadConfig('manager');
    const retrieverConfig = loadConfig('retriever');
    const analyzerConfig = loadConfig('analyzer');
    const generatorConfig = loadConfig('generator');

    // Initialize agents
    const manager = new ManagerAgent({
      ...managerConfig,
      anthropicApiKey: this.config.anthropicApiKey,
    });

    const retriever = new RetrieverAgent({
      ...retrieverConfig,
      anthropicApiKey: this.config.anthropicApiKey,
      githubToken: this.config.githubToken,
      typesenseConfig: this.config.typesense,
    });

    const analyzer = new AnalyzerAgent({
      ...analyzerConfig,
      anthropicApiKey: this.config.anthropicApiKey,
      typesenseConfig: this.config.typesense,
    });

    const generator = new GeneratorAgent({
      ...generatorConfig,
      anthropicApiKey: this.config.anthropicApiKey,
    });

    // Create graph
    const graph = new StateGraph({
      channels: ['main', 'error'],
    });

    // Add nodes
    graph
      .addNode('manager', manager)
      .addNode('retriever', retriever)
      .addNode('analyzer', analyzer)
      .addNode('generator', generator);

    // Define edges and conditions
    graph
      .addEdge('manager', 'retriever')
      .addEdge('retriever', 'analyzer')
      .addEdge('analyzer', 'generator')
      .addEdge('generator', 'manager');

    // Add conditional routing
    graph.addConditionalEdges(
      'manager',
      (state) => this.determineNextStep(state)
    );

    // Add error handling
    graph.setErrorHandler((error, state) => this.handleError(error, state));

    return graph;
  }

  /**
   * Determine the next step in the workflow
   */
  private determineNextStep(state: WorkflowState): string {
    const { status } = state;

    switch (status) {
      case 'planning_complete':
        return 'retriever';
      case 'retrieval_complete':
        return 'analyzer';
      case 'analysis_complete':
        return 'generator';
      case 'generation_complete':
        return '__end__';
      case 'error':
        return '__end__';
      default:
        return 'manager';
    }
  }

  /**
   * Handle errors in the workflow
   */
  private handleError(error: Error, state: WorkflowState): WorkflowState {
    console.error(`Workflow error:`, error);

    return {
      ...state,
      status: 'error',
      error: {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Execute the workflow
   */
  async execute(params: {
    username: string;
    request: string;
  }): Promise<WorkflowState> {
    const requestId = crypto.randomUUID();
    const startTime = Date.now();

    const initialState: WorkflowState = {
      messages: [],
      status: 'initiated',
      error: null,
      metadata: {
        username: params.username,
        request: params.request,
        config: this.config,
      },
      requestId,
      startTime,
    };

    try {
      // Compile the graph
      const workflow = this.graph.compile({
        checkpointer: this.memory,
      });

      // Execute the workflow
      const finalState = await workflow.invoke(
        initialState,
        {
          configurable: {
            timeout: this.config.timeout,
            maxRetries: this.config.maxRetries,
          },
        }
      );

      return finalState;
    } catch (error) {
      return this.handleError(error as Error, initialState);
    }
  }

  /**
   * Get workflow execution history
   */
  async getHistory(requestId: string): Promise<BaseMessage[]> {
    return await this.memory.get(requestId);
  }

  /**
   * Clear workflow history
   */
  async clearHistory(): Promise<void> {
    await this.memory.clear();
  }
}

/**
 * Create a new workflow instance
 */
export function createWorkflow(config: WorkflowConfig): GitHubStarsWorkflow {
  return new GitHubStarsWorkflow(config);
}
