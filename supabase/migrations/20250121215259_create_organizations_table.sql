CREATE TABLE IF NOT EXISTS public.organizations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL UNIQUE,
    created_at timestamptz DEFAULT now() NOT NULL,
    PRIMARY KEY (id)
);
