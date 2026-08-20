import { ApiError, refreshSession } from '@/features/auth/services/auth';
import { tokenStorage } from '@/features/auth/services/token-storage';
import { API_URL } from '@/shared/config';
import { NETWORK_ERROR_MESSAGE, fetchWithTimeout } from '@/shared/http';

async function request<T>(path: string, init: RequestInit | undefined, allowRefresh: boolean): Promise<T> {
  const accessToken = await tokenStorage.getAccessToken();

  let response: Response;
  try {
    response = await fetchWithTimeout(`${API_URL}${path}`, {
      ...init,
      headers: {
        ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...init?.headers,
      },
    });
  } catch {
    throw new ApiError(undefined, NETWORK_ERROR_MESSAGE);
  }

  if (response.status === 401 && allowRefresh) {
    const refreshToken = await tokenStorage.getRefreshToken();
    if (refreshToken) {
      try {
        const session = await refreshSession(refreshToken);
        await tokenStorage.save(session.accessToken, session.refreshToken);
        return request<T>(path, init, false);
      } catch {}
    }
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(response.status, data.message ?? 'Došlo je do pogreške', data.issues);
  }

  return data as T;
}

export function authedFetch<T>(path: string, init?: RequestInit): Promise<T> {
  return request<T>(path, init, true);
}
