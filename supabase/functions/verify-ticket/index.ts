import "edge-runtime"
import { supabase, unwrap, getOrCreateMember } from "../_shared/supabase.ts"
import { corsHeaders } from "../_shared/cors.ts"
import { z } from "zod"

const requestSchema = z.object({
  ticketId: z.string().uuid("Invalid ticket ID"),
  userId: z.string().uuid("Invalid user ID"),
})

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })

  if (req.method !== "POST") return new Response(
    "Method not allowed",
    { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  )

  try {
    const { ticketId, userId } = requestSchema.parse(await req.json())

    const ticket = await supabase
      .from("tickets")
      .select()
      .eq("id", ticketId)
      .single()
      .then(unwrap)

    const author_id = await getOrCreateMember(userId, ticket.org_id, ticket.name)
    const verified_at = new Date().toISOString()

    await supabase
      .from("tickets")
      .update({ author_id, verified_at, email: null, name: null })
      .eq("id", ticketId)
      .then(unwrap)

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error(error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    )
  }
})
