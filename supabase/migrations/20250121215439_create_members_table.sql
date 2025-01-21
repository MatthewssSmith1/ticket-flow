CREATE TYPE public.member_role AS ENUM (
    'OWNER',
    'ADMIN',
    'AGENT',
    'CUSTOMER'
);

CREATE TABLE IF NOT EXISTS public.members (
    id bigint NOT NULL,
    user_id uuid NOT NULL REFERENCES auth.users(id),
    created_at timestamptz DEFAULT now() NOT NULL,
    org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    role public.member_role NOT NULL,
    PRIMARY KEY (id)
);
