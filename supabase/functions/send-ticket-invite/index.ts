import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { createTicketSchema } from '../_shared/validation.ts'
import { createClient } from 'npm:@supabase/supabase-js'
import { corsHeaders } from '../_shared/cors.ts'
import { z } from 'npm:zod'

type Supabase = ReturnType<typeof createClient>

const ticketSchema = createTicketSchema(z)
type TicketForm = z.infer<typeof ticketSchema>

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  if (req.method !== 'POST') return new Response(
    'Method not allowed', 
    { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  try {
    const formData = ticketSchema.parse(await req.json())

    const userId = await emailToUserId(supabase, formData.email)

    return userId 
      ? await handleExistingUser(supabase, userId, formData, req)
      : await handleNewUser(supabase, formData)

  } catch (e) {
    return new Response(
      JSON.stringify({ error: e.message }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function handleExistingUser(
  supabase: Supabase,
  userId: string,
  formData: TicketForm,
  req: Request
) {
  // Verify they're authenticated as this user
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) throw new Error('Please login with this email first')

  // Verify the JWT token belongs to this user
  const jwt = authHeader.replace('Bearer ', '')
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(jwt)

  if (authError) throw authError
  if (authUser?.email !== formData.email) throw new Error(`Please login with ${formData.email} first`)

  const authorId = await getOrCreateMember(userId, formData.org_id)

  const { error: ticketError } = await supabase
    .from('tickets')
    .insert({ ...formData, author_id: authorId, email: undefined
    })
    .select()
    .single()

  if (ticketError) throw ticketError

  return new Response(
    JSON.stringify({ 
      success: true,
      status: 'AUTHENTICATED'
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function getOrCreateMember(userId: string, orgId: string) {
  const { data: member, error: memberError } = await supabase.from('members')
    .select()
    .eq('user_id', userId)
    .eq('org_id', orgId)
    .single()

  if (memberError) throw memberError
  if (member) return member.id

  const { data: newMember, error: newMemberError } = await supabase.from('members')
    .insert({
      user_id: userId,
      org_id: orgId,
      role: 'CUSTOMER'
    })

  if (newMemberError) throw newMemberError
  return newMember.id
}

async function handleNewUser(
  supabase: Supabase,
  formData: TicketForm
) {
  const { data: ticket, error: ticketError } = await supabase
    .from('tickets')
    .insert(formData)
    .select()
    .single()

  if (ticketError) throw ticketError

  const { error: inviteError } = await supabase.auth.admin.inviteUserByEmail(formData.email, { 
    redirectTo: `${Deno.env.get('BASE_URL')}/verify-ticket?id=${ticket.id}`
  })

  if (inviteError) throw inviteError

  return new Response(
    JSON.stringify({ 
      success: true,
      status: 'INVITED'
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function emailToUserId(supabase: Supabase, email: string) {
  // TODO: fix instead of listUsers() hack, selection doesn't return any users for some reason:
  // const { data } = await supabase.from('auth.users').select('id').eq('email', formData.email).single()

  const { data: { users }, error } = await supabase.auth.admin.listUsers()
  if (error) throw error

  return users.find(user => user.email === email)?.id
}