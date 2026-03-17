import type { AuthPayload } from '@ticketbasics/zod-schemas';

import { useMutation } from '@tanstack/vue-query';

import { login } from '@/apis';

export function useLogin() {
  const { mutate, mutateAsync, isPending, error, reset } = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const response = await login({ username, password });
      return response.token;
    },

    onSuccess: (token: AuthPayload) => {
      console.log(token);
    },

    onError: (err) => {
      console.error('Login failed', err);
    },
  });

  return { mutate, mutateAsync, isPending, error, reset };
}
