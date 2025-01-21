export type Member = {
  id: number;
  org_id: string; // uuid
  user_id: string; // uuid
  role: Role;
  created_at: string;
};

export type Ticket = {
  id: number;
  org_id: string; // uuid
  creator_id: number;
  assignee_id: number | null;
  status: Status;
  title: string;
  content: string;
  metadata: any;
  created_at: string;
  updated_at: string;
};

export type Role = 'OWNER' | 'ADMIN' | 'AGENT' | 'CUSTOMER';
export type Status = 'NEW' | 'OPEN' | 'PENDING' | 'ON_HOLD' | 'SOLVED' | 'REOPENED' | 'CLOSED';
