INSERT INTO public.organizations (id,name) VALUES ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7','First Org');

INSERT INTO public.members (org_id, role, name) VALUES 
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 'OWNER', 'Marcus Chen'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 'ADMIN', 'Olivia Thompson'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 'ADMIN', 'James Wilson'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 'AGENT', 'Ethan Brown'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 'AGENT', 'Sarah Lee'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 'AGENT', 'Michael Rodriguez'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 'AGENT', 'Emily Zhang'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 'CUSTOMER', 'Sophia Martinez'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 'CUSTOMER', 'David Kim'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 'CUSTOMER', 'Lisa Johnson'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 'CUSTOMER', 'Alex Turner'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 'CUSTOMER', 'Rachel Green'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 'CUSTOMER', 'Tom Anderson'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 'CUSTOMER', 'Emma Davis'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 'CUSTOMER', 'Chris Murphy'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 'CUSTOMER', 'Nina Patel'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 'CUSTOMER', 'Kevin Walsh');

INSERT INTO public.groups (org_id, name, description) VALUES
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 'Technical Support', 'Front-line technical issue resolution and customer assistance'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 'Product Development', 'Product features, improvements, and bug fixes'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 'Billing', 'Payment processing and subscription management'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 'Account Management', 'Customer success and relationship management');

INSERT INTO public.groups_members (group_id, member_id) VALUES
    ((SELECT id FROM public.groups WHERE name = 'Technical Support'), 2),
    ((SELECT id FROM public.groups WHERE name = 'Technical Support'), 4),
    ((SELECT id FROM public.groups WHERE name = 'Technical Support'), 5),
    ((SELECT id FROM public.groups WHERE name = 'Product Development'), 3),
    ((SELECT id FROM public.groups WHERE name = 'Product Development'), 6),
    ((SELECT id FROM public.groups WHERE name = 'Billing'), 2),
    ((SELECT id FROM public.groups WHERE name = 'Billing'), 7),
    ((SELECT id FROM public.groups WHERE name = 'Account Management'), 3),
    ((SELECT id FROM public.groups WHERE name = 'Account Management'), 5),
    ((SELECT id FROM public.groups WHERE name = 'Account Management'), 7),
    ((SELECT id FROM public.groups WHERE name = 'Technical Support'), 6),
    ((SELECT id FROM public.groups WHERE name = 'Technical Support'), 7),
    ((SELECT id FROM public.groups WHERE name = 'Product Development'), 4),
    ((SELECT id FROM public.groups WHERE name = 'Product Development'), 5),
    ((SELECT id FROM public.groups WHERE name = 'Billing'), 6);

INSERT INTO public.tickets (org_id, author_id, subject, description, status, priority) VALUES
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 8, 'Export feature not working', 'Export button does nothing when clicked in reports section', 'NEW', 'HIGH'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 9, 'Mobile app crashing', 'App crashes immediately after splash screen on iPhone 14', 'OPEN', 'HIGH'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 10, 'Missing data in reports', 'Last week''s data is not showing up in monthly report', 'PENDING', 'NORMAL'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 11, 'Login issue', 'Unable to reset password via email', 'NEW', 'HIGH'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 12, 'Email notifications not received', 'No notification emails received for ticket updates', 'OPEN', 'NORMAL'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 13, 'Broken link on help page', 'FAQ section has a broken link to documentation', 'PENDING', 'LOW'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 14, 'UI glitch in dark mode', 'Text color is unreadable in dark mode on mobile', 'ON_HOLD', 'NORMAL'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 15, 'Report generation timeout', 'Generating large reports times out', 'OPEN', 'HIGH'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 16, 'API rate limit issues', 'Experiencing unexpected rate limiting on API', 'SOLVED', 'URGENT'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 17, 'Integration setup help', 'Need assistance connecting Slack integration', 'PENDING', 'URGENT'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 8, 'Slow dashboard loading', 'Dashboard takes over 30 seconds to load', 'OPEN', 'HIGH'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 9, 'CSV import failing', 'Getting validation error when importing customer list', 'CLOSED', 'LOW'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 10, 'Two-factor authentication issue', '2FA not working for multiple users', 'NEW', 'HIGH'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 11, 'Billing discrepancy', 'Charged twice for the same invoice', 'PENDING', 'URGENT'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 12, 'User role permissions incorrect', 'New users getting incorrect permissions', 'OPEN', 'NORMAL'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 13, 'Webhook failures', 'Webhooks are not triggering as expected', 'ON_HOLD', 'HIGH'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 14, 'Search function broken', 'No results returned for valid queries', 'REOPENED', 'NORMAL'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 15, 'Exported CSV format incorrect', 'Date format in exported CSV is incorrect', 'SOLVED', 'LOW'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 1, 'Security Audit Results', 'Review needed for latest penetration testing findings', 'NEW', 'URGENT'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 2, 'Performance Optimization Plan', 'Database query optimization recommendations', 'OPEN', 'HIGH'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 4, 'Customer Support Training Materials', 'Updated documentation needed for new feature rollout', 'PENDING', 'NORMAL'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 6, 'API Documentation Update', 'New endpoints need documentation review', 'NEW', 'HIGH'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 7, 'Billing System Integration Issue', 'Reconciliation errors in payment processing', 'OPEN', 'URGENT');

UPDATE public.tickets SET 
    verified_at = now() - (random() * interval '30 days'),
    due_at = now() + (random() * interval '30 days');

INSERT INTO public.tags (org_id, name, color) VALUES
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 'bug', '#EF4444'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 'feature', '#3B82F6'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 'documentation', '#10B981'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 'security', '#F59E0B'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 'performance', '#8B5CF6'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 'UX', '#EC4899'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 'mobile', '#14B8A6');

INSERT INTO public.tags_tickets (tag_id, ticket_id) VALUES
    (1, (SELECT id FROM tickets WHERE subject = 'Search function broken')),
    (1, (SELECT id FROM tickets WHERE subject = 'Webhook failures')),
    (3, (SELECT id FROM tickets WHERE subject = 'API Documentation Update')),
    (3, (SELECT id FROM tickets WHERE subject = 'Customer Support Training Materials')),
    (4, (SELECT id FROM tickets WHERE subject = 'Security Audit Results')),
    (4, (SELECT id FROM tickets WHERE subject = 'Two-factor authentication issue')),
    (5, (SELECT id FROM tickets WHERE subject = 'Slow dashboard loading')),
    (5, (SELECT id FROM tickets WHERE subject = 'Performance Optimization Plan')),
    (6, (SELECT id FROM tickets WHERE subject = 'UI glitch in dark mode')),
    (7, (SELECT id FROM tickets WHERE subject = 'Mobile app crashing'));
