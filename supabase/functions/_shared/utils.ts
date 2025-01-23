export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type QueryResult<T> = { data: T; error: null }
  | { data: null; error: Error }

export function unwrap<T>(result: QueryResult<T>): T {
  if (result.error) throw result.error

  return result.data
}