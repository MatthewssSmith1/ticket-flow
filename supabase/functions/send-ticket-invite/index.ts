import "edge-runtime"

import { supabase, unwrap, getOrCreateMember } from "../_shared/supabase.ts"
import { corsHeaders } from "../_shared/cors.ts"
import OpenAI from "openai";
import { z } from "zod"

const PRIORITIES = ["URGENT", "HIGH", "NORMAL", "LOW"] as const;
const ticketSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(2, "Subject must be at least 2 characters"),
  description: z.string().min(5, "Please provide more details"),
  priority: z.enum(PRIORITIES).default("NORMAL"),
  org_id: z.string().uuid(),
})
type TicketForm = z.infer<typeof ticketSchema>

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })

  if (req.method !== "POST") return new Response(
    "Method not allowed", 
    { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  )

  try {
    const formData = ticketSchema.parse(await req.json())
    const userId = await emailToUserId(formData.email)

    if (userId) await handleExistingUser(formData, userId!, req)
    else await handleNewUser(formData)

    return new Response(
      JSON.stringify({ shouldRedirect: Boolean(userId) }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch (e) {
    console.log(e)
    return new Response(
      JSON.stringify(e), 
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})

async function handleExistingUser(formData: TicketForm, userId: string, req: Request) {
  await verifyEmail(formData.email, req)

  const ticket = {
    ...formData,
    author_id: await getOrCreateMember(userId, formData.org_id, formData.name),
    embedding: await generateEmbedding(formData),
    email: undefined,
    verified_at: (new Date()).toISOString(),
  }

  await supabase.from("tickets").insert(ticket).then(unwrap)
}

async function handleNewUser(formData: TicketForm) {
  const embedding = await generateEmbedding(formData)

  const ticket = await supabase
    .from("tickets")
    .insert({ ...formData, embedding })
    .select()
    .single()
    .then(unwrap)

  const redirectTo = `${Deno.env.get("BASE_URL")}/verify-ticket?id=${ticket.id}`

  const { error } = await supabase.auth.admin.inviteUserByEmail(formData.email, { redirectTo })
  if (error) throw error
}

async function generateEmbedding(formData: TicketForm) {
  const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY")! })

  return await openai.embeddings.create({
    model: "text-embedding-3-small",
    encoding_format: "float",
    input: `${formData.subject}\n${formData.description}`
  })
  .then(({data}) => JSON.stringify(data[0].embedding))
}

async function verifyEmail(email: string, req: Request) {
  const authHeader = req.headers.get("Authorization")
  if (!authHeader) throw new Error("Please login with this email first")

  const jwt = authHeader.replace("Bearer ", "")
  const { data: { user } } = await supabase.auth.getUser(jwt)
  
  if (user?.email !== email) throw new Error(`Please login with this email first`)
}

// TODO: (instead of listUsers hack) this selection wasn"t returning a user as expected:
// supabase.from("auth.users").select("id").eq("email", email).maybeSingle()
const emailToUserId = async (email: string) => {
  const { data: { users }, error } = await supabase.auth.admin.listUsers()

  if (error) throw error

  return users.find(user => user.email === email)?.id
}