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

INSERT INTO public.tickets (org_id, subject, description, email, name) VALUES
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 'Export feature not working', 'Export button does nothing when clicked in reports section', 'marcus@example.com', 'Marcus Chen'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 'Mobile app crashing', 'App crashes immediately after splash screen on iPhone 14', 'james@example.com', 'James Wilson'),
    ('7e7a9db6-d2bc-44a4-95b1-21df9400b7a7', 'Missing data in reports', 'Last week''s data is not showing up in monthly report', 'olivia@example.com', 'Olivia Thompson'),
    
    ('9b5e3268-d968-4d48-8063-12f5c65ac2f4', 'Integration setup help', 'Need assistance connecting Slack integration', 'emma@example.com', 'Emma Rodriguez'),
    ('9b5e3268-d968-4d48-8063-12f5c65ac2f4', 'Slow dashboard loading', 'Dashboard takes over 30 seconds to load', 'michael@example.com', 'Michael Singh'),
    ('9b5e3268-d968-4d48-8063-12f5c65ac2f4', 'CSV import failing', 'Getting validation error when importing customer list', 'thomas@example.com', 'Thomas Lee');
