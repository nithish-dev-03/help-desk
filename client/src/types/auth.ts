export type UserRole = 'user' | 'agent' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserRegistrationPayload {
  name: string;
  email: string;
  password: string;
}

export interface UserLoginPayload {
  email: string;
  password: string;
}

export interface UserResetPasswordPayload {
  email: string;
  password: string;
}

export interface AuthSessionUser {
  id: number;
  name?: string;
  email: string;
  role: UserRole;
}

export interface CurrentUserResponse {
  status: boolean;
  user: AuthSessionUser & {
    is_active: boolean;
  };
}
