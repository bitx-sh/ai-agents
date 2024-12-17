/**
 * @file Manager Agent Implementation
 * @module @github-stars-ai/agents/manager
 */

import { HumanMessage } from "@langchain/core/messages";
import { BaseAgent, BaseAgentConfig, StateAnnotation } from "./base";

export interface ManagerConfig extends BaseAgentConfig {
  planningPrompt?: string;
}

/**
 * Manager Agent responsible for coordinating the workflow
 */
export class ManagerAgent extends BaseAgent {
  private planningPrompt: string;

  constructor(config: ManagerConfig) {
    super({
      ...config,
      name: "manager",
      systemPrompt:
        config.systemPrompt ||
        `You are the lead architect of an AI development team analyzing GitHub repositories.
Your responsibilities:
1. Understanding and breaking down user requests
2. Creating detailed analysis plans
3. Coordinating specialized agents
4. Ensuring quality and coherence
5. Maintaining focus on user goals

Process each request methodically and create clear, actionable plans.`,
    });

    this.planningPrompt =
      config.planningPrompt ||
      `
Task: Analyze the following GitHub stars request and break it down into subtasks:
{request}

Consider:
1. Required repository data
2. Analysis parameters
3. Categorization criteria
4. Code extraction goals
5. Generation requirements

Provide a structured plan of action in JSON format with:
1. Subtasks array
2. Dependencies between tasks
3. Success criteria
4. Required resources
`;
  }

  async execute(state: typeof StateAnnotation.State) {
    try {
      const { request } = state.metadata as { request: string };

      // Create analysis plan
      const planResponse = await this.chat([
        new HumanMessage(this.planningPrompt.replace("{request}", request)),
      ]);

      // Parse and validate the plan
      const plan = JSON.parse(planResponse.content[0].text);

      return {
        ...state,
        status: "planning_complete",
        metadata: {
          ...state.metadata,
          plan,
        },
        messages: [...state.messages, planResponse],
      };
    } catch (error) {
      return this.handleError(error as Error, state);
    }
  }

  /**
   * Determine next step in the workflow
   */
  shouldContinue(state: typeof StateAnnotation.State) {
    const status = state.status;
    const plan = (state.metadata as any).plan;

    if (status === "error") {
      return "__end__";
    }

    switch (status) {
      case "planning_complete":
        return "retriever";
      case "retrieval_complete":
        return "analyzer";
      case "analysis_complete":
        return "generator";
      case "generation_complete":
        return "__end__";
      default:
        return "manager";
    }
  }
}
