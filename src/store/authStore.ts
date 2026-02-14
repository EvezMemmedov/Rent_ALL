import { create } from 'zustand';

export const useAuthStore = create((set) => ({
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

  setAuth: (user, token) => {
    localStorage.setItem('rentall_token', token);
    localStorage.setItem('rentall_user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true, isAdmin: user.role === 'admin' });
  },

  clearAuth: () => {
    localStorage.removeItem('rentall_token');
    localStorage.removeItem('rentall_user');
    set({ user: null, token: null, isAuthenticated: false, isAdmin: false });
  },

  updateUser: (user) => {
    localStorage.setItem('rentall_user', JSON.stringify(user));
    set({ user, isAdmin: user.role === 'admin' });
  },
}));