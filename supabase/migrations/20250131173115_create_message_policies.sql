ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Insert policy for messages
create policy "Customers can insert external messages linked to their tickets"
on public.messages for insert to authenticated
with check (
  -- Customer-specific restrictions
  (exists (
    select 1 from public.members
    where user_id = auth.uid() 
      and role = 'CUSTOMER'
  ) and 
   message_type = 'EXTERNAL' and
   exists (
     select 1 from public.tickets t
     join public.members m on m.id = t.author_id
     where t.id = ticket_id 
       and m.user_id = auth.uid()
   )) 
  or
  -- Org member check for non-customers
  (exists (
    select 1 from public.tickets t
    join public.members m 
      on m.org_id = t.org_id
    where t.id = ticket_id
      and m.user_id = auth.uid()
      and m.role <> 'CUSTOMER'
  ))
);

-- Select policy with role-based visibility  
create policy "Role-based message visibility"
on public.messages for select to authenticated
using (
  -- CUSTOMER role policy for EXTERNAL messages
  (exists (
    select 1 from public.members
    where user_id = auth.uid()
      and role = 'CUSTOMER'
  ) and
   message_type = 'EXTERNAL' and
   exists (
     select 1 from public.tickets t
     join public.members m on m.id = t.author_id
     where t.id = ticket_id 
       and m.user_id = auth.uid()
   ))
  or
  -- non-CUSTOMER roles and EXTERNAL/INTERNAL messages
  (exists (
    select 1 from public.tickets t
    join public.members m 
      on m.org_id = t.org_id
    where t.id = ticket_id
      and m.user_id = auth.uid()
      and m.role <> 'CUSTOMER'
  ) and
   (message_type in ('INTERNAL', 'EXTERNAL') or
    (message_type in ('AGENT', 'USER') and 
     exists (
       select 1 from public.members m
       where m.id = author_id
         and m.user_id = auth.uid()
     ))))
  or
  -- AGENT and USER messages without ticket_id
  (message_type in ('AGENT', 'USER') and
   exists (
     select 1 from public.members m
     where m.id = author_id
       and m.user_id = auth.uid()
   ))
);

-- Delete policy for author-only message deletion
create policy "Authors can delete their messages"
on public.messages for delete to authenticated
using (
  exists (
    select 1 from public.members m
    where m.id = author_id
      and m.user_id = auth.uid()
  )
);
