import { z } from "zod";
import { ChatAnthropic } from "@langchain/anthropic";
import { BaseMessage, HumanMessage, AIMessage } from "@langchain/core/messages";
import { StateGraph, START, Command, interrupt, MemorySaver } from "@langchain/langgraph";
import { MessagesAnnotation } from "@langchain/langgraph";
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { AnthropicEmbeddings } from "@langchain/anthropic";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { tool } from "@langchain/core/tools";

// Define embeddings and vector store
const embeddings = new AnthropicEmbeddings({
    modelName: "claude-3-sonnet-20240229"
});

const vectorStore = await HNSWLib.fromDocuments(
    [], 
    embeddings,
    {
        space: "cosine",
        numDimensions: 1536
    }
);

// Document Processing Tools
const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200
});

// Document Loaders
const directoryLoader = new DirectoryLoader(
    "./documents",
    {
        ".json": (path) => new JSONLoader(path),
        ".txt": (path) => new TextLoader(path),
        ".pdf": (path) => new PDFLoader(path),
        ".csv": (path) => new CSVLoader(path)
    }
);

// Tool Definitions
const searchDocumentsTool = tool(async ({ query }) => {
    const results = await vectorStore.similaritySearch(query, 3);
    return results.map(doc => doc.pageContent).join("\n\n");
}, {
    name: "searchDocuments",
    description: "Search through available documents for relevant information",
    schema: z.object({
        query: z.string().describe("The search query to find relevant documents")
    })
});

const loadDocumentTool = tool(async ({ path }) => {
    const loader = directoryLoader.loaders.find(l => path.endsWith(l.fileExtension));
    if (!loader) throw new Error("Unsupported file type");
    const docs = await loader.load();
    const splitDocs = await textSplitter.splitDocuments(docs);
    await vectorStore.addDocuments(splitDocs);
    return `Loaded and indexed ${splitDocs.length} document chunks`;
}, {
    name: "loadDocument",
    description: "Load and index a new document",
    schema: z.object({
        path: z.string().describe("Path to the document to load")
    })
});

const tools = [searchDocumentsTool, loadDocumentTool];

// LLM Configuration
const model = new ChatAnthropic({
    modelName: "claude-3-sonnet-20240229",
    temperature: 0.7
}).bindTools(tools);

// Role Engineering Nodes
async function roleDesigner(
    state: typeof MessagesAnnotation.State
): Promise<Command> {
    const systemPrompt = `You are an AI Role Designer specialized in creating comprehensive AI agent roles.
    Use the available tools to:
    1. Search existing role templates
    2. Load new role definitions
    3. Create optimized role configurations
    
    If you need role optimization, go to 'roleOptimizer'.
    If you need role validation, go to 'roleValidator'.
    If you have completed the role design, return 'finish'.`;

    const messages = [
        { role: "system", content: systemPrompt },
        ...state.messages
    ] as BaseMessage[];

    const response = await model.invoke(messages);
    const aiMsg = { role: "ai", content: response.content, name: "roleDesigner" };

    let goto = "roleOptimizer";
    if (response.content.toLowerCase().includes("validate")) {
        goto = "roleValidator";
    } else if (response.content.toLowerCase().includes("complete")) {
        goto = "human";
    }

    return new Command({ goto, update: { messages: [aiMsg] } });
}

async function roleOptimizer(
    state: typeof MessagesAnnotation.State
): Promise<Command> {
    const systemPrompt = `You are an AI Role Optimizer focused on improving role definitions.
    Use the available tools to:
    1. Analyze existing role configurations
    2. Suggest optimizations
    3. Implement improvements
    
    If you need role validation, go to 'roleValidator'.
    If you need role redesign, go to 'roleDesigner'.
    If optimization is complete, return 'finish'.`;

    const messages = [
        { role: "system", content: systemPrompt },
        ...state.messages
    ] as BaseMessage[];

    const response = await model.invoke(messages);
    const aiMsg = { role: "ai", content: response.content, name: "roleOptimizer" };

    let goto = "roleValidator";
    if (response.content.toLowerCase().includes("redesign")) {
        goto = "roleDesigner";
    } else if (response.content.toLowerCase().includes("complete")) {
        goto = "human";
    }

    return new Command({ goto, update: { messages: [aiMsg] } });
}

async function roleValidator(
    state: typeof MessagesAnnotation.State
): Promise<Command> {
    const systemPrompt = `You are an AI Role Validator ensuring role quality and compliance.
    Use the available tools to:
    1. Validate role configurations
    2. Check compliance
    3. Verify functionality
    
    If you need optimization, go to 'roleOptimizer'.
    If you need redesign, go to 'roleDesigner'.
    If validation is complete, return 'finish'.`;

    const messages = [
        { role: "system", content: systemPrompt },
        ...state.messages
    ] as BaseMessage[];

    const response = await model.invoke(messages);
    const aiMsg = { role: "ai", content: response.content, name: "roleValidator" };

    let goto = "roleOptimizer";
    if (response.content.toLowerCase().includes("redesign")) {
        goto = "roleDesigner";
    } else if (response.content.toLowerCase().includes("complete")) {
        goto = "human";
    }

    return new Command({ goto, update: { messages: [aiMsg] } });
}

function humanNode(
    state: typeof MessagesAnnotation.State
): Command {
    const userInput: string = interrupt("Ready for user input.");

    let activeAgent: string | undefined;
    for (let i = state.messages.length - 1; i >= 0; i--) {
        if (state.messages[i].name) {
            activeAgent = state.messages[i].name;
            break;
        }
    }

    if (!activeAgent) {
        activeAgent = "roleDesigner";
    }

    return new Command({
        goto: activeAgent,
        update: {
            messages: [
                {
                    role: "human",
                    content: userInput,
                }
            ]
        }
    });
}

// Graph Configuration
const builder = new StateGraph(MessagesAnnotation)
    .addNode("roleDesigner", roleDesigner, {
        ends: ["roleOptimizer", "roleValidator", "human"]
    })
    .addNode("roleOptimizer", roleOptimizer, {
        ends: ["roleValidator", "roleDesigner", "human"]
    })
    .addNode("roleValidator", roleValidator, {
        ends: ["roleOptimizer", "roleDesigner", "human"]
    })
    .addNode("human", humanNode, {
        ends: ["roleDesigner", "roleOptimizer", "roleValidator", "human"]
    })
    .addEdge(START, "roleDesigner");

// Initialize memory and compile graph
const checkpointer = new MemorySaver();
const graph = builder.compile({ checkpointer });

// Example usage
async function run() {
    const initialMessage = new HumanMessage(
        "Create a new AI role for a Data Science Specialist with advanced analytics capabilities"
    );

    const finalState = await graph.invoke(
        { messages: [initialMessage] },
        { configurable: { thread_id: "role_engineering_session" } }
    );

    console.log("Final conversation state:", 
        finalState.messages[finalState.messages.length - 1].content
    );
}

run().catch(console.error);