import "edge-runtime"

import { createReactAgent } from "npm:@langchain/langgraph/prebuilt"
import { buildSearchTool } from "../_shared/tools/searchTool.ts"
import { HumanMessage } from "npm:@langchain/core/messages"
import { corsHeaders } from "../_shared/cors.ts"
import { llm } from "../_shared/openai.ts"

// TODO: derive this from the request once frontend supports it
const ORG_ID = "7e7a9db6-d2bc-44a4-95b1-21df9400b7a7"

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })

  const { query } = await req.json()

  const agent = createReactAgent({ llm, tools: [buildSearchTool(ORG_ID)] })

  const agentFinalState = await agent.invoke({ messages: [new HumanMessage(query)] })
  const reply = agentFinalState.messages[agentFinalState.messages.length - 1].content

  return new Response(reply as string, {
    headers: { ...corsHeaders, "Content-Type": "text/plain" },
  })
})