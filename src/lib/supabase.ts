import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

async function getUser() {
  const result = await supabase.auth.getSession()

  return result.data.session?.user ?? null
}

export default supabase
export { getUser }