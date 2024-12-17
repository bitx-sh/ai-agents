import { PromptTemplate } from "@langchain/core/prompts";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import {
  BaseOutputParser,
  StructuredOutputParser,
} from "@langchain/core/output_parsers";
import { Anthropic } from "@langchain/anthropic";
import { Ollama } from "@langchain/community/llms/ollama";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { Document } from "@langchain/core/documents";
import { ChatMessageHistory } from "langchain/stores/message/in_memory";
import { FileSystemChatMessageHistory } from "@langchain/community/stores/message/file";
import * as fs from "fs";
import * as path from "path";

// Load prompt from markdown file
const promptContent = fs.readFileSync(
  path.join(__dirname, `./agents/${agent}/readme.md`),
  "utf8",
);

const promptTemplate = PromptTemplate.fromTemplate(promptContent);

// Configure model
const model = process.env.USE_OLLAMA
  ? new Ollama({ model: "llama2" })
  : new Anthropic({ modelName: "claude-3-sonnet-20240229" });

// Setup memory and history
const history = process.env.PERSIST_HISTORY
  ? new FileSystemChatMessageHistory({ filePath: "./chat_history.json" })
  : new ChatMessageHistory();

// Configure vector store
const vectorStore = new MemoryVectorStore();
const directoryLoader = new DirectoryLoader("./data", {
  recursive: true,
});

// Load documents
const docs = await directoryLoader.load();
await vectorStore.addDocuments(docs);

// Custom function calling
const customFunction = async (input: string) => {
  // Implementation here
  return "function result";
};

// Setup structured output parser
const parser = StructuredOutputParser.fromNamesAndDescriptions({
  answer: "The final answer",
  reasoning: "The reasoning process",
});

// Create messages
const messages = [
  new SystemMessage(promptTemplate.format({ context: "system context" })),
  new HumanMessage("User input here"),
];

// Generate streaming response
const stream = await model.stream(messages);
for await (const chunk of stream) {
  process.stdout.write(chunk);
}

// Process with RAG
const relevantDocs = await vectorStore.similaritySearch("query");
const ragResponse = await model.invoke([
  ...messages,
  new SystemMessage(
    `Additional context: ${relevantDocs.map((d) => d.pageContent).join("\n")}`,
  ),
]);
