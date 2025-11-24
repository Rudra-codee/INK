import {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { authApi } from '@/lib/api';
import type { AuthResponse, User } from '@/types/auth';

type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated';

interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  accessToken: string | null;
  signup: (payload: { name: string; email: string; password: string }) => Promise<void>;
  login: (payload: { email: string; password: string }) => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const STORAGE_KEY = 'ink_access_token';

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const getStoredToken = () => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(STORAGE_KEY);
};

const persistToken = (token: string | null) => {
  if (typeof window === 'undefined') return;
  if (!token) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, token);
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(getStoredToken());
  const [status, setStatus] = useState<AuthStatus>('checking');

  const setSession = useCallback((payload: AuthResponse) => {
    setUser(payload.user);
    setAccessToken(payload.accessToken);
    persistToken(payload.accessToken);
    setStatus('authenticated');
  }, []);

  const clearSession = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    persistToken(null);
    setStatus('unauthenticated');
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!accessToken) {
      clearSession();
      return;
    }
    try {
      const data = await authApi.me(accessToken);
      setUser(data.user);
      setStatus('authenticated');
    } catch {
      clearSession();
    }
  }, [accessToken, clearSession]);

  useEffect(() => {
    if (!accessToken) {
      setStatus('unauthenticated');
      return;
    }
    refreshProfile();
  }, [accessToken, refreshProfile]);

  const signup = useCallback(
    async (payload: { name: string; email: string; password: string }) => {
      const data = await authApi.signup(payload);
      setSession(data);
    },
    [setSession]
  );

  const login = useCallback(
    async (payload: { email: string; password: string }) => {
      const data = await authApi.login(payload);
      setSession(data);
    },
    [setSession]
  );

  const googleLogin = useCallback(
    async (idToken: string) => {
      const data = await authApi.googleLogin(idToken);
      setSession(data);
    },
    [setSession]
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout(accessToken);
    } finally {
      clearSession();
    }
  }, [accessToken, clearSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      accessToken,
      signup,
      login,
      googleLogin,
      logout,
      refreshProfile,
    }),
    [user, status, accessToken, signup, login, googleLogin, logout, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

