import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const res = await api.get('/messages/conversations');
      return res.data;
    },
  });
}

export function useConversation(userId: string) {
  return useQuery({
    queryKey: ['conversation', userId],
    queryFn: async () => {
      const res = await api.get(`/messages/${userId}`);
      return res.data;
    },
    enabled: !!userId,
    refetchInterval: 3000,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { receiver_id: number; content: string }) => {
      const res = await api.post('/messages', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['conversation'] });
    },
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ['unread-count'],
    queryFn: async () => {
      const res = await api.get('/messages/unread-count');
      return res.data;
    },
    refetchInterval: 5000,
  });
}