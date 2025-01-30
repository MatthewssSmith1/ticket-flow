import { STATUS, PRIORITY } from "../global/validation.ts"
import { supabase, unwrap } from "../supabase.ts"
import { tool } from "npm:@langchain/core/tools"
import { z } from "zod"

const schema = z.object({
  id: z.string().describe("The ID of the ticket to update"),
  due_at: z.coerce.date().nullable().optional().describe("New due date for the ticket. Always use 12:00 PM (noon) on the desired date (e.g., '2025-02-05T12:00:00Z' for February 5th) to ensure consistent date handling across timezones. If undefined, the field won't be updated. If null, the due date will be cleared."),
  parent_id: z.string().nullable().optional().describe("New parent ticket ID. If undefined, the field won't be updated. If null, the parent reference will be cleared."),
  priority: PRIORITY.optional().describe("New priority level for the ticket. If undefined, the priority won't be updated."),
  status: STATUS.optional().describe("New status for the ticket. If undefined, the status won't be updated."),
  tags: z.array(z.string()).optional().describe("Array of tag names to associate with the ticket. If provided, existing tags will be replaced with these."),
});

type Schema = z.infer<typeof schema>

export const buildEditTicketTool = (orgId: string) => tool(
  async ({ id, due_at, parent_id, priority, status, tags }: Schema) => {
    const data: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    
    if (due_at !== undefined) data.due_at = due_at;
    if (parent_id !== undefined) data.parent_id = parent_id;
    if (priority !== undefined) data.priority = priority;
    if (status !== undefined) data.status = status;

    const ticket = await supabase
      .from('tickets')
      .update(data)
      .eq('org_id', orgId)
      .eq('id', id)
      .select('id, parent_id, status, priority, subject, description, created_at, updated_at, due_at')
      .single()
      .then(unwrap)

    if (tags !== undefined) {
      const tagRecords = await supabase
        .from('tags')
        .select('id, name')
        .eq('org_id', orgId)
        .in('name', tags)
        .then(unwrap)

      const foundTagIds = tagRecords.map(tag => tag.id)

      await supabase
        .from('tags_tickets')
        .delete()
        .eq('ticket_id', id)
        .then(unwrap)

      if (foundTagIds.length > 0) {
        await supabase
          .from('tags_tickets')
          .insert(foundTagIds.map(tagId => ({ 
            ticket_id: id, 
            tag_id: tagId 
          })))
          .then(unwrap)
      }
    }

    return JSON.stringify(ticket);
  },
  {
    name: "editTicket",
    description: "Update various fields of a ticket: status, priority, due date, parent ticket reference, and tags",
    schema: schema,
  }
);