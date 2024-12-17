/**
 * @file CLI Entry Point
 * @module github-stars-ai
 */

import { defineCommand, runMain } from "citty";
import { consola } from "consola";
import { loadConfig } from "#config";
import { createWorkflow } from "#workflow";

const main = defineCommand({
  meta: {
    name: "github-stars-ai",
    version: "0.1.0",
    description: "AI-powered GitHub stars analyzer and code generator",
  },
  subCommands: {
    analyze: defineCommand({
      meta: {
        name: "analyze",
        description: "Analyze GitHub stars",
      },
      args: {
        username: {
          type: "string",
          description: "GitHub username",
          required: true,
        },
        request: {
          type: "string",
          description: "Analysis request/query",
          required: true,
        },
      },
      async run({ args }) {
        try {
          const config = await loadConfig("workflow");
          const workflow = createWorkflow(config);

          consola.info(`Starting analysis for user: ${args.username}`);

          const result = await workflow.execute({
            username: args.username,
            request: args.request,
          });

          if (result.error) {
            consola.error("Analysis failed:", result.error);
            process.exit(1);
          }

          consola.success("Analysis complete!");
          console.log(JSON.stringify(result.metadata, null, 2));
        } catch (error) {
          consola.error("Failed to execute workflow:", error);
          process.exit(1);
        }
      },
    }),

    generate: defineCommand({
      meta: {
        name: "generate",
        description: "Generate code based on analysis",
      },
      args: {
        username: {
          type: "string",
          description: "GitHub username",
          required: true,
        },
        request: {
          type: "string",
          description: "Generation request/query",
          required: true,
        },
        output: {
          type: "string",
          description: "Output directory",
          default: "./output",
        },
      },
      async run({ args }) {
        try {
          const config = await loadConfig("workflow");
          const workflow = createWorkflow(config);

          consola.info(`Starting code generation for user: ${args.username}`);

          const result = await workflow.execute({
            username: args.username,
            request: args.request,
          });

          if (result.error) {
            consola.error("Generation failed:", result.error);
            process.exit(1);
          }

          // Save generated code to output directory
          const { generatedCode } = result.metadata as any;
          if (generatedCode) {
            await saveGeneratedCode(args.output, generatedCode);
          }

          consola.success("Code generation complete!");
          consola.info(`Output saved to: ${args.output}`);
        } catch (error) {
          consola.error("Failed to execute workflow:", error);
          process.exit(1);
        }
      },
    }),
  },
});

// Run the CLI
runMain(main);
