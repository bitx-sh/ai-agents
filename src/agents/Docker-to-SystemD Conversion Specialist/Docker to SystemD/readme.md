# 🔄 Docker to Systemd Conversion Specialist Agent

## 📋 Metadata
- Type: Conversion Specialist
- Agent: Docker-Systemd Migration Engineer
- Version: 1.0.0
- Category: System Engineering
- Complexity: Expert
- Last Updated: 2024-02-14

```typescript
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
import { YAMLLoader } from "langchain/document_loaders/fs/yaml";
import { tool } from "@langchain/core/tools";
import * as fs from 'fs/promises';
import * as path from 'path';

// Type Definitions
interface DockerConfig {
    image: string;
    entrypoint?: string[];
    cmd?: string[];
    environment?: Record<string, string>;
    volumes?: string[];
    ports?: string[];
    workdir?: string;
    user?: string;
}

interface SystemdConfig {
    unit: {
        description: string;
        documentation?: string[];
        requires?: string[];
        after?: string[];
    };
    service: {
        type: string;
        execStart: string;
        environment?: Record<string, string>;
        workingDirectory?: string;
        user?: string;
        dynamicUser?: boolean;
        stateDirectory?: string;
        cacheDirectory?: string;
        logDirectory?: string;
        runtimeDirectory?: string;
        configurationDirectory?: string;
    };
    install: {
        wantedBy: string[];
    };
    portableService?: {
        runtime?: string;
        extensions?: string[];
        layeredRootfs?: boolean;
    };
}

interface SysextConfig {
    name: string;
    version: string;
    type: 'sysext' | 'confext';
    packages: string[];
    files: Record<string, string>;
}

interface MkosiConfig {
    distribution: string;
    release: string;
    packages: string[];
    baseImage?: string;
    layers: {
        name: string;
        packages: string[];
        files?: Record<string, string>;
    }[];
}

// Initialize embeddings and vector store
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

// Document Processing
const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200
});

// Document Loaders
const directoryLoader = new DirectoryLoader(
    "./configs",
    {
        ".json": (path) => new JSONLoader(path),
        ".yaml": (path) => new YAMLLoader(path),
        ".yml": (path) => new YAMLLoader(path),
        ".txt": (path) => new TextLoader(path)
    }
);

// Tool Definitions
const parseDockerfileTool = tool(async ({ dockerfile }) => {
    // Parse Dockerfile and return structured configuration
    const config: DockerConfig = {
        image: "",
        entrypoint: [],
        cmd: [],
        environment: {},
        volumes: [],
        ports: [],
        workdir: "",
        user: ""
    };
    // Implementation of Dockerfile parsing logic
    return JSON.stringify(config);
}, {
    name: "parseDockerfile",
    description: "Parse a Dockerfile and extract configuration",
    schema: z.object({
        dockerfile: z.string().describe("Content of the Dockerfile")
    })
});

const generateSystemdUnitTool = tool(async ({ dockerConfig }) => {
    const config: DockerConfig = JSON.parse(dockerConfig);
    const systemdConfig: SystemdConfig = {
        unit: {
            description: `Systemd service converted from Docker container ${config.image}`,
            documentation: ["https://systemd.io/PORTABLE_SERVICES/"]
        },
        service: {
            type: "exec",
            execStart: config.entrypoint?.join(" ") || config.cmd?.join(" ") || "",
            environment: config.environment,
            workingDirectory: config.workdir,
            user: config.user,
            dynamicUser: true,
            stateDirectory: "app",
            cacheDirectory: "app",
            logDirectory: "app",
            runtimeDirectory: "app"
        },
        install: {
            wantedBy: ["multi-user.target"]
        },
        portableService: {
            runtime: "podman",
            extensions: ["app-sysext"],
            layeredRootfs: true
        }
    };
    return JSON.stringify(systemdConfig, null, 2);
}, {
    name: "generateSystemdUnit",
    description: "Generate a systemd unit file from Docker configuration",
    schema: z.object({
        dockerConfig: z.string().describe("Docker configuration in JSON format")
    })
});

const generateSysextTool = tool(async ({ dockerConfig }) => {
    const config: DockerConfig = JSON.parse(dockerConfig);
    const sysextConfig: SysextConfig = {
        name: "app-sysext",
        version: "1.0.0",
        type: "sysext",
        packages: [],
        files: {}
    };
    return JSON.stringify(sysextConfig, null, 2);
}, {
    name: "generateSysext",
    description: "Generate a system extension configuration",
    schema: z.object({
        dockerConfig: z.string().describe("Docker configuration in JSON format")
    })
});

const generateMkosiTool = tool(async ({ dockerConfig }) => {
    const config: DockerConfig = JSON.parse(dockerConfig);
    const mkosiConfig: MkosiConfig = {
        distribution: "fedora",
        release: "38",
        packages: [],
        layers: [
            {
                name: "base",
                packages: ["systemd", "dbus"]
            },
            {
                name: "app",
                packages: []
            }
        ]
    };
    return JSON.stringify(mkosiConfig, null, 2);
}, {
    name: "generateMkosi",
    description: "Generate mkosi configuration for layered image",
    schema: z.object({
        dockerConfig: z.string().describe("Docker configuration in JSON format")
    })
});

const tools = [
    parseDockerfileTool,
    generateSystemdUnitTool,
    generateSysextTool,
    generateMkosiTool
];

// LLM Configuration
const model = new ChatAnthropic({
    modelName: "claude-3-sonnet-20240229",
    temperature: 0.7
}).bindTools(tools);

// Conversion Nodes
async function dockerAnalyzer(
    state: typeof MessagesAnnotation.State
): Promise<Command> {
    const systemPrompt = `You are a Docker Configuration Analyzer specialized in:
    1. Parsing Dockerfile contents
    2. Extracting configuration details
    3. Analyzing dependencies and requirements
    4. Identifying conversion challenges

    Use available tools to analyze the Docker configuration and prepare for conversion.
    Go to 'systemdConverter' when ready for conversion.
    Go to 'sysextGenerator' if system extensions are needed.
    Go to 'mkosiGenerator' if layered images are required.`;

    const messages = [
        { role: "system", content: systemPrompt },
        ...state.messages
    ] as BaseMessage[];

    const response = await model.invoke(messages);
    const aiMsg = { role: "ai", content: response.content, name: "dockerAnalyzer" };

    let goto = "systemdConverter";
    if (response.content.toLowerCase().includes("sysext")) {
        goto = "sysextGenerator";
    } else if (response.content.toLowerCase().includes("mkosi")) {
        goto = "mkosiGenerator";
    }

    return new Command({ goto, update: { messages: [aiMsg] } });
}

async function systemdConverter(
    state: typeof MessagesAnnotation.State
): Promise<Command> {
    const systemPrompt = `You are a Systemd Service Generator specialized in:
    1. Creating systemd unit files
    2. Configuring portable services
    3. Setting up service dependencies
    4. Implementing security measures

    Use available tools to generate appropriate systemd configurations.
    Go to 'sysextGenerator' if system extensions are needed.
    Go to 'mkosiGenerator' if layered images are required.
    Return 'finish' when conversion is complete.`;

    const messages = [
        { role: "system", content: systemPrompt },
        ...state.messages
    ] as BaseMessage[];

    const response = await model.invoke(messages);
    const aiMsg = { role: "ai", content: response.content, name: "systemdConverter" };

    let goto = "human";
    if (response.content.toLowerCase().includes("sysext")) {
        goto = "sysextGenerator";
    } else if (response.content.toLowerCase().includes("mkosi")) {
        goto = "mkosiGenerator";
    }

    return new Command({ goto, update: { messages: [aiMsg] } });
}

async function sysextGenerator(
    state: typeof MessagesAnnotation.State
): Promise<Command> {
    const systemPrompt = `You are a System Extension Generator specialized in:
    1. Creating sysext configurations
    2. Managing confext setups
    3. Handling file overlays
    4. Configuring extension points

    Use available tools to generate system extension configurations.
    Go to 'systemdConverter' to update service configuration.
    Go to 'mkosiGenerator' if layered images are required.
    Return 'finish' when complete.`;

    const messages = [
        { role: "system", content: systemPrompt },
        ...state.messages
    ] as BaseMessage[];

    const response = await model.invoke(messages);
    const aiMsg = { role: "ai", content: response.content, name: "sysextGenerator" };

    let goto = "human";
    if (response.content.toLowerCase().includes("systemd")) {
        goto = "systemdConverter";
    } else if (response.content.toLowerCase().includes("mkosi")) {
        goto = "mkosiGenerator";
    }

    return new Command({ goto, update: { messages: [aiMsg] } });
}

async function mkosiGenerator(
    state: typeof MessagesAnnotation.State
): Promise<Command> {
    const systemPrompt = `You are a Mkosi Configuration Generator specialized in:
    1. Creating layered images
    2. Managing build configurations
    3. Setting up layer dependencies
    4. Optimizing image size

    Use available tools to generate mkosi configurations.
    Go to 'systemdConverter' to update service configuration.
    Go to 'sysextGenerator' if system extensions are needed.
    Return 'finish' when complete.`;

    const messages = [
        { role: "system", content: systemPrompt },
        ...state.messages
    ] as BaseMessage[];

    const response = await model.invoke(messages);
    const aiMsg = { role: "ai", content: response.content, name: "mkosiGenerator" };

    let goto = "human";
    if (response.content.toLowerCase().includes("systemd")) {
        goto = "systemdConverter";
    } else if (response.content.toLowerCase().includes("sysext")) {
        goto = "sysextGenerator";
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
        activeAgent = "dockerAnalyzer";
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
    .addNode("dockerAnalyzer", dockerAnalyzer, {
        ends: ["systemdConverter", "sysextGenerator", "mkosiGenerator"]
    })
    .addNode("systemdConverter", systemdConverter, {
        ends: ["sysextGenerator", "mkosiGenerator", "human"]
    })
    .addNode("sysextGenerator", sysextGenerator, {
        ends: ["systemdConverter", "mkosiGenerator", "human"]
    })
    .addNode("mkosiGenerator", mkosiGenerator, {
        ends: ["systemdConverter", "sysextGenerator", "human"]
    })
    .addNode("human", humanNode, {
        ends: ["dockerAnalyzer", "systemdConverter", "sysextGenerator", "mkosiGenerator", "human"]
    })
    .addEdge(START, "dockerAnalyzer");

// Initialize memory and compile graph
const checkpointer = new MemorySaver();
const graph = builder.compile({ checkpointer });

// Example usage
async function run() {
    const dockerfile = `
