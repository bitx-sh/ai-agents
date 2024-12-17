import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { ChatAnthropic } from "@langchain/anthropic";
import {
  MemorySaver,
  Annotation,
  messagesStateReducer,
} from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";

//import { createClient } from "@anthropic-ai/sdk";

import { type DefineConfig, loadConfig } from "c12";

import { createContext, useContext } from "unctx";
import { StateGraph } from "@langchain/langgraph";
import { Octokit } from "@octokit/rest";
import { createUnplugin } from "unplugin";

// Create contexts for configuration and API clients
const configContext = createContext("config");
const anthropicContext = createContext("anthropic");
const githubContext = createContext("github");

// Configuration plugin
const configPlugin = createUnplugin((options = {}) => ({
  name: "config-loader",
  async setup(build) {
    const configs = {};
    for (const agent of ["manager", "retriever", "analyzer", "generator"]) {
      configs[agent] = await loadConfig({
        name: agent,
        configFile: `config/${agent}.config`,
        defaults: {
          model: "claude-3-opus-20240229",
          temperature: 0.7,
          maxTokens: 4096,
        },
      });
    }
    configContext.set(configs);
  },
}));

// GitHub API Client
class GitHubAPI {
  constructor(token) {
    this.octokit = new Octokit({ auth: token });
  }

  async getStarredRepos(username, options = {}) {
    const { maxPages = 10, perPage = 100 } = options;
    let repos = [];
    let page = 1;

    while (page <= maxPages) {
      const response = await this.octokit.activity.listReposStarredByUser({
        username,
        per_page: perPage,
        page,
      });

      if (response.data.length === 0) break;

      const repoData = await Promise.all(
        response.data.map(async (repo) => {
          const readme = await this.getReadme(repo.full_name).catch(() => null);
          const languages = await this.getLanguages(repo.full_name);

          return {
            id: repo.id,
            name: repo.name,
            fullName: repo.full_name,
            description: repo.description,
            url: repo.html_url,
            stars: repo.stargazers_count,
            topics: repo.topics || [],
            language: repo.language,
            languages,
            readme,
            updatedAt: repo.updated_at,
            createdAt: repo.created_at,
          };
        }),
      );

      repos = repos.concat(repoData);
      page++;
    }

    return repos;
  }

  async getReadme(repoFullName) {
    try {
      const { data } = await this.octokit.repos.getReadme({
        owner: repoFullName.split("/")[0],
        repo: repoFullName.split("/")[1],
      });
      return Buffer.from(data.content, "base64").toString("utf8");
    } catch (error) {
      return null;
    }
  }

  async getLanguages(repoFullName) {
    const { data } = await this.octokit.repos.listLanguages({
      owner: repoFullName.split("/")[0],
      repo: repoFullName.split("/")[1],
    });
    return data;
  }
}

// Base Agent class with Claude integration
class ClaudeAgent extends Agent {
  constructor(name) {
    super({ name });
    const config = configContext.use()[name];
    this.claude = anthropicContext.use();
    this.systemPrompt = config.systemPrompt;
  }

  async chat(messages) {
    const config = configContext.use()[this.name];
    return await this.claude.messages.create({
      model: config.model,
      temperature: config.temperature,
      max_tokens: config.maxTokens,
      messages: [{ role: "system", content: this.systemPrompt }, ...messages],
    });
  }
}

// Manager Agent Implementation
class ManagerAgent extends ClaudeAgent {
  constructor() {
    super("manager");
  }

  async execute(state) {
    const response = await this.chat([
      {
        role: "user",
        content: `Task: Analyze the following request and break it down into subtasks:
      ${state.request}

      Consider:
      1. Required data retrieval
      2. Analysis parameters
      3. Generation goals

      Provide a structured plan of action.`,
      },
    ]);

    return {
      ...state,
      plan: JSON.parse(response.content[0].text),
      status: "planning_complete",
    };
  }
}

// Retriever Agent Implementation
class RetrieverAgent extends ClaudeAgent {
  constructor(githubAPI) {
    super("retriever");
    this.github = githubAPI;
  }

  async execute(state) {
    const { username } = state.request;
    const repos = await this.github.getStarredRepos(username);

    const response = await this.chat([
      {
        role: "user",
        content: `Review and organize the following GitHub repositories:
      ${JSON.stringify(repos, null, 2)}

      Create an initial classification based on:
      1. Primary programming languages
      2. Project types
      3. Domain categories

      Return a structured JSON object with your analysis.`,
      },
    ]);

    return {
      ...state,
      repos,
      initialClassification: JSON.parse(response.content[0].text),
      status: "retrieval_complete",
    };
  }
}

