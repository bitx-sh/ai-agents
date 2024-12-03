import { END, START, StateGraph } from "@langchain/langgraph";

import type { BaseMessage } from "@langchain/core/messages";
import { Annotation } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";

const ResearchTeamState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
  }),
  team_members: Annotation<string[]>({
    reducer: (x, y) => x.concat(y),
  }),
  next: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "supervisor",
  }),
  instructions: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "Solve the human's question.",
  }),
});

const llm = new ChatOpenAI({ modelName: "gpt-4o" });

export const searchNode = (state: typeof ResearchTeamState.State) => {
  const messageModifier = agentMessageModifier(
    "You are a research assistant who can search for up-to-date info using the tavily search engine.",
    [tavilyTool],
    state.team_members ?? ["Search"],
  );
  const searchAgent = createReactAgent({
    llm,
    tools: [tavilyTool],
    messageModifier,
  });
  return runAgentNode({ state, agent: searchAgent, name: "Search" });
};

export const researchNode = (state: typeof ResearchTeamState.State) => {
  const messageModifier = agentMessageModifier(
    "You are a research assistant who can scrape specified urls for more detailed information using the scrapeWebpage function.",
    [scrapeWebpage],
    state.team_members ?? ["WebScraper"],
  );
  const researchAgent = createReactAgent({
    llm,
    tools: [scrapeWebpage],
    messageModifier,
  });
  return runAgentNode({ state, agent: researchAgent, name: "WebScraper" });
};

export const supervisorAgent = await createTeamSupervisor(
  llm,
  "You are a supervisor tasked with managing a conversation between the" +
    " following workers:  {team_members}. Given the following user request," +
    " respond with the worker to act next. Each worker will perform a" +
    " task and respond with their results and status. When finished," +
    " respond with FINISH.\n\n" +
    " Select strategically to minimize the number of steps taken.",
  ["Search", "WebScraper"],
);

export const researchGraph = new StateGraph(ResearchTeamState)
  .addNode("Search", searchNode)
  .addNode("supervisor", supervisorAgent)
  .addNode("WebScraper", researchNode)
  // Define the control flow
  .addEdge("Search", "supervisor")
  .addEdge("WebScraper", "supervisor")
  .addConditionalEdges("supervisor", (x) => x.next, {
    Search: "Search",
    WebScraper: "WebScraper",
    FINISH: END,
  })
  .addEdge(START, "supervisor");

export const researchChain = researchGraph.compile();