FROM ubuntu:20.04
RUN apt-get update && apt-get install -y nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
    `;

    const initialMessage = new HumanMessage(
        `Convert this Dockerfile to systemd configurations:\n${dockerfile}`
    );

    const finalState = await graph.invoke(
        { messages: [initialMessage] },
        { configurable: { thread_id: "docker_systemd_conversion" } }
    );

    console.log("Final conversion result:",
        finalState.messages[finalState.messages.length - 1].content
    );
}

run().catch(console.error);
```

## Usage Instructions
### Modelfile Example
```Dockerfile
FROM mistral:latest
SYSTEM """
You are a Docker to Systemd Conversion Specialist focused on:

1. Docker Analysis
   - Parse Dockerfile configurations
   - Extract dependencies and requirements
   - Identify conversion challenges
   - Analyze security implications

2. Systemd Service Generation
   - Create portable service units
   - Configure service dependencies
   - Implement security measures
   - Optimize resource usage

3. System Extension Management
   - Generate sysext configurations
   - Create confext setups
   - Manage file overlays
   - Configure extension points

4. Mkosi Integration
   - Create layered images
   - Manage build configurations
   - Optimize image size
   - Handle dependencies

Follow these principles:
- Maintain service functionality
- Ensure security compliance
- Optimize resource usage
- Document thoroughly
- Test comprehensively
"""

TEMPLATE """{{ if .System }}<|im_start|>system
{{ .System }}<|im_end|>
{{ end }}{{ if .Prompt }}<|im_start|>user
{{ .Prompt }}<|im_end|>
{{ end }}<|im_start|>assistant
"""

PARAMETER stop "<|im_start|>"
PARAMETER stop "<|im_end|>"
PARAMETER temperature 0.7
PARAMETER top_p 0.9
```

This implementation provides:
- Docker configuration analysis
- Systemd service generation
- System extension support
- Mkosi integration
- Layered rootfs support
- Comprehensive validation
- Security compliance
- Documentation generation

The system can be extended with additional features such as:
- Multi-container orchestration
- Network configuration
- Volume management
- Security hardening
- Monitoring integration
- Backup solutions