// Analyzer Agent Implementation
class AnalyzerAgent extends ClaudeAgent {
  constructor() {
    super("analyzer");
  }

  async execute(state) {
    const { repos, initialClassification } = state;

    const response = await this.chat([
      {
        role: "user",
        content: `Perform deep analysis of these repositories:
      ${JSON.stringify({ repos, initialClassification }, null, 2)}

      Focus on:
      1. Code patterns and architectural approaches
      2. Common implementation strategies
      3. Best practices and unique solutions
      4. Dependencies and technology stacks

      Extract reusable patterns and create a knowledge base.`,
      },
    ]);

    const analysis = JSON.parse(response.content[0].text);

    return {
      ...state,
      analysis,
      status: "analysis_complete",
    };
  }

  async extractCodeExamples(repo) {
    const response = await this.chat([
      {
        role: "user",
        content: `Extract and categorize notable code examples from this repository:
      ${JSON.stringify(repo, null, 2)}

      Focus on:
      1. Core functionality implementations
      2. Interesting design patterns
      3. Unique problem solutions
      4. Reusable components

      Return a structured collection of code examples with explanations.`,
      },
    ]);

    return JSON.parse(response.content[0].text);
  }
}

// Generator Agent Implementation
class GeneratorAgent extends ClaudeAgent {
  constructor() {
    super("generator");
  }

  async execute(state) {
    const { analysis, request } = state;

    const response = await this.chat([
      {
        role: "user",
        content: `Generate new code based on the following analysis and request:
      Analysis: ${JSON.stringify(analysis, null, 2)}
      Request: ${JSON.stringify(request, null, 2)}

      Requirements:
      1. Follow identified patterns and best practices
      2. Incorporate modern development approaches
      3. Include comprehensive documentation
      4. Structure code for maintainability

      Generate a complete solution including directory structure, core files, and implementation details.`,
      },
    ]);

    return {
      ...state,
      generatedCode: JSON.parse(response.content[0].text),
      status: "generation_complete",
    };
  }
}

// Example configuration files
const managerConfig = defineConfig({
  systemPrompt: `You are the lead architect of an AI development team, responsible for:
  1. Understanding and breaking down complex development requests
  2. Creating detailed technical specifications
  3. Coordinating work between specialized AI agents
  4. Ensuring architectural consistency and best practices
  5. Maintaining focus on user requirements and goals

  Process each request methodically and create clear, actionable plans.`,
});

const retrieverConfig = defineConfig({
  systemPrompt: `You are a GitHub repository analyst responsible for:
  1. Efficiently retrieving repository data
  2. Initial classification and organization
  3. Identifying key metadata and characteristics
  4. Preparing data for detailed analysis

  Focus on extracting meaningful patterns and relationships between repositories.`,
});

const analyzerConfig = defineConfig({
  systemPrompt: `You are an expert code analyst responsible for:
  1. Deep analysis of repository contents
  2. Pattern recognition and categorization
  3. Best practice identification
  4. Knowledge base creation

  Your analysis should focus on reusable patterns and architectural insights.`,
});

const generatorConfig = defineConfig({
  systemPrompt: `You are an expert code generator responsible for:
  1. Creating new code based on analyzed patterns
  2. Implementing modern best practices
  3. Ensuring code quality and maintainability
  4. Providing comprehensive documentation

  Generate code that reflects the best aspects of analyzed repositories while maintaining innovation.`,
});

// Workflow creation and execution
export function createGitHubTeam(anthropicApiKey, githubToken) {
  const anthropic = createClient(anthropicApiKey);
  const github = new GitHubAPI(githubToken);

  anthropicContext.set(anthropic);
  githubContext.set(github);

  const manager = new ManagerAgent();
  const retriever = new RetrieverAgent(github);
  const analyzer = new AnalyzerAgent();
  const generator = new GeneratorAgent();

  const graph = new StateGraph({
    channels: ["main", "error"],
  });

  graph
    .addNode("manager", manager)
    .addNode("retriever", retriever)
    .addNode("analyzer", analyzer)
    .addNode("generator", generator);

  graph
    .addEdge("manager", "retriever")
    .addEdge("retriever", "analyzer")
    .addEdge("analyzer", "generator")
    .addEdge("generator", "manager");

  return graph;
}

export async function executeGitHubAnalysis(username, request) {
  const workflow = createGitHubTeam(
    process.env.ANTHROPIC_API_KEY,
    process.env.GITHUB_TOKEN,
  );

  const initialState = {
    username,
    request,
    status: "initiated",
  };

  return await workflow.execute(initialState);
}