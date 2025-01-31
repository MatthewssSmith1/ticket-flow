import "edge-runtime"

import { corsHeaders } from "../_shared/cors.ts"
import { supabase } from "../_shared/supabase.ts"

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })

  if (req.method !== "POST") return new Response(
    "Method not allowed", 
    { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  )

  const { memberId } = await req.json()

  const { data, error } = await supabase
    .from('members')
    .update({ role: 'ADMIN' })
    .eq('id', memberId)
    .select()

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500
    })
  }

  return new Response(JSON.stringify({ data }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200
  })
})
