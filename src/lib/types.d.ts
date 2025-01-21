export type Member = {
  id: number; // incrementing int
  org_id: string; // uuid
  user_id: string; // uuid
  role: Role;
  created_at: string;
};

export type Ticket = {
  id: string; // uuid
  org_id: string; // uuid
  author_id: number | null;
  assignee_id: number | null;
  status: Status;
  subject: string;
  description: string;
  email: string | null;
  name: string | null;
  metadata: any;
  created_at: string;
  updated_at: string;
  verified_at: string | null;
};

export type Role = 'OWNER' | 'ADMIN' | 'AGENT' | 'CUSTOMER';
export type Status = 'NEW' | 'OPEN' | 'PENDING' | 'ON_HOLD' | 'SOLVED' | 'REOPENED' | 'CLOSED';
