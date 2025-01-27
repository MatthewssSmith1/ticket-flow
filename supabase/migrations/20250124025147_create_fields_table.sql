CREATE TYPE public.field_types AS ENUM (
    'TEXT',
    'REGEX',
    'INTEGER',
    'FLOAT',
    'DATE',
    'BOOLEAN',
    'SELECT',
    'MULTI_SELECT'
);

CREATE TABLE IF NOT EXISTS public.fields (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name text NOT NULL,
    field_type public.field_types NOT NULL,
    description text,
    options text[],
    is_required boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(org_id, name)
);

CREATE TABLE IF NOT EXISTS public.tickets_fields (
    ticket_id uuid NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
    field_id bigint NOT NULL REFERENCES public.fields(id) ON DELETE CASCADE,
    value text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (ticket_id, field_id)
);