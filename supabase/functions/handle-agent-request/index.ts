import "edge-runtime"

import { createReactAgent } from "npm:@langchain/langgraph/prebuilt"
import { supabase, unwrap } from "../_shared/supabase.ts"
import { buildSearchTool } from "../_shared/tools/searchTool.ts"
import { HumanMessage } from "npm:@langchain/core/messages"
import { corsHeaders } from "../_shared/cors.ts"
import { Database } from "../_shared/global/database.d.ts"
import { Message } from "../_shared/global/types.d.ts"
import { llm } from "../_shared/openai.ts"

type MessageInsertion = Database["public"]["Tables"]["messages"]["Insert"]

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })

  try {
    const { query, orgId, authorId } = await req.json()
    
    const finalState = await invokeAgent(query, orgId)
    const messages = await processAgentResponse(finalState, query, authorId)

    return new Response(JSON.stringify(messages), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error handling agent request:", error)
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})

async function invokeAgent(query: string, orgId: string) {
  const agent = createReactAgent({ llm, tools: [buildSearchTool(orgId)] })
  return await agent.invoke({ messages: [new HumanMessage(query)] })
}

async function processAgentResponse(finalState: any, query: string, authorId: number): Promise<Message[]> {
  const messagesToInsert: MessageInsertion[] = [{
    message_type: "USER",
    content: query,
    author_id: authorId
  }]

  for (let i = 0; i < finalState.messages.length - 1; i++) {
    const { name, content } = finalState.messages[i]
    if (name !== "findTickets") continue

    const tickets = JSON.parse(content)
    if (!Array.isArray(tickets)) continue
    
    for (const ticket of tickets) {
      messagesToInsert.push({
        message_type: "AGENT",
        ticket_id: ticket.id,
        author_id: authorId
      })
    }
  }

  const answer = finalState.messages[finalState.messages.length - 1]
  if (answer.content) {
    messagesToInsert.push({
      message_type: "AGENT",
      content: answer.content as string,
      author_id: authorId
    })
  }

  const messages = await supabase
    .from("messages")
    .insert(messagesToInsert)
    .select()
    .then(unwrap);

  return messages
}