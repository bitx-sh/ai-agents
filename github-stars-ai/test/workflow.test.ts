/**
 * @file Workflow Tests
 */

import { describe, expect, it } from "bun:test";
import { createWorkflow } from "#workflow";

describe("GitHub Stars Workflow", () => {
  it("should analyze repositories successfully", async () => {
    const { workflow } = globalThis.testConfig;

    const result = await workflow.execute({
      username: "test-user",
      request: "Analyze TypeScript utilities",
    });

    expect(result).toBeValidState();
    expect(result.status).toBe("analysis_complete");
    expect(result.error).toBeNull();
  });

  it("should generate code based on analysis", async () => {
    const { workflow } = globalThis.testConfig;

    const result = await workflow.execute({
      username: "test-user",
      request: "Generate a TypeScript utility library",
    });

    expect(result).toBeValidState();
    expect(result.status).toBe("generation_complete");
    expect(result.metadata).toHaveProperty("generatedCode");
  });

  it("should handle errors gracefully", async () => {
    const { workflow, github } = globalThis.testConfig;

    // Simulate error
    github.setMockRepos([]);

    const result = await workflow.execute({
      username: "non-existent-user",
      request: "Invalid request",
    });

    expect(result).toBeValidState();
    expect(result.status).toBe("error");
    expect(result.error).toBeTruthy();
  });
});
