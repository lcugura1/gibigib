import type { LoginInput, RegisterInput, ResetPasswordInput } from '@gibigib/types';
import { API_URL } from '@/shared/config';

export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'MEMBER' | 'ADMIN';
};

export type AuthResponse = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
};

export class ApiError extends Error {
  status?: number;
  issues?: { path: ReadonlyArray<PropertyKey>; message: string }[];

  constructor(status?: number, message?: string, issues?: ApiError['issues']) {
    super(message);
    this.status = status;
    this.issues = issues;
  }
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(response.status, data.message ?? 'Došlo je do pogreške', data.issues);
  }

  return data as T;
}

export function login(input: LoginInput) {
  return post<AuthResponse>('/auth/login', input);
}

export function register(input: RegisterInput) {
  return post<AuthResponse>('/auth/register', input);
}

export function refreshSession(refreshToken: string) {
  return post<AuthResponse>('/auth/refresh', { refreshToken });
}

export function logout(refreshToken: string) {
  return post<void>('/auth/logout', { refreshToken });
}

export function forgotPassword(email: string) {
  return post<{ message: string }>('/auth/forgot-password', { email });
}

export function resetPassword(input: ResetPasswordInput) {
  return post<{ message: string }>('/auth/reset-password', input);
}
