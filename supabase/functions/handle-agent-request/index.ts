import "edge-runtime"

import { BaseMessage, HumanMessage, AIMessage, SystemMessage } from "npm:@langchain/core/messages"
import { StateGraph, MessagesAnnotation } from "npm:@langchain/langgraph";
import { buildEditTicketTool } from "../_shared/tools/editTicketTool.ts"
import { supabase, unwrap } from "../_shared/supabase.ts"
import { buildSearchTool } from "../_shared/tools/searchTool.ts"
import { corsHeaders } from "../_shared/cors.ts"
import { ToolNode } from "npm:@langchain/langgraph/prebuilt";
import { Database } from "../_shared/global/database.d.ts"
import { Message } from "../_shared/global/types.d.ts"
import { llm } from "../_shared/openai.ts"

type MessageInsertion = Database["public"]["Tables"]["messages"]["Insert"]

const SYSTEM_PROMPT = `You are a ticket management chat agent with semantic ticket search capabilities. For any query about tickets, use your search tool to find and summarize relevant information. 
If no results are found, clearly state this to the user.
In your final response, DO NOT REPEAT ticket details that result from the search tool; ONLY reference ticket subjects when necessary. Focus on providing analysis, insights, and answering the user's specific questions about the tickets.`

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })

  try {
    // TODO: derive authorId from session
    const { query, orgId, authorId } = await req.json()
    
    const messages = await initMessages(authorId, query)
    const app = createWorkflow(orgId);
    
    const finalState = await app.invoke({ messages });
    const processedMessages = await processAgentResponse(finalState.messages, query, authorId)

    return new Response(JSON.stringify(processedMessages), {
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

function createWorkflow(orgId: string) {
  // TODO: consider adding a 'time' tool because the agent operates in utc and doesn't know the current date
  const tools = [buildSearchTool(orgId), buildEditTicketTool(orgId)];
  const toolNode = new ToolNode(tools);
  
  const modelWithTools = llm.bind({ tools });
  
  async function callModel(state: typeof MessagesAnnotation.State) {
    const response = await modelWithTools.invoke(state.messages);
    return { messages: [response] };
  }
  
  const workflow = new StateGraph(MessagesAnnotation)
    .addNode("agent", callModel)
    .addEdge("__start__", "agent")
    .addNode("tools", toolNode)
    .addEdge("tools", "agent")
    .addConditionalEdges("agent", shouldContinue);
    
  return workflow.compile();
}

function shouldContinue({ messages }: typeof MessagesAnnotation.State) {
  const lastMessage = messages[messages.length - 1];
  
  if (lastMessage.additional_kwargs.tool_calls) 
    return "tools";

  return "__end__";
}

async function initMessages(authorId: number, query: string) {
  const messages = await supabase
    .from('messages')
    .select('*, tickets(id, parent_id, status, priority, subject, description, created_at, updated_at, due_at)')
    .eq('author_id', authorId)
    .in('message_type', ['USER', 'AGENT'])
    .order('id', { ascending: true })
    .then(unwrap)

  const history = messages.map(msg => {
    if (msg.message_type === 'USER') 
      return new HumanMessage(msg.content ?? '');

    if (msg.tickets) 
      return new AIMessage({ content: "Here is a ticket that may be relevant:" + JSON.stringify(msg.tickets) });

    return new AIMessage(msg.content ?? '');
  });

  console.log(history)

  return [new SystemMessage(SYSTEM_PROMPT), ...history, new HumanMessage(query)];
}

// TODO: from each invocatoin of the editTicket tool, we need to derive the ticket ids that need to have their client side tanstrack query invalidated/refetched
async function processAgentResponse(finalMessages: BaseMessage[], query: string, authorId: number): Promise<Message[]> {
  const messagesToInsert: MessageInsertion[] = [{
    message_type: "USER",
    content: query,
    author_id: authorId
  }]

  for (let i = 0; i < finalMessages.length - 1; i++) {
    const { name, content } = finalMessages[i]
    if (name !== "findTickets") continue

    const tickets = JSON.parse(content as string)
    if (!Array.isArray(tickets)) continue
    
    for (const ticket of tickets) {
      messagesToInsert.push({
        message_type: "AGENT",
        ticket_id: ticket.id,
        author_id: authorId
      })
    }
  }

  const answer = finalMessages[finalMessages.length - 1]
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