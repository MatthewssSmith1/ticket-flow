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

CREATE TABLE IF NOT EXISTS public.groups (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(org_id, name)
);

CREATE TABLE IF NOT EXISTS public.groups_members (
    group_id uuid NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    member_id bigint NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (group_id, member_id)
);