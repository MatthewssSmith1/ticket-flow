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
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    author_id bigint REFERENCES public.members(id) ON DELETE SET NULL,
    assignee_id bigint REFERENCES public.members(id) ON DELETE SET NULL,
    status public.ticket_status DEFAULT 'NEW' NOT NULL,
    subject text NOT NULL,
    description text NOT NULL,
    email text,
    name text,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    verified_at timestamptz,
    PRIMARY KEY (id)
);
