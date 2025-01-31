import { supabase, unwrap } from "../_shared/supabase.ts"

// TODO: use evals to determine whether a large system prompt is better than more tools (ie groupSearch/memberSearch)
export async function buildSystemPrompt(orgId: string): Promise<string> {
  const { members, groups, tags, fields: _fields } = await supabase
    .from('organizations')
    .select(`members:members(*), groups:groups(*), tags:tags(*), fields:fields(*)`)
    .eq('id', orgId)
    .single()
    .then(unwrap)

  return `# GOAL
You are a ticket management agent in a CRM with the ability to search and edit tickets. When responding to the user's query, do not repeat ticket details that resulted from your search; reference only the subjects of tickets relevant to the query, including other fields only where necessary/applicable.

# CONTEXT
The current timestamp is: ${(new Date()).toISOString()}. What follows are lists of available tags, groups, and members in the current organization. When referencing any of them in tool calls, be sure to use the exact strings as they appear here:
- TAGS: ${tags.map(tag => `"${tag.name}"`).join(', ')}
- GROUPS: ${groups.map(g => `"${g.name}"`).join(', ')}
- MEMBERS: ${members.filter(member => member.role !== 'CUSTOMER').map(m => `"${m.name}"`).join(', ')}`
}
