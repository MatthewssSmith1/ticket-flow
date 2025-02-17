CREATE TYPE public.ticket_status AS ENUM (
    'NEW',
    'OPEN',
    'PENDING',
    'ON_HOLD',
    'SOLVED',
    'REOPENED',
    'CLOSED'
);

CREATE TYPE public.ticket_priority AS ENUM (
    'URGENT',
    'HIGH',
    'NORMAL',
    'LOW'
);

CREATE TYPE public.ticket_channel AS ENUM (
    'EMAIL',
    'WEB',
    'CHAT',
    'API'
);

create extension vector;

CREATE TABLE IF NOT EXISTS public.tickets (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    parent_id uuid REFERENCES public.tickets(id) ON DELETE SET NULL,
    org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    author_id bigint REFERENCES public.members(id) ON DELETE SET NULL,
    status public.ticket_status NOT NULL DEFAULT 'NEW',
    channel public.ticket_channel NOT NULL DEFAULT 'WEB',
    priority public.ticket_priority NOT NULL DEFAULT 'NORMAL',
    subject text NOT NULL,
    description text NOT NULL,
    email text,
    name text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    verified_at timestamptz,
    due_at timestamptz,
    embedding vector(1536)
);