import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function useCreateReview(itemId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { rating: number; comment: string }) => {
      const res = await api.post(`/items/${itemId}/reviews`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item', itemId] });
      queryClient.invalidateQueries({ queryKey: ['my-rentals'] });
    },
  });
}