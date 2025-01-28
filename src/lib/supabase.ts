import { createClient } from '@supabase/supabase-js'
import { Database } from '@shared/database'

const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export default supabase
export type SupabaseClient = typeof supabase


// TODO: consider moving unwrap to folder shared with edge functions
type QueryResult<T> = { data: T; error: null }
  | { data: null; error: Error }

export function unwrap<T>(result: QueryResult<T>): T {
  if (result.error) throw result.error

  return result.data
}

export async function getUser() {
  const result = await supabase.auth.getSession()

  return result.data.session?.user ?? null
}
