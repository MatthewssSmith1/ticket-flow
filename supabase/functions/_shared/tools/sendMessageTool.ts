import { supabase, unwrap } from "../supabase.ts"
import { tool } from "npm:@langchain/core/tools"
import { z } from "zod"

const schema = z.object({
  ticketId: z.string().describe("The ID of the ticket to attach this message to"),
  content: z.string().describe("The content of the message"),
  isInternal: z.boolean().describe("Whether this message should be internal (only visible to team members) or external (also visible to customers)"),
});

export const buildSendMessageTool = (authorId: number) => tool(
  async ({ ticketId, content, isInternal }: z.infer<typeof schema>) => {
    return await supabase
      .from('messages')
      .insert({
        message_type: isInternal ? 'INTERNAL' : 'EXTERNAL',
        ticket_id: ticketId,
        author_id: authorId,
        content,
      })
      .select()
      .single()
      .then(unwrap)
  },
  {
    name: "sendMessage",
    description: "Attach a message to a ticket (on behalf of the user giving the instruction)",
    schema: schema,
  }
);