import { STATUS, PRIORITY } from "../global/validation.ts"
import { supabase, unwrap } from "../supabase.ts"
import { tool } from "npm:@langchain/core/tools"
import { z } from "zod"

// TODO: with evals, try moving the undefined vs null/empty distinction to the function description rather than each field
const schema = z.object({
  id: z.string().describe("The ID of the ticket to update"),
  dueAt: z.coerce.date().nullable().optional().describe("New due date for the ticket. Always use 12:00 PM (noon) on the desired date (e.g., '2025-02-05T12:00:00Z' for February 5th) to ensure consistent date handling across timezones. If undefined, the field won't be updated. If null, the due date will be cleared."),
  parentId: z.string().nullable().optional().describe("New parent ticket ID. If undefined, the field won't be updated. If null, the parent reference will be cleared."),
  priority: PRIORITY.optional().describe("New priority level for the ticket. If undefined, the priority won't be updated."),
  status: STATUS.optional().describe("New status for the ticket. If undefined, the status won't be updated."),
  tags: z.array(z.string()).optional().describe("Array of tag names to associate with the ticket. If provided, existing tags will be replaced with these."),
  assignedGroups: z.array(z.string()).optional().describe("Array of group names to assign the ticket to. If provided, existing group assignments will be replaced with these. If undefined, group assignments won't be updated."),
  assignedIndividuals: z.array(z.string()).optional().describe("Array of individual member names to assign the ticket to. If provided, existing individual assignments will be replaced with these. If undefined, individual assignments won't be updated."),
});

export const buildEditTicketTool = (orgId: string, authorId: number) => tool(
  async ({ id, dueAt, parentId, priority, status, tags, assignedGroups, assignedIndividuals }: z.infer<typeof schema>) => {
    const data: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    
    if (dueAt !== undefined) data.due_at = dueAt;
    if (parentId !== undefined) data.parent_id = parentId;
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

    // TODO: replace with rpc calls
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
            tag_id: tagId,
          })))
          .then(unwrap)
      }
    }

    if (assignedGroups !== undefined) {
      const groupRecords = await supabase
        .from('groups')
        .select('id, name')
        .eq('org_id', orgId)
        .in('name', assignedGroups)
        .then(unwrap)

      const foundGroupIds = groupRecords.map(group => group.id)

      await supabase
        .from('tickets_groups')
        .delete()
        .eq('ticket_id', id)
        .then(unwrap)

      if (foundGroupIds.length > 0) {
        await supabase
          .from('tickets_groups')
          .insert(foundGroupIds.map(groupId => ({
            ticket_id: id,
            group_id: groupId,
            assigned_by: authorId,
            assigned_at: new Date().toISOString(),
          })))
          .then(unwrap)
      }
    }

    if (assignedIndividuals !== undefined) {
      const memberRecords = await supabase
        .from('members')
        .select('id, name')
        .eq('org_id', orgId)
        .in('name', assignedIndividuals)
        .then(unwrap)

      const foundMemberIds = memberRecords.map(member => member.id)

      await supabase
        .from('tickets_members')
        .delete()
        .eq('ticket_id', id)
        .then(unwrap)

      if (foundMemberIds.length > 0) {
        await supabase
          .from('tickets_members')
          .insert(foundMemberIds.map(memberId => ({
            ticket_id: id,
            member_id: memberId,
            assigned_by: authorId,
            assigned_at: new Date().toISOString(),
          })))
          .then(unwrap)
      }
    }

    return ticket
  },
  {
    name: "editTicket",
    description: "edit an existing ticket's properties; 'id' is required and any other null/empty values will clear those fields",
    schema,
  }
)