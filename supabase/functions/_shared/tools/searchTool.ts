import { embeddings } from "../openai.ts"
import { supabase } from "../supabase.ts"
import { tool } from "npm:@langchain/core/tools"
import { z } from "zod"

const schema = z.object({
  query: z.string().describe("The search query to find relevant tickets"),
  limit: z.number().optional().describe("Max number of tickets to return").default(10),
});
type Schema = z.infer<typeof schema>

export const buildSearchTool = (orgId: string) => tool(
  async ({query, limit}: Schema) => {
    const query_embedding = JSON.stringify(await embeddings.embedQuery(query))

    const { data, error } = await supabase.rpc("match_tickets", {
      query_embedding,
      org_id: orgId,
      match_count: limit
    })
    
    if (error) throw error
    return JSON.stringify(data);
  },
  {
    name: "findTickets",
    description: "search support tickets based on a natural language query",
    schema: schema,
  }
);
