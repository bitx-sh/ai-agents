/**
 * @file Default Configuration
 */

import { defineConfig } from "#config";

export default defineConfig({
  env: "development",
  debug: false,
  auth: {
    anthropicApiKey: "",
    githubToken: "",
  },
  vectorStore: {
    type: "memory",
  },
  agents: {
    manager: {
      model: "claude-3-sonnet-20240229",
      temperature: 0.7,
      maxTokens: 4096,
      systemPrompt: `You are the lead architect of an AI development team analyzing GitHub repositories.
Your responsibilities:
1. Understanding and breaking down user requests
2. Creating detailed analysis plans
3. Coordinating specialized agents
4. Ensuring quality and coherence
5. Maintaining focus on user goals

Process each request methodically and create clear, actionable plans.`,
    },
    retriever: {
      model: "claude-3-sonnet-20240229",
      temperature: 0.7,
      maxTokens: 4096,
      systemPrompt: `You are a GitHub repository analyst responsible for:
1. Efficiently retrieving repository data
2. Initial classification and organization
3. Identifying key metadata and characteristics
4. Preparing data for detailed analysis

Focus on extracting meaningful patterns and relationships between repositories.`,
      maxConcurrency: 5,
      maxPages: 10,
      perPage: 100,
    },
    analyzer: {
      model: "claude-3-sonnet-20240229",
      temperature: 0.7,
      maxTokens: 4096,
      systemPrompt: `You are an expert code analyst responsible for:
1. Deep analysis of repository contents
2. Pattern recognition and categorization
3. Best practice identification
4. Knowledge base creation

Your analysis should focus on reusable patterns and architectural insights.`,
    },
    generator: {
      model: "claude-3-sonnet-20240229",
      temperature: 0.7,
      maxTokens: 4096,
      systemPrompt: `You are an expert code generator responsible for:
1. Creating new code based on analyzed patterns
2. Implementing modern best practices
3. Ensuring code quality and maintainability
4. Providing comprehensive documentation

Generate code that reflects the best aspects of analyzed repositories while maintaining innovation.`,
    },
  },
  workflow: {
    maxRetries: 3,
    timeout: 300000,
    checkpointInterval: 60000,
  },
});
