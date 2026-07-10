import type { AuthUser } from '@/features/auth/services/auth';
import { authedFetch } from '@/shared/api';

export function updateAvatar(avatar: string) {
  return authedFetch<AuthUser>('/profile/avatar', {
    method: 'PUT',
    body: JSON.stringify({ avatar }),
  });
}

export function removeAvatar() {
  return authedFetch<AuthUser>('/profile/avatar', { method: 'DELETE' });
}
