import "edge-runtime"

import { createReactAgent } from "npm:@langchain/langgraph/prebuilt"
import { buildSearchTool } from "../_shared/tools/searchTool.ts"
import { HumanMessage } from "npm:@langchain/core/messages"
import { corsHeaders } from "../_shared/cors.ts"
import { llm } from "../_shared/openai.ts"

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })

  const { query, orgId } = await req.json()

  const agent = createReactAgent({ llm, tools: [buildSearchTool(orgId)] })

  const agentFinalState = await agent.invoke({ messages: [new HumanMessage(query)] })
  // console.log(agentFinalState.messages)
  const messages: any[] = []
  
  // Process messages to find ticket tool messages
  for (let i = 0; i < agentFinalState.messages.length - 1; i++) {
    const { name, content } = agentFinalState.messages[i]
    if (name !== 'findTickets') continue

    const tickets = JSON.parse(content)
    if (!Array.isArray(tickets)) continue
    
    tickets.forEach(ticket => {
      messages.push({
        type: 'ticket',
        content: ticket,
        role: 'assistant'
      })
    })
  }

  // Add final response message
  const finalMessage = agentFinalState.messages[agentFinalState.messages.length - 1]
  if (finalMessage.content) {
    messages.push({
      type: 'text',
      content: finalMessage.content,
      role: 'assistant'
    })
  }

  return new Response(JSON.stringify(messages), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  })
})