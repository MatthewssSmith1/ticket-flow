create or replace function match_tickets (
  query_embedding vector(1536),
  org_id uuid,
  match_count int DEFAULT 10,
  status_filter public.ticket_status[] DEFAULT NULL,
  priority_filter public.ticket_priority[] DEFAULT NULL,
  channel_filter public.ticket_channel[] DEFAULT NULL
) returns table (
  id uuid,
  parent_id uuid,
  status public.ticket_status,
  priority public.ticket_priority,
  subject text,
  description text,
  email text,
  name text,
  created_at timestamptz,
  updated_at timestamptz,
  due_at timestamptz,
  similarity float
)
language plpgsql
as $$
#variable_conflict use_column
begin
  return query
  select
    id,
    parent_id,
    status,
    priority,
    subject,
    description,
    email,
    name,
    created_at,
    updated_at,
    due_at,
    1 - (tickets.embedding <=> query_embedding) as similarity
  from tickets
  where tickets.org_id = org_id
    and tickets.embedding is not null
    and (status_filter is null or status = any(status_filter))
    and (priority_filter is null or priority = any(priority_filter))
    and (channel_filter is null or channel = any(channel_filter))
  order by tickets.embedding <=> query_embedding
  limit match_count;
end;
$$;