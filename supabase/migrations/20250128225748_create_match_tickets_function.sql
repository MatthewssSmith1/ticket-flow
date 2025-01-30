create or replace function match_tickets (
  query_embedding vector(1536),
  org_id uuid,
  match_count int DEFAULT 10,
  status_filter public.ticket_status[] DEFAULT NULL,
  priority_filter public.ticket_priority[] DEFAULT NULL,
  channel_filter public.ticket_channel[] DEFAULT NULL,
  tag_filter text[] DEFAULT NULL
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
  tags text,
  similarity float
)
language plpgsql
as $$
#variable_conflict use_column
begin
  return query
  select
    tickets.id,
    parent_id,
    status,
    priority,
    subject,
    description,
    email,
    tickets.name,
    tickets.created_at,
    updated_at,
    due_at,
    string_agg(tags.name, ', ') as tags,
    1 - (tickets.embedding <=> query_embedding) as similarity
  from tickets
  left join tags_tickets on tickets.id = tags_tickets.ticket_id
  left join tags on tags_tickets.tag_id = tags.id
  where tickets.org_id = match_tickets.org_id
    and tickets.embedding is not null
    and (status_filter is null or status = any(status_filter))
    and (priority_filter is null or priority = any(priority_filter))
    and (channel_filter is null or channel = any(channel_filter))
    and (
      tag_filter is null 
      or exists (
        select 1 from tags_tickets tt
        join tags t on tt.tag_id = t.id
        where tt.ticket_id = tickets.id
        and t.name = any(tag_filter)
      )
    )
  group by tickets.id, tickets.embedding
  order by tickets.embedding <=> query_embedding
  limit match_count;
end;
$$;