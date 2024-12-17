import Anthropic from "@anthropic-ai/sdk";
import anthropicConfig from "./anthropic.config.json" with { type: "json" };
//import { Bun } from "bun";
import Bun from "bun";
import { readdir, mkdir } from "node:fs/promises";

const agentRole = `TypeScript Engineering`;

let agents = [];

const anthropic = new Anthropic({
  // defaults to process.env["ANTHROPIC_API_KEY"]
  apiKey: process.env["ANTHROPIC_API_KEY"],
});

// Create directory if it doesn't exist
const dir = `../${agentRole}`;

anthropicConfig.messages.push({
  role: "user",
  content: [
    {
      type: "text",
      text: `Create a ${agentRole} Agent`,
    },
  ],
});

//console.log(JSON.stringify(anthropicConfig));

// Replace placeholders like {{AGENT_NAME}} with real values,
// because the SDK does not support variables.
const msg = await anthropic.messages.create(anthropicConfig);

anthropicConfig.messages.push(msg);

await Bun.write(`anthropic.config.json`, anthropicConfig);

const roles = msg.content
  .filter((content) => content.type === "text")
  .map((content) => content.text)
  .join("\n");

// Write the README file
await Bun.write(`${dir}/readme.md`, anthropicConfig, {
  createDirs: false,
});

console.log(msg);
