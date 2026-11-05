import { User } from './auth';

export interface Comment {
  id: number;
  ticket_id: number;
  user_id: number;
  content: string;
  created_at: string;
  updated_at: string;
  author?: User;
}

export interface CommentCreatePayload {
  content: string;
}
