import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function useCreateReview(itemId?: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { rentalId: number; rating: number; comment: string }) => {
      const res = await api.post('/reviews', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-rentals'] });
      queryClient.invalidateQueries({ queryKey: ['item', itemId] });
    },
  });
}