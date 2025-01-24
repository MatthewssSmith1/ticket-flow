import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { corsHeaders, unwrap } from '../_shared/utils.ts'
import { createTicketSchema } from '../_shared/validation.ts'
import { createClient } from 'npm:@supabase/supabase-js'
import { z } from 'npm:zod'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

const ticketSchema = createTicketSchema(z)
type TicketForm = z.infer<typeof ticketSchema>

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  if (req.method !== 'POST') return new Response(
    'Method not allowed', 
    { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )

  try {
    const formData = ticketSchema.parse(await req.json())
    const userId = await emailToUserId(formData.email)

    userId 
      ? await handleExistingUser(formData, userId!, req)
      : await handleNewUser(formData)

    return new Response(
      JSON.stringify({ shouldRedirect: Boolean(userId) }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (e) {
    return new Response(
      JSON.stringify({ message: e.message }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function handleExistingUser(formData: TicketForm, userId: string, req: Request) {
  await verifyEmail(formData.email, req)

  const author_id = await getOrCreateMember(userId, formData.org_id, formData.name)

  await supabase.from('tickets')
    .insert({ ...formData, author_id, email: undefined })
    .then(unwrap)
}

async function handleNewUser(formData: TicketForm) {
  const ticket = await supabase
    .from('tickets')
    .insert(formData)
    .select()
    .single()
    .then(unwrap)

  const redirectTo = `${Deno.env.get('BASE_URL')}/verify-ticket?id=${ticket.id}`

  await supabase.auth.admin.inviteUserByEmail(formData.email, { redirectTo }).then(unwrap)
}

async function verifyEmail(email: string, req: Request) {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) throw new Error('Please login with this email first')

  const jwt = authHeader.replace('Bearer ', '')
  const { user } = await supabase.auth.getUser(jwt).then(unwrap)
  
  if (user?.email !== email) throw new Error(`Please login with this email first`)
}

async function getOrCreateMember(user_id: string, org_id: string, name: string | null) {
  const member = await supabase.from('members')
    .select()
    .eq('user_id', user_id)
    .eq('org_id', org_id)
    .maybeSingle()
    .then(unwrap)

  if (member) return member.id

  name ??= 'Unnamed User'
  return await supabase.from('members')
      .insert({ user_id, org_id, role: 'CUSTOMER', name })
      .select()
      .single()
      .then(unwrap)
      .then(member => member.id)
}

// TODO: (instead of listUsers hack) this selection wasn't returning a user as expected:
// supabase.from('auth.users').select('id').eq('email', email).maybeSingle()
const emailToUserId = async (email: string) => (
  await supabase.auth.admin.listUsers()
    .then(unwrap)
    .then(({ users }) => users.find(user => user.email === email)?.id)
)