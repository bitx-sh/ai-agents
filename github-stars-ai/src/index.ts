/**
 * @file Enhanced CLI Implementation
 * @module github-stars-ai/cli
 */

import { defineCommand, runMain } from "citty";
import { consola } from "consola";
import { createSpinner } from "nanospinner";
import inquirer from "inquirer";
import chalk from "chalk";
import { loadConfig } from "packages/config";
import { createWorkflow } from "packages/workflow";
import { formatOutput } from "./formatting";
import { saveGeneratedCode } from "./utils";

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
        interactive: {
          type: "boolean",
          description: "Run in interactive mode",
          default: false,
        },
        format: {
          type: "string",
          description: "Output format (json, yaml, table)",
          default: "table",
        },
      },
      async run({ args }) {
        try {
          // Interactive mode
          if (args.interactive) {
            const answers = await inquirer.prompt([
              {
                type: "input",
                name: "username",
                message: "Enter GitHub username:",
                when: !args.username,
                validate: (input) => input.length > 0,
              },
              {
                type: "input",
                name: "request",
                message: "What would you like to analyze?",
                when: !args.request,
                validate: (input) => input.length > 0,
              },
              {
                type: "list",
                name: "format",
                message: "Choose output format:",
                choices: ["table", "json", "yaml"],
                when: !args.format,
              },
            ]);

            // Merge CLI args with interactive answers
            args = { ...args, ...answers };
          }

          const spinner = createSpinner("Loading configuration...").start();
          const config = await loadConfig("workflow");
          spinner.success();

          const workflow = createWorkflow(config);

          spinner.start("Analyzing GitHub stars...");
          const result = await workflow.execute({
            username: args.username,
            request: args.request,
          });

          if (result.error) {
            spinner.error({ text: chalk.red("Analysis failed!") });
            consola.error(result.error);
            process.exit(1);
          }

          spinner.success({ text: chalk.green("Analysis complete!") });

          // Format and display output
          console.log("\n" + formatOutput(result.metadata, args.format));
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
        interactive: {
          type: "boolean",
          description: "Run in interactive mode",
          default: false,
        },
      },
      async run({ args }) {
        try {
          // Interactive mode
          if (args.interactive) {
            const answers = await inquirer.prompt([
              {
                type: "input",
                name: "username",
                message: "Enter GitHub username:",
                when: !args.username,
                validate: (input) => input.length > 0,
              },
              {
                type: "input",
                name: "request",
                message: "What would you like to generate?",
                when: !args.request,
                validate: (input) => input.length > 0,
              },
              {
                type: "input",
                name: "output",
                message: "Output directory:",
                default: "./output",
                when: !args.output,
              },
            ]);

            // Merge CLI args with interactive answers
            args = { ...args, ...answers };
          }

          const spinner = createSpinner("Loading configuration...").start();
          const config = await loadConfig("workflow");
          spinner.success();

          const workflow = createWorkflow(config);

          spinner.start("Generating code...");
          const result = await workflow.execute({
            username: args.username,
            request: args.request,
          });

          if (result.error) {
            spinner.error({ text: chalk.red("Generation failed!") });
            consola.error(result.error);
            process.exit(1);
          }

          // Save generated code
          const { generatedCode } = result.metadata as any;
          if (generatedCode) {
            await saveGeneratedCode(args.output, generatedCode);
            spinner.success({
              text: chalk.green(
                `Code generated successfully! Output saved to: ${args.output}`,
              ),
            });
          }
        } catch (error) {
          consola.error("Failed to execute workflow:", error);
          process.exit(1);
        }
      },
    }),

    config: defineCommand({
      meta: {
        name: "config",
        description: "Manage configuration",
      },
      subCommands: {
        show: defineCommand({
          meta: {
            name: "show",
            description: "Show current configuration",
          },
          async run() {
            const config = await loadConfig();
            console.log(formatOutput(config, "yaml"));
          },
        }),
        // Add more config management commands
      },
    }),
  },
});

// Run the CLI
runMain(main);
