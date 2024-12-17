import Anthropic from "@anthropic-ai/sdk";
import anthropicConfig from "./anthropic.config.json" with { type: "json" };

const anthropic = new Anthropic({
  // defaults to process.env["ANTHROPIC_API_KEY"]
  apiKey: process.env["ANTHROPIC_API_KEY"],
});

// Replace placeholders like {{AGENT_NAME}} with real values,
// because the SDK does not support variables.
const msg = await anthropic.messages.create(anthropicConfig);
console.log(msg);
