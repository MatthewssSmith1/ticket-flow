import "edge-runtime"

import { corsHeaders } from "../_shared/cors.ts"
import { embeddings } from "../_shared/openai.ts"
import { supabase } from "../_shared/supabase.ts"
import { z } from "zod"

const Schema = z.object({
  ticketIds: z.array(z.string().uuid()).optional(),
  memberIds: z.array(z.number()).optional(),
}).refine(data => data.ticketIds || data.memberIds, {
  message: "At least one of ticketIds or memberIds must be provided"
})

type Content = 
{
  id: number;
  content: string;
  isTicket: false;
} | {
  id: string;
  content: string;
  isTicket: true;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })

  try {
    const result = Schema.safeParse(await req.json());
    
    if (!result.success) {
      return new Response(
        JSON.stringify({ error: result.error.format() }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // TODO: splut fetchItems... into seperate funtion for each type of entity
    const { ticketIds, memberIds } = result.data
    const items = await fetchItemsWithoutEmbeddings(ticketIds, memberIds)
    const { validItems, embeddings: embeddingVectors } = await generateEmbeddings(items)
    await updateEmbeddings(validItems, embeddingVectors)

    return new Response(
      JSON.stringify({ success: true, processed: validItems.length }), 
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error }), 
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})

async function fetchItemsWithoutEmbeddings(
  ticketIds?: string[],
  memberIds?: number[]
): Promise<Content[]> {
  const items: Content[] = []

  if (ticketIds?.length) {
    // Fetch tickets without embeddings
    const { data: tickets, error: ticketError } = await supabase
      .from('tickets')
      .select('id, subject, description')
      .is('embedding', null)
      .in('id', ticketIds)

    if (ticketError) throw ticketError

    items.push(...(tickets || []).map(t => ({
      id: t.id,
      content: `${t.subject}\n\n${t.description}`,
      isTicket: true as const
    })))

    // Fetch internal/external messages for these tickets
    const { data: messages, error: messageError } = await supabase
      .from('messages')
      .select('id, content')
      .is('embedding', null)
      .in('ticket_id', ticketIds)
      .in('message_type', ['INTERNAL', 'EXTERNAL'])
      .not('content', 'is', null)

    if (messageError) throw messageError

    items.push(...(messages || []).map(m => ({
      id: m.id,
      content: m.content!,
      isTicket: false as const
    })))
  }
  // TODO: SPLIT HERE

  if (memberIds?.length) {
    // Fetch agent messages for specified members
    const { data: agentMessages, error: agentError } = await supabase
      .from('messages')
      .select('id, content')
      .is('embedding', null)
      .in('author_id', memberIds)
      .eq('message_type', 'AGENT')
      .not('content', 'is', null)

    if (agentError) throw agentError

    items.push(...(agentMessages || []).map(m => ({
      id: m.id,
      content: m.content!,
      isTicket: false as const
    })))
  }

  return items
}

async function generateEmbeddings(items: Content[]) {
  const validItems = items.filter(item => item.content.trim().length > 0)
  if (validItems.length === 0) return { validItems, embeddings: [] }

  const embeddingVectors = await embeddings.embedDocuments(validItems.map(item => item.content))
  return { validItems, embeddings: embeddingVectors }
}

async function updateEmbeddings(
  items: Content[],
  embeddingVectors: number[][]
) {
  if (items.length === 0) return

  // Split items into tickets and messages
  const tickets = items.filter(i => i.isTicket)
  const messages = items.filter(i => !i.isTicket)
  
  // Get corresponding embeddings
  const ticketEmbeddings = embeddingVectors.slice(0, tickets.length)
  const messageEmbeddings = embeddingVectors.slice(tickets.length)

  // TODO: parallel update in one req?
  if (tickets.length > 0) {
    await Promise.all(
      tickets.map((ticket, i) => 
        supabase
          .from('tickets')
          .update({ embedding: JSON.stringify(ticketEmbeddings[i]) })
          .eq('id', ticket.id)
      )
    )
  }

  if (messages.length > 0) {
    await Promise.all(
      messages.map((message, i) => 
        supabase
          .from('messages')
          .update({ embedding: JSON.stringify(messageEmbeddings[i]) })
          .eq('id', message.id)
      )
    )
  }
}
