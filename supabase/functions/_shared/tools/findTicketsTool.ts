import { STATUS, PRIORITY, CHANNEL } from "../global/validation.ts"
import { embeddings } from "../openai.ts"
import { supabase } from "../supabase.ts"
import { tool } from "npm:@langchain/core/tools"
import { z } from "zod"

const schema = z.object({
  query: z.string().describe("The search query to find relevant tickets"),
  limit: z.number().optional().describe("Max number of tickets to return").default(10),
  statusFilter: z.array(STATUS).optional().describe("Include tickets whose status matches at least one value from this array"),
  priorityFilter: z.array(PRIORITY).optional().describe("Include tickets whose priority matches at least one value from this array"),
  channelFilter: z.array(CHANNEL).optional().describe("Include tickets whose channel matches at least one value from this array"),
  tagFilter: z.array(z.string()).optional().describe("Include tickets that have at least one tag from this array"),
});
type Schema = z.infer<typeof schema>

export const buildFindTicketsTool = (orgId: string) => tool(
  async ({query, limit, statusFilter, priorityFilter, channelFilter, tagFilter}: Schema) => {
    const query_embedding = JSON.stringify(await embeddings.embedQuery(query))

    const nullifyEmptyArray = <T>(arr?: T[]) => arr?.length ? arr : undefined

    const { data, error } = await supabase.rpc("match_tickets", {
      status_filter: nullifyEmptyArray(statusFilter),
      priority_filter: nullifyEmptyArray(priorityFilter),
      channel_filter: nullifyEmptyArray(channelFilter),
      tag_filter: nullifyEmptyArray(tagFilter),
      query_embedding,
      org_id: orgId,
      match_count: limit,
    })
    
    if (error) throw error
    return JSON.stringify(data);
  },
  {
    name: "findTickets",
    description: "Natural language ticket search with filtering. Each filter (status, priority, channel, tags) accepts multiple values that are combined with OR logic. When multiple filter types are provided, they are combined with AND logic. Example: status=['NEW','OPEN'] with priority=['URGENT'] finds tickets that are (NEW OR OPEN) AND (URGENT)",
    schema: schema,
  }
);
