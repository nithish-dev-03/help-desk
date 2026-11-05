import { User } from './auth';

export type TicketPriority = 'low' | 'medium' | 'high';
export type TicketStatus = 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed';

export interface Ticket {
  id: number;
  title: string;
  description: string;
  priority: TicketPriority;
  category: string;
  status: TicketStatus;
  created_by: number;
  assigned_to: number | null;
  created_at: string;
  updated_at: string;
  creator?: User;
  assignee?: User | null;
}

export interface TicketCreatePayload {
  title: string;
  description: string;
  priority: TicketPriority;
  category: string;
}

export interface TicketUpdatePayload {
  title: string;
  description: string;
  priority: TicketPriority;
  category: string;
}

export interface TicketStatusUpdatePayload {
  status: TicketStatus;
}
