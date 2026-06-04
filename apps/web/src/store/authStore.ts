import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, AuthTokens } from '@/types';
import { setTokens, clearTokens, api } from '@/lib/api';

interface AuthStore {
  user: User | null; tokens: AuthTokens | null; isLoading: boolean; isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { name: string; email: string; phone: string; password: string; role: string }) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  refreshUser: () => Promise<void>;
  initialize: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null, tokens: null, isLoading: false, isAuthenticated: false,
      initialize: () => { const { tokens, user } = get(); if (tokens && user) { setTokens(tokens); set({ isAuthenticated: true }); } },
      login: async (email, password) => {
        set({ isLoading: true });
        try { const r = await api.post('/auth/login', { email, password }); const tokens: AuthTokens = { accessToken: r.accessToken, refreshToken: r.refreshToken, expiresAt: r.expiresAt }; setTokens(tokens); set({ user: r.user, tokens, isAuthenticated: true, isLoading: false }); }
        catch (e) { set({ isLoading: false }); throw e; }
      },
      register: async (payload) => {
        set({ isLoading: true });
        try { const r = await api.post('/auth/register', payload); const tokens: AuthTokens = { accessToken: r.accessToken, refreshToken: r.refreshToken, expiresAt: r.expiresAt }; setTokens(tokens); set({ user: r.user, tokens, isAuthenticated: true, isLoading: false }); }
        catch (e) { set({ isLoading: false }); throw e; }
      },
      logout: () => { clearTokens(); set({ user: null, tokens: null, isAuthenticated: false }); if (typeof window !== 'undefined') window.location.href = '/login'; },
      setUser: (user) => set({ user }),
      refreshUser: async () => { try { const user = await api.get('/users/me'); set({ user }); } catch {} },
    }),
    { name: 'mobilidad-auth', storage: createJSONStorage(() => localStorage), partialize: (s) => ({ user: s.user, tokens: s.tokens, isAuthenticated: s.isAuthenticated }) }
  )
);