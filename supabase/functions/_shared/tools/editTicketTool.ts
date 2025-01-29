import { STATUS, PRIORITY } from "../global/validation.ts"
import { supabase, unwrap } from "../supabase.ts"
import { tool } from "npm:@langchain/core/tools"
import { z } from "zod"

const schema = z.object({
  id: z.string().describe("The ID of the ticket to update"),
  due_at: z.coerce.date().nullable().optional().describe("New due date for the ticket. If undefined, the field won't be updated. If null, the due date will be cleared."),
  parent_id: z.string().nullable().optional().describe("New parent ticket ID. If undefined, the field won't be updated. If null, the parent reference will be cleared."),
  priority: PRIORITY.optional().describe("New priority level for the ticket. If undefined, the priority won't be updated."),
  status: STATUS.optional().describe("New status for the ticket. If undefined, the status won't be updated."),
});

type Schema = z.infer<typeof schema>

export const buildEditTicketTool = (orgId: string) => tool(
  async ({ id, due_at, parent_id, priority, status }: Schema) => {
    // Create update object with only defined fields
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    
    if (due_at !== undefined) updateData.due_at = due_at;
    if (parent_id !== undefined) updateData.parent_id = parent_id;
    if (priority !== undefined) updateData.priority = priority;
    if (status !== undefined) updateData.status = status;

    const ticket = await supabase
      .from('tickets')
      .update(updateData)
      .eq('org_id', orgId)
      .eq('id', id)
      .select('id, parent_id, status, priority, subject, description, created_at, updated_at, due_at')
      .single()
      .then(unwrap)

    return JSON.stringify(ticket);
  },
  {
    name: "editTicket",
    description: "Update various fields of an existing ticket including status, priority, due date, and parent ticket reference",
    schema: schema,
  }
);