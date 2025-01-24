INSERT INTO public.organizations (id,name) VALUES 
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7','First Org'),
    ('9b5e3268-d968-4d48-8063-12f5c65ac2f4','Second Org');

INSERT INTO public.members (org_id, role) VALUES 
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 'OWNER'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 'ADMIN'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 'AGENT'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 'CUSTOMER'),
    ('9b5e3268-d968-4d48-8063-12f5c65ac2f4', 'OWNER'),
    ('9b5e3268-d968-4d48-8063-12f5c65ac2f4', 'ADMIN'),
    ('9b5e3268-d968-4d48-8063-12f5c65ac2f4', 'AGENT'),
    ('9b5e3268-d968-4d48-8063-12f5c65ac2f4', 'CUSTOMER');

INSERT INTO public.tickets (org_id, subject, description, email, name, status, priority) VALUES
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 'Export feature not working', 'Export button does nothing when clicked in reports section', 'marcus@example.com', 'Marcus Chen', 'NEW', 'NORMAL'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 'Mobile app crashing', 'App crashes immediately after splash screen on iPhone 14', 'james@example.com', 'James Wilson', 'OPEN', 'HIGH'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 'Missing data in reports', 'Last week''s data is not showing up in monthly report', 'olivia@example.com', 'Olivia Thompson', 'PENDING', 'NORMAL'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 'Login issue', 'Unable to reset password via email', 'sophia@example.com', 'Sophia Martinez', 'NEW', 'HIGH'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 'Email notifications not received', 'No notification emails received for ticket updates', 'ethan@example.com', 'Ethan Brown', 'OPEN', 'NORMAL'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 'Broken link on help page', 'FAQ section has a broken link to documentation', 'amelia@example.com', 'Amelia Davis', 'PENDING', 'LOW'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 'UI glitch in dark mode', 'Text color is unreadable in dark mode on mobile', 'lucas@example.com', 'Lucas White', 'ON_HOLD', 'NORMAL'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 'Report generation timeout', 'Generating large reports times out', 'mia@example.com', 'Mia Harris', 'OPEN', 'HIGH'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 'API rate limit issues', 'Experiencing unexpected rate limiting on API', 'noah@example.com', 'Noah Wilson', 'SOLVED', 'URGENT'),
    
    ('9b5e3268-d968-4d48-8063-12f5c65ac2f4', 'Integration setup help', 'Need assistance connecting Slack integration', 'emma@example.com', 'Emma Rodriguez', 'PENDING', 'URGENT'),
    ('9b5e3268-d968-4d48-8063-12f5c65ac2f4', 'Slow dashboard loading', 'Dashboard takes over 30 seconds to load', 'michael@example.com', 'Michael Singh', 'OPEN', 'HIGH'),
    ('9b5e3268-d968-4d48-8063-12f5c65ac2f4', 'CSV import failing', 'Getting validation error when importing customer list', 'thomas@example.com', 'Thomas Lee', 'CLOSED', 'LOW'),
    ('9b5e3268-d968-4d48-8063-12f5c65ac2f4', 'Two-factor authentication issue', '2FA not working for multiple users', 'lily@example.com', 'Lily Adams', 'NEW', 'HIGH'),
    ('9b5e3268-d968-4d48-8063-12f5c65ac2f4', 'Billing discrepancy', 'Charged twice for the same invoice', 'ben@example.com', 'Ben Carter', 'PENDING', 'URGENT'),
    ('9b5e3268-d968-4d48-8063-12f5c65ac2f4', 'User role permissions incorrect', 'New users getting incorrect permissions', 'charlotte@example.com', 'Charlotte Green', 'OPEN', 'NORMAL'),
    ('9b5e3268-d968-4d48-8063-12f5c65ac2f4', 'Webhook failures', 'Webhooks are not triggering as expected', 'henry@example.com', 'Henry Scott', 'ON_HOLD', 'HIGH'),
    ('9b5e3268-d968-4d48-8063-12f5c65ac2f4', 'Search function broken', 'No results returned for valid queries', 'ella@example.com', 'Ella Walker', 'REOPENED', 'NORMAL'),
    ('9b5e3268-d968-4d48-8063-12f5c65ac2f4', 'Exported CSV format incorrect', 'Date format in exported CSV is incorrect', 'sam@example.com', 'Sam Hughes', 'SOLVED', 'LOW');
