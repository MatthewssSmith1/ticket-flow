import { STATUS, PRIORITY, CHANNEL } from "../global/validation.ts"
import { embeddings } from "../openai.ts"
import { supabase } from "../supabase.ts"
import { tool } from "npm:@langchain/core/tools"
import { z } from "zod"

const schema = z.object({
  query: z.string().describe("The search query to find relevant tickets"),
  limit: z.number().optional().describe("Max number of tickets to return").default(10),
  statusFilter: z.array(STATUS).optional().describe("Include tickets whose status matches at least one value from this array. Only include status filters that the user explicitly mentions."),
  priorityFilter: z.array(PRIORITY).optional().describe("Include tickets whose priority matches at least one value from this array. Only include priority filters that the user explicitly mentions."),
  channelFilter: z.array(CHANNEL).optional().describe("Include tickets whose channel matches at least one value from this array. Only include channel filters that the user explicitly mentions."),
  tagFilter: z.array(z.string()).optional().describe("Include tickets that have at least one tag from this array. Only include tag filters that the user explicitly mentions."),
});

export const buildFindTicketsTool = (orgId: string) => tool(
  async ({query, limit, statusFilter, priorityFilter, channelFilter, tagFilter}: z.infer<typeof schema>) => {
    const query_embedding = JSON.stringify(await embeddings.embedQuery(query))

    const nullifyEmptyArray = <T>(arr?: T[]) => arr?.length ? arr : undefined

    const { data, error } = await supabase.rpc("match_tickets", {
      status_filter: nullifyEmptyArray(statusFilter),
      priority_filter: nullifyEmptyArray(priorityFilter),
      channel_filter: nullifyEmptyArray(channelFilter),
      tag_filter: nullifyEmptyArray(tagFilter),
      query_embedding,
      org_id: orgId,
      match_count: Math.max(limit, 5),
    })
    
    if (error) throw error
    return JSON.stringify(data);
  },
  {
    name: "findTickets",
    // TODO: evaluate if providing an example like `Example: status=['NEW','OPEN'] with priority=['URGENT'] finds tickets that are (NEW OR OPEN) AND (URGENT)` improves accuracy/error rate
    description: "Natural language ticket search. The optional filters use conjunctive normal form: the AND operator is applied between filters, with the OR operator applied within each filter array.",
    schema: schema,
  }
);
