/**
 * @file Test Setup
 */

import { expect, beforeAll, afterAll } from "bun:test";
import { createWorkflow } from "#workflow";
import { loadConfig } from "#config";
import { MockGitHubClient } from "./mocks/github";
import { MockVectorStore } from "./mocks/vector-store";

// Extend expect for custom matchers
expect.extend({
  toBeValidState(received) {
    const isValid =
      received.status &&
      typeof received.metadata === "object" &&
      Array.isArray(received.messages);

    return {
      message: () => `expected ${received} to be a valid workflow state`,
      pass: isValid,
    };
  },
});

// Global test configuration
declare global {
  var testConfig: {
    workflow: ReturnType<typeof createWorkflow>;
    github: MockGitHubClient;
    vectorStore: MockVectorStore;
  };
}

beforeAll(async () => {
  // Load test configuration
  const config = await loadConfig({
    configFile: "config/test.config",
    validate: true,
  });

  // Initialize mocks
  const github = new MockGitHubClient();
  const vectorStore = new MockVectorStore();

  // Create workflow with mocks
  const workflow = createWorkflow({
    ...config,
    github,
    vectorStore,
  });

  // Set global test configuration
  globalThis.testConfig = {
    workflow,
    github,
    vectorStore,
  };
});

afterAll(async () => {
  // Cleanup
  await globalThis.testConfig.vectorStore.clear();
});
