import { supabase, unwrap } from "../supabase.ts"
import { tool } from "npm:@langchain/core/tools"
import { z } from "zod"

const schema = z.object({
  ticketId: z.string().uuid().describe("The ID of the ticket to find messages for"),
});

export const buildFindMessagesTool = () => tool(
  async ({ ticketId }: z.infer<typeof schema>) => {
    const messages = await supabase
      .from('messages')
      .select(`
        message_type,
        content,
        created_at,
        author:members(name)
      `)
      .eq('ticket_id', ticketId)
      .in('message_type', ['INTERNAL', 'EXTERNAL'])
      .order('created_at', { ascending: true })
      .then(unwrap)

    return messages.map(msg => 
      `[${msg.message_type}] ${msg.author?.name} at ${msg.created_at}: ${msg.content}`
    ).join('\n')
  },
  {
    name: "findMessages",
    description: "Find all messages associated with a given ticket, ordered chronologically",
    schema: schema,
  }
);
