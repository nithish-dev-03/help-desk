import { apiClient } from '@/lib/api-client';
import { Comment, CommentCreatePayload } from '@/types/comments';
import { HealthCheckResponse } from '@/types/api';

export const commentsApi = {
  checkHealth: async (ticketId: number): Promise<HealthCheckResponse> => {
    return apiClient<HealthCheckResponse>(`/tickets/${ticketId}/comments/health`);
  },

  getCommentsByTicket: async (ticketId: number): Promise<Comment[]> => {
    const res = await apiClient<{ status: boolean; items: Comment[] }>(
      `/tickets/${ticketId}/comments/`
    );
    return res.items || [];
  },

  createComment: async (ticketId: number, payload: CommentCreatePayload): Promise<Comment> => {
    // Backend router uses PUT /tickets/{ticket_id}/comments/
    const res = await apiClient<{ status: boolean; message: string; item: Comment }>(
      `/tickets/${ticketId}/comments/`,
      {
        method: 'PUT',
        body: JSON.stringify(payload),
      }
    );
    return res.item;
  },
};
