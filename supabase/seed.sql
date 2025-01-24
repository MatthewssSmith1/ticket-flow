INSERT INTO public.organizations (id,name) VALUES 
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7','First Org'),
    ('9b5e3268-d968-4d48-8063-12f5c65ac2f4','Second Org');

INSERT INTO public.members (org_id, role, name) VALUES 
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 'OWNER', 'Marcus Chen'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 'ADMIN', 'Olivia Thompson'), 
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 'AGENT', 'Ethan Brown'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 'CUSTOMER', 'Sophia Martinez'),

    ('9b5e3268-d968-4d48-8063-12f5c65ac2f4', 'OWNER', 'Emma Rodriguez'),
    ('9b5e3268-d968-4d48-8063-12f5c65ac2f4', 'ADMIN', 'Michael Singh'),
    ('9b5e3268-d968-4d48-8063-12f5c65ac2f4', 'AGENT', 'Thomas Lee'),
    ('9b5e3268-d968-4d48-8063-12f5c65ac2f4', 'CUSTOMER', 'Lily Adams');

INSERT INTO public.tickets (org_id, author_id, subject, description, status, priority) VALUES
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 1, 'Export feature not working', 'Export button does nothing when clicked in reports section', 'NEW', 'HIGH'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 2, 'Mobile app crashing', 'App crashes immediately after splash screen on iPhone 14', 'OPEN', 'HIGH'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 3, 'Missing data in reports', 'Last week''s data is not showing up in monthly report', 'PENDING', 'NORMAL'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 4, 'Login issue', 'Unable to reset password via email', 'NEW', 'HIGH'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 1, 'Email notifications not received', 'No notification emails received for ticket updates', 'OPEN', 'NORMAL'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 2, 'Broken link on help page', 'FAQ section has a broken link to documentation', 'PENDING', 'LOW'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 3, 'UI glitch in dark mode', 'Text color is unreadable in dark mode on mobile', 'ON_HOLD', 'NORMAL'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 4, 'Report generation timeout', 'Generating large reports times out', 'OPEN', 'HIGH'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 1, 'API rate limit issues', 'Experiencing unexpected rate limiting on API', 'SOLVED', 'URGENT'),
    
    ('9b5e3268-d968-4d48-8063-12f5c65ac2f4', 5, 'Integration setup help', 'Need assistance connecting Slack integration', 'PENDING', 'URGENT'),
    ('9b5e3268-d968-4d48-8063-12f5c65ac2f4', 6, 'Slow dashboard loading', 'Dashboard takes over 30 seconds to load', 'OPEN', 'HIGH'),
    ('9b5e3268-d968-4d48-8063-12f5c65ac2f4', 7, 'CSV import failing', 'Getting validation error when importing customer list', 'CLOSED', 'LOW'),
    ('9b5e3268-d968-4d48-8063-12f5c65ac2f4', 8, 'Two-factor authentication issue', '2FA not working for multiple users', 'NEW', 'HIGH'),
    ('9b5e3268-d968-4d48-8063-12f5c65ac2f4', 5, 'Billing discrepancy', 'Charged twice for the same invoice', 'PENDING', 'URGENT'),
    ('9b5e3268-d968-4d48-8063-12f5c65ac2f4', 6, 'User role permissions incorrect', 'New users getting incorrect permissions', 'OPEN', 'NORMAL'),
    ('9b5e3268-d968-4d48-8063-12f5c65ac2f4', 7, 'Webhook failures', 'Webhooks are not triggering as expected', 'ON_HOLD', 'HIGH'),
    ('9b5e3268-d968-4d48-8063-12f5c65ac2f4', 8, 'Search function broken', 'No results returned for valid queries', 'REOPENED', 'NORMAL'),
    ('9b5e3268-d968-4d48-8063-12f5c65ac2f4', 5, 'Exported CSV format incorrect', 'Date format in exported CSV is incorrect', 'SOLVED', 'LOW');

UPDATE public.tickets SET 
    verified_at = now() - (random() * interval '30 days'),
    due_at = now() + (random() * interval '30 days');