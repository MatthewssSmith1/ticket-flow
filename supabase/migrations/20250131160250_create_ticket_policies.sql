ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view tickets from their organizations"
ON public.tickets FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.members
        WHERE members.user_id = auth.uid()
        AND members.org_id = tickets.org_id
        AND (
            members.role != 'CUSTOMER'::public.member_role
            OR (
                members.role = 'CUSTOMER'::public.member_role
                AND tickets.author_id = members.id
            )
        )
    )
);

CREATE POLICY "Employees can update tickets in their organizations"
ON public.tickets FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.members
        WHERE members.user_id = auth.uid()
        AND members.org_id = tickets.org_id
        AND members.role != 'CUSTOMER'::public.member_role
    )
);

CREATE POLICY "Owners and admins can delete tickets in their organizations"
ON public.tickets FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM public.members
        WHERE members.user_id = auth.uid()
        AND members.org_id = tickets.org_id
        AND members.role IN ('OWNER'::public.member_role, 'ADMIN'::public.member_role)
    )
);