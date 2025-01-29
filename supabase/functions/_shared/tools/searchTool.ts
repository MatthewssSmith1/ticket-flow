import { STATUS, PRIORITY, CHANNEL } from "../global/validation.ts"
import { embeddings } from "../openai.ts"
import { supabase } from "../supabase.ts"
import { tool } from "npm:@langchain/core/tools"
import { z } from "zod"

const schema = z.object({
  query: z.string().describe("The search query to find relevant tickets"),
  limit: z.number().optional().describe("Max number of tickets to return").default(10),
  statusFilter: z.array(STATUS).optional().describe("Filter tickets by any number of status values"),
  priorityFilter: z.array(PRIORITY).optional().describe("Filter tickets by any number of priority values"),
  channelFilter: z.array(CHANNEL).optional().describe("Filter tickets by any number of channel values"),
});
type Schema = z.infer<typeof schema>

export const buildSearchTool = (orgId: string) => tool(
  async ({query, limit, statusFilter, priorityFilter, channelFilter}: Schema) => {
    const query_embedding = JSON.stringify(await embeddings.embedQuery(query))

    const nullifyEmptyArray = <T>(arr?: T[]) => arr?.length ? arr : undefined

    const { data, error } = await supabase.rpc("match_tickets", {
      status_filter: nullifyEmptyArray(statusFilter),
      priority_filter: nullifyEmptyArray(priorityFilter),
      channel_filter: nullifyEmptyArray(channelFilter),
      query_embedding,
      org_id: orgId,
      match_count: limit,
    })
    
    if (error) throw error
    return JSON.stringify(data);
  },
  {
    name: "findTickets",
    description: "search support tickets based on a natural language query with optional filters for status, priority, and channel",
    schema: schema,
  }
);
