/**
 * @file Base Agent Implementation
 * @module @github-stars-ai/agents/base
 */

import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";
import { ChatAnthropic } from "@langchain/anthropic";
import { StateGraph } from "@langchain/langgraph";
import { 
  MemorySaver, 
  Annotation, 
  messagesStateReducer 
} from "@langchain/langgraph";
import { z } from "zod";

/**
 * Base state schema for all agents
 */
export const BaseStateSchema = z.object({
  messages: z.array(z.any()),
  status: z.string(),
  error: z.any().nullable(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Base state type derived from schema
 */
export type BaseState = z.infer<typeof BaseStateSchema>;

/**
 * State annotation for the agent graph
 */
export const StateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: messagesStateReducer,
  }),
  status: Annotation<string>({
    reducer: (prev, next) => next,
  }),
  error: Annotation<Error | null>({
    reducer: (prev, next) => next,
  }),
  metadata: Annotation<Record<string, unknown>>({
    reducer: (prev, next) => ({ ...prev, ...next }),
  }),
});

/**
 * Base agent configuration
 */
export interface BaseAgentConfig {
  name: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt: string;
}

/**
 * Base agent class for all specialized agents
 */
export abstract class BaseAgent {
  protected name: string;
  protected model: ChatAnthropic;
  protected systemPrompt: string;

  constructor(config: BaseAgentConfig) {
    this.name = config.name;
    this.systemPrompt = config.systemPrompt;
    
    this.model = new ChatAnthropic({
      modelName: config.model || "claude-3-sonnet-20240229",
      temperature: config.temperature || 0.7,
      maxTokens: config.maxTokens || 4096,
    });
  }

  /**
   * Execute the agent's task
   * @param state Current workflow state
   * @returns Updated workflow state
   */
  abstract execute(state: typeof StateAnnotation.State): Promise<typeof StateAnnotation.State>;

  /**
   * Send a message to the model and get a response
   */
  protected async chat(
    messages: BaseMessage[],
    options: { temperature?: number; maxTokens?: number } = {}
  ): Promise<AIMessage> {
    const response = await this.model.invoke([
      new HumanMessage(this.systemPrompt),
      ...messages,
    ], {
      temperature: options.temperature,
      maxTokens: options.maxTokens,
    });

    return response;
  }

  /**
   * Handle errors during execution
   */
  protected handleError(error: Error, state: typeof StateAnnotation.State) {
    console.error(`Error in ${this.name} agent:`, error);
    return {
      ...state,
      error,
      status: 'error',
      messages: [
        ...state.messages,
        new AIMessage(`Error in ${this.name} agent: ${error.message}`),
      ],
    };
  }
}

/**
 * Create a new agent graph
 */
export function createAgentGraph() {
  return new StateGraph(StateAnnotation);
}

/**
 * Create a memory saver for the agent graph
 */
export function createMemory() {
  return new MemorySaver();
}
