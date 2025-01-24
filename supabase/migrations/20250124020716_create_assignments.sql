CREATE TABLE IF NOT EXISTS public.tickets_members (
    ticket_id uuid NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
    member_id bigint NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    assigned_by bigint REFERENCES public.members(id) ON DELETE SET NULL,
    assigned_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (ticket_id, member_id)
);

CREATE TABLE IF NOT EXISTS public.tickets_groups (
    ticket_id uuid NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
    group_id uuid NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    assigned_by bigint REFERENCES public.members(id) ON DELETE SET NULL,
    assigned_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (ticket_id, group_id)
);