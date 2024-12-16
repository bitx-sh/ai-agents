import { Ollama } from "ollama";

const ollama = new Ollama({ host: "http://127.0.0.1:11434" });
const response = await ollama.chat({
  model: "mistral:latest",
  messages: [{ role: "user", content: "Why is the sky blue?" }],
});
