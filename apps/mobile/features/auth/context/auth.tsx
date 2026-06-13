import { createContext, use, useEffect, useMemo, useState, type ReactNode } from 'react';
import { logout as apiLogout, refreshSession, type AuthUser } from '@/features/auth/services/auth';
import { tokenStorage } from '@/features/auth/services/token-storage';

type AuthContextValue = {
  user: AuthUser | null;
  isReady: boolean;
  signIn: (user: AuthUser, accessToken: string, refreshToken: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const refreshToken = await tokenStorage.getRefreshToken();
        if (refreshToken) {
          const data = await refreshSession(refreshToken);
          await tokenStorage.save(data.accessToken, data.refreshToken);
          setUser(data.user);
        }
      } catch {
        await tokenStorage.clear();
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isReady,
      signIn: async (nextUser, accessToken, refreshToken) => {
        await tokenStorage.save(accessToken, refreshToken);
        setUser(nextUser);
      },
      signOut: async () => {
        const refreshToken = await tokenStorage.getRefreshToken();
        if (refreshToken) {
          try {
            await apiLogout(refreshToken);
          } catch {}
        }
        await tokenStorage.clear();
        setUser(null);
      },
    }),
    [user, isReady],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
  const context = use(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
