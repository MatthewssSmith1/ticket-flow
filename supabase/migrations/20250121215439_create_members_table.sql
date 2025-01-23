CREATE TYPE public.member_role AS ENUM (
    'OWNER',
    'ADMIN',
    'AGENT',
    'CUSTOMER'
);

CREATE TABLE IF NOT EXISTS public.members (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    role public.member_role NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (org_id, user_id)
);
