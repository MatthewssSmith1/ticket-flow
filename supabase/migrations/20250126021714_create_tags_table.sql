CREATE TABLE IF NOT EXISTS public.tags (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name text NOT NULL,
    color text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(org_id, name)
);

CREATE TABLE IF NOT EXISTS public.tags_tickets (
    tag_id bigint NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    ticket_id uuid NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (tag_id, ticket_id)
);