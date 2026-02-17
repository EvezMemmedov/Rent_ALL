import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export function useLogin() {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await api.post('/auth/login', data);
      return res.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      setTimeout(() => {
        if (data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }, 100);
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      password: string;
      idCardFront?: File;
      idCardBack?: File;
    }) => {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('password', data.password);
      if (data.idCardFront) formData.append('idCardFront', data.idCardFront);
      if (data.idCardBack) formData.append('idCardBack', data.idCardBack);

      const res = await api.post('/auth/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => {
      navigate('/pending-approval');
    },
  });
}

export function useLogout() {
  const { clearAuth } = useAuthStore();
  const navigate = useNavigate();
  return () => {
    clearAuth();
    navigate('/login');
  };
}

export function useMe() {
  const { token } = useAuthStore();
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await api.get('/auth/me');
      return res.data.user;
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}