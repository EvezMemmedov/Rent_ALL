import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function useAdminReports() {
  return useQuery({
    queryKey: ['admin-reports'],
    queryFn: async () => {
      const res = await api.get('/admin/reports');
      return res.data;
    },
  });
}

export function usePendingUsers() {
  return useQuery({
    queryKey: ['pending-users'],
    queryFn: async () => {
      const res = await api.get('/admin/pending-users');
      return res.data;
    },
  });
}

export function useAllUsers(params?: { status?: string; page?: number }) {
  return useQuery({
    queryKey: ['admin-users', params],
    queryFn: async () => {
      const res = await api.get('/admin/users', { params });
      return res.data;
    },
  });
}

export function useAdminUser(userId: string | number) {
  return useQuery({
    queryKey: ['admin-user', userId],
    queryFn: async () => {
      const res = await api.get(`/admin/users/${userId}`);
      return res.data;
    },
    enabled: !!userId,
  });
}

export function useVerifyUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, action }: { userId: number; action: string }) => {
      const res = await api.patch(`/admin/users/${userId}/verify`, { action });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
    },
  });
}