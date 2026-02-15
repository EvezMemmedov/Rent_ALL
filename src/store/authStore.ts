import { create } from 'zustand';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: (() => {
    try {
      const u = localStorage.getItem('rentall_user');
      return u ? JSON.parse(u) : null;
    } catch { return null; }
  })(),
  token: localStorage.getItem('rentall_token'),
  isAuthenticated: !!localStorage.getItem('rentall_token'),
  isAdmin: (() => {
    try {
      const u = localStorage.getItem('rentall_user');
      return u ? JSON.parse(u).role === 'admin' : false;
    } catch { return false; }
  })(),

  setAuth: (user: User, token: string) => {
    localStorage.setItem('rentall_token', token);
    localStorage.setItem('rentall_user', JSON.stringify(user));
    set({
      user,
      token,
      isAuthenticated: true,
      isAdmin: user.role === 'admin',
    });
  },

  clearAuth: () => {
    localStorage.removeItem('rentall_token');
    localStorage.removeItem('rentall_user');
    set({ user: null, token: null, isAuthenticated: false, isAdmin: false });
  },

  updateUser: (user: User) => {
    localStorage.setItem('rentall_user', JSON.stringify(user));
    set({ user, isAdmin: user.role === 'admin' });
  },
}));