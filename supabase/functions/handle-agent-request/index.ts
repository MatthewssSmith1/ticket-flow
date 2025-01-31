import "edge-runtime"

import { BaseMessage, HumanMessage, AIMessage, SystemMessage } from "npm:@langchain/core/messages"
import { StateGraph, MessagesAnnotation } from "npm:@langchain/langgraph";
import { buildSendMessageTool } from "../_shared/tools/sendMessageTool.ts";
import { buildFindTicketsTool } from "../_shared/tools/findTicketsTool.ts"
import { buildEditTicketTool } from "../_shared/tools/editTicketTool.ts"
import { buildSystemPrompt } from "../_shared/prompts.ts"
import { supabase, unwrap } from "../_shared/supabase.ts"
import { corsHeaders } from "../_shared/cors.ts"
import { ToolNode } from "npm:@langchain/langgraph/prebuilt";
import { Database } from "../_shared/global/database.d.ts"
import { llm } from "../_shared/openai.ts"

globalThis.process = {
  ...globalThis.process,
  env: {
    LANGCHAIN_PROJECT: Deno.env.get("LANGSMITH_PROJECT"),
    LANGSMITH_TRACING: Deno.env.get("LANGSMITH_TRACING"),
    LANGSMITH_ENDPOINT: Deno.env.get("LANGSMITH_ENDPOINT"),
    LANGSMITH_API_KEY: Deno.env.get("LANGSMITH_API_KEY"),
    LANGSMITH_CALLBACKS_BACKGROUND: "false",
  }
}

type MessageInsertion = Database["public"]["Tables"]["messages"]["Insert"]

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })

  try {
    // TODO: derive authorId from session
    const { orgId, authorId, query } = await req.json()
    
    const finalState = await createWorkflow(orgId, authorId).invoke({ 
      messages: await initMessages(orgId, authorId, query)
    });

    return await processAgentResponse(finalState.messages, authorId, query)
  } catch (error) {
    console.error("Error handling agent request:", error)
    // TODO: return agent message 'Something went wrong. Please try again.'
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})

function createWorkflow(orgId: string, authorId: number) {
  const tools = [
    buildFindTicketsTool(orgId), 
    buildSendMessageTool(authorId),
    buildEditTicketTool(orgId, authorId),
  ];
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

async function initMessages(orgId: string, authorId: number, query: string) {
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

  return [
    new SystemMessage(await buildSystemPrompt(orgId)),
    ...history,
    new HumanMessage(query)
  ];
}

async function processAgentResponse(finalMessages: BaseMessage[], authorId: number, query: string): Promise<Response> {
  const staleTicketIds: string[] = []
  const messagesToInsert: MessageInsertion[] = [{
    message_type: "USER",
    content: query,
    author_id: authorId
  }]

  for (let i = 0; i < finalMessages.length - 1; i++) {
    const message = finalMessages[i]
    const { name, content } = message
    
    if (name === "findTickets") {
      try {
        const tickets = JSON.parse(content as string)
        if (!Array.isArray(tickets)) continue
        
        for (const ticket of tickets) {
          messagesToInsert.push({
            message_type: "AGENT",
            ticket_id: ticket.id,
            author_id: authorId
          })
        }
      } catch (error) {
        console.log("Error parsing findTickets response:", error, "Content:", content)
        continue
      }
    } else if (name === "editTicket") {
      try {
        const ticket = JSON.parse(message.content as string)
        staleTicketIds.push(ticket.id)
      } catch (error) {
        console.log("Error parsing editTicket response:", error, "Content:", message.content)
        continue
      }
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

  const processedMessages = await supabase
    .from("messages")
    .insert(messagesToInsert)
    .select()
    .then(unwrap)

  return new Response(JSON.stringify({ messages: processedMessages, staleTicketIds }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  })
}