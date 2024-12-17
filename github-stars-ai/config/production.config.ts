/**
 * @file Production Configuration
 */

import { defineConfig } from "#config";

export default defineConfig({
  env: "production",
  debug: false,
  vectorStore: {
    type: "typesense",
    typesense: {
      apiKey: process.env.TYPESENSE_API_KEY!,
      nodes: [
        {
          host: process.env.TYPESENSE_HOST!,
          port: parseInt(process.env.TYPESENSE_PORT || "8108", 10),
          protocol: process.env.TYPESENSE_PROTOCOL || "https",
        },
      ],
    },
  },
  agents: {
    manager: {
      temperature: 0.5,
    },
    retriever: {
      temperature: 0.5,
      maxConcurrency: 10,
    },
    analyzer: {
      temperature: 0.5,
    },
    generator: {
      temperature: 0.5,
    },
  },
  workflow: {
    maxRetries: 5,
    timeout: 600000,
    checkpointInterval: 120000,
  },
});
