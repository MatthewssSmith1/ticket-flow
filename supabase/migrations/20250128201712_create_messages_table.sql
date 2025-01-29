CREATE TYPE public.message_type AS ENUM (
    'EXTERNAL', 
    'INTERNAL', 
    'AGENT',
    'USER'
);

CREATE TABLE IF NOT EXISTS public.messages (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    message_type public.message_type NOT NULL,
    ticket_id uuid REFERENCES public.tickets(id) ON DELETE CASCADE,
    author_id bigint REFERENCES public.members(id) ON DELETE SET NULL,
    content text,
    created_at timestamptz NOT NULL DEFAULT now(),
    embedding vector(1536),
    
    CONSTRAINT valid_message CHECK (
        (message_type IN ('AGENT', 'USER') AND (
            (content IS NULL AND ticket_id IS NOT NULL) OR
            (content IS NOT NULL AND ticket_id IS NULL)
        ))
        OR
        (message_type IN ('EXTERNAL', 'INTERNAL') 
            AND content IS NOT NULL 
            AND ticket_id IS NOT NULL
        )
    )
);

CREATE INDEX messages_ticket_id_idx ON public.messages(ticket_id);
CREATE INDEX messages_author_id_idx ON public.messages(author_id);
CREATE INDEX messages_type_idx ON public.messages(message_type);