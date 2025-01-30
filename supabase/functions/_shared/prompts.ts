import { supabase, unwrap } from "../_shared/supabase.ts"

export function buildSystemPrompt(): string {

  const now = new Date();
  return `You are a ticket management chat agent with semantic ticket search capabilities. For any query about tickets, use your search tool to find and summarize relevant information. 
If no results are found, clearly state this to the user.
In your final response, DO NOT REPEAT ticket details that result from the search tool; ONLY reference ticket subjects when necessary. Focus on providing analysis, insights, and answering the user's specific questions about the tickets.

The current date and time is: ${now.toISOString()}`
}

export async function buildTagsPrompt(): Promise<string> {
  const tags = await supabase
    .from('tags')
    .select('id, name, color')
    .order('name', { ascending: true })
    .then(unwrap)

  return `Here are all available tags that can be used with tickets: ${tags.map(tag => `"${tag.name}"`).join(', ')}\nWhen editing tickets, you can use any of the tag names listed above.`
}
