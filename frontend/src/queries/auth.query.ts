import { useMutation } from '@tanstack/vue-query';

import { login, signup } from '@/apis';

export function useLogin() {
  const { mutate, mutateAsync, isPending, error, reset } = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      await login({ username, password });
    },

    onSuccess: () => {
      console.log('Login successful');
    },

    onError: (err) => {
      console.error('Login failed', err);
    },
  });

  return { mutate, mutateAsync, isPending, error, reset };
}

export function useSignup() {
  const { mutate, mutateAsync, isPending, error, reset } = useMutation({
    mutationFn: async ({ firstName, lastName, username, password }: { firstName: string; lastName: string; username: string; password: string }) => {
      await signup({ firstName, lastName, username, password });
    },

    onSuccess: () => {
      console.log('Signup successful');
    },

    onError: (err) => {
      console.error('Signup failed', err);
    },
  });

  return { mutate, mutateAsync, isPending, error, reset };
}
