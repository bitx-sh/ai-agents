import { z } from "zod";
import { resolve } from "path";
import { readFileSync, existsSync } from "fs";
import { ChatOpenAI } from "@langchain/openai";
import { BaseMessage } from "@langchain/core/messages";
import { PromptTemplate } from "@langchain/core/prompts";
import {
  MessagesAnnotation,
  StateGraph,
  START,
  Command,
  interrupt,
  MemorySaver,
} from "@langchain/langgraph";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";

// Schema definitions
const AgentInput = z.object({
  query: z.string(),
  context: z.record(z.any()).optional(),
  tools: z.array(z.any()).optional(),
});

const AgentOutput = z.object({
  response: z.string(),
  goto: z.string(),
  metadata: z.record(z.any()).optional(),
});

// Agent class definition
class Agent {
  private model: ChatOpenAI;
  private prompt: string;
  private memory: MemorySaver;
  private vectorstore: HNSWLib;
  private tools: any[];
  private dependencies: Map<string, Agent>;

  constructor(agentName: string) {
    // Load agent prompt file
    const promptPath = resolve(__dirname, `./agents/${agentName}/prompt.md`);
    if (!existsSync(promptPath)) {
      throw new Error(`Agent prompt not found: ${promptPath}`);
    }
    this.prompt = readFileSync(promptPath, "utf-8");

    // Initialize components
    this.model = new ChatOpenAI({ temperature: 0.7 });
    this.memory = new MemorySaver();
    this.tools = [];
    this.dependencies = new Map();

    // Initialize vector store
    const documents = [new Document({ pageContent: this.prompt })];
    HNSWLib.fromDocuments(documents, new OpenAIEmbeddings()).then(
      (vectorstore) => {
        this.vectorstore = vectorstore;
      },
    );
  }

  async processInput(state: typeof MessagesAnnotation.State): Promise<Command> {
    // Get relevant context from vector store
    const context = await this.vectorstore.similaritySearch(
      state.messages[state.messages.length - 1].content,
      1,
    );

    // Build messages array with context
    const messages = [
      { role: "system", content: this.prompt },
      ...state.messages,
      { role: "system", content: `Context: ${context[0].pageContent}` },
    ] as BaseMessage[];

    // Get available next nodes including dependencies
    const targetNodes = [...this.dependencies.keys()];
    targetNodes.push("human");

    // Call model with structured output
    const response = await this.model
      .withStructuredOutput(AgentOutput, {
        name: "Response",
      })
      .invoke(messages);

    // Create response message
    const aiMsg = {
      role: "assistant",
      content: response.response,
      name: this.constructor.name,
    };

    // Determine next node
    let goto = response.goto;
    if (goto === "finish") {
      goto = "human";
    }

    return new Command({
      goto,
      update: { messages: [aiMsg] },
    });
  }

  addTool(tool: any) {
    this.tools.push(tool);
  }

  addDependency(name: string, agent: Agent) {
    this.dependencies.set(name, agent);
  }
}

// Main agent loader
export function loadAgent(agentName = "default") {
  const agent = new Agent(agentName);

  const graph = new StateGraph(MessagesAnnotation)
    .addNode(agentName, agent.processInput.bind(agent), {
      ends: ["human", ...agent.dependencies.keys()],
    })
    .addNode(
      "human",
      (state) => {
        const input = interrupt("Ready for input");
        const lastMsg = state.messages[state.messages.length - 1];
        const activeAgent = lastMsg?.name || agentName;

        return new Command({
          goto: activeAgent,
          update: {
            messages: [
              {
                role: "human",
                content: input,
              },
            ],
          },
        });
      },
      {
        ends: [agentName, ...agent.dependencies.keys()],
      },
    )
    .addEdge(START, agentName)
    .compile({ checkpointer: agent.memory });

  return graph;
}

// CLI bootstrap
if (require.main === module) {
  const args = process.argv.slice(2);
  const agent = args.find(
    (arg) => arg.startsWith("-a=") || arg.startsWith("--agent="),
  );
  const agentName = agent ? agent.split("=")[1] : "default";

  const graph = loadAgent(agentName);
  graph.invoke(); // Start agent
}
