import { createClient } from "supabase-js"
import { Database } from "./global/database.d.ts"

export const supabase = createClient<Database>(
  Deno.env.get("SUPABASE_URL")!, 
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
)
export type SupabaseClient = typeof supabase

type QueryResult<T, E> = { data: T; error: null } | { data: null; error: E }

export function unwrap<T, E extends Error>(result: QueryResult<T, E>): T {
  if (result.error) throw result.error

  return result.data as T
}

export async function getOrCreateMember(user_id: string, org_id: string, name: string | null) {
  const member = await supabase.from("members")
    .select()
    .eq("user_id", user_id)
    .eq("org_id", org_id)
    .maybeSingle()
    .then(unwrap)

  if (member) return member.id

  name ??= "Unnamed User"
  return await supabase.from("members")
      .insert({ user_id, org_id, role: "CUSTOMER", name })
      .select()
      .single()
      .then(unwrap)
      .then(member => member.id)
}