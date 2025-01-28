import { createClient } from "supabase-js"
import { Database } from "./global/database.d.ts"

export const supabase = createClient<Database>(
  Deno.env.get("SUPABASE_URL")!, 
  Deno.env.get("SUPABASE_ANON_KEY")!
)
export type SupabaseClient = typeof supabase

type QueryResult<T, E> = { data: T; error: null } | { data: null; error: E }

export function unwrap<T, E extends Error>(result: QueryResult<T, E>): T {
  if (result.error) throw result.error

  return result.data as T
}