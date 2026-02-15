import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function useMyRentals() {
  return useQuery({
    queryKey: ['my-rentals'],
    queryFn: async () => {
      const res = await api.get('/rentals/my');
      return res.data;
    },
  });
}

export function useOwnerRequests(itemId: string | number) {
  return useQuery({
    queryKey: ['owner-requests', itemId],
    queryFn: async () => {
      const res = await api.get(`/rentals/owner/${itemId}`);
      return res.data;
    },
    enabled: !!itemId,
  });
}

export function useCreateRental() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      itemId: number;
      startDate: string;
      endDate: string;
      message?: string;
    }) => {
      const res = await api.post('/rentals', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-rentals'] });
    },
  });
}

export function useUpdateRentalStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await api.patch(`/rentals/${id}/status`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-rentals'] });
      queryClient.invalidateQueries({ queryKey: ['owner-requests'] });
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
}