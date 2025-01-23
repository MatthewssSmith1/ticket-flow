CREATE TYPE public.ticket_status AS ENUM (
    'NEW',
    'OPEN',
    'PENDING',
    'ON_HOLD',
    'SOLVED',
    'REOPENED',
    'CLOSED'
);

CREATE TABLE IF NOT EXISTS public.tickets (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    author_id bigint REFERENCES public.members(id) ON DELETE SET NULL,
    assignee_id bigint REFERENCES public.members(id) ON DELETE SET NULL,
    status public.ticket_status NOT NULL DEFAULT 'NEW',
    subject text NOT NULL,
    description text NOT NULL,
    email text,
    name text,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    verified_at timestamptz
);
