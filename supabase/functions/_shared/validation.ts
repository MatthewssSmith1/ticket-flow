// validation shared across frontend and edge functions

export const PRIORITIES = ['URGENT', 'HIGH', 'NORMAL', 'LOW'] as const;

export const createTicketSchema = (z) => z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(2, 'Subject must be at least 2 characters'),
  description: z.string().min(5, 'Please provide more details'),
  priority: z.enum(PRIORITIES).default('NORMAL'),
  org_id: z.string().uuid().optional(),
})
