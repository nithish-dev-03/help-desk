import { apiClient } from '@/lib/api-client';
import {
  UserLoginPayload,
  UserRegistrationPayload,
  UserResetPasswordPayload,
  User,
} from '@/types/auth';
import { ApiResponse } from '@/types/api';

export const authApi = {
  login: async (payload: UserLoginPayload): Promise<{ status: boolean; message: string }> => {
    return apiClient<{ status: boolean; message: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  register: async (
    payload: UserRegistrationPayload
  ): Promise<{ status: boolean; data: User; message: string }> => {
    return apiClient<{ status: boolean; data: User; message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  resetPassword: async (
    payload: UserResetPasswordPayload
  ): Promise<{ status: boolean; message: string }> => {
    return apiClient<{ status: boolean; message: string }>('/auth/forget', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  logout: async (): Promise<{ status: boolean; message: string }> => {
    return apiClient<{ status: boolean; message: string }>('/auth/logout', {
      method: 'GET',
    });
  },

  deleteUser: async (id: number): Promise<ApiResponse> => {
    return apiClient<ApiResponse>(`/auth/${id}`, {
      method: 'DELETE',
    });
  },
};
