import { apiClient } from '@/lib/api-client';
import {
  Ticket,
  TicketCreatePayload,
  TicketStatus,
  TicketUpdatePayload,
} from '@/types/tickets';
import { ApiResponse, HealthCheckResponse } from '@/types/api';

export const ticketsApi = {
  checkHealth: async (): Promise<HealthCheckResponse> => {
    return apiClient<HealthCheckResponse>('/tickets/health-check');
  },

  getAllTickets: async (): Promise<Ticket[]> => {
    const res = await apiClient<{ status: boolean; data: Ticket[] }>('/tickets/');
    return res.data || [];
  },

  getTicketById: async (id: number): Promise<Ticket> => {
    const res = await apiClient<{ status: boolean; data: Ticket }>(`/tickets/${id}`);
    return res.data;
  },

  createTicket: async (payload: TicketCreatePayload): Promise<Ticket> => {
    const res = await apiClient<{ status: boolean; message: string; ticket: Ticket }>(
      '/tickets/',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
    return res.ticket;
  },

  updateTicket: async (id: number, payload: TicketUpdatePayload): Promise<Ticket> => {
    const res = await apiClient<{ status: boolean; message: string; ticket: Ticket }>(
      `/tickets/${id}/`,
      {
        method: 'PUT',
        body: JSON.stringify(payload),
      }
    );
    return res.ticket;
  },

  updateTicketStatus: async (id: number, status: TicketStatus): Promise<Ticket> => {
    const res = await apiClient<{ status: boolean; data: Ticket; message: string }>(
      `/tickets/${id}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }
    );
    return res.data;
  },

  deleteTicket: async (id: number): Promise<ApiResponse> => {
    return apiClient<ApiResponse>(`/tickets/${id}/`, {
      method: 'DELETE',
    });
  },
};
