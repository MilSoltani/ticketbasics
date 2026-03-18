import type { GetAllQueryResponse, User, UserQuery } from '@ticketbasics/zod-schemas';

import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { computed, ref } from 'vue';

import { deleteUser, getAllUsers, getUserById, updateUser } from '@/apis';

export function useGetAllUsers(initialQuery: Partial<UserQuery> = {}) {
  const query = ref<Partial<UserQuery>>({
    sort: 'createdAt',
    order: 'desc',
    limit: 25,
    offset: 0,
    ...initialQuery,
  });

  const { data: response, isLoading, error, isFetching } = useQuery<GetAllQueryResponse>({
    queryKey: computed(() => ['users', 'all', query.value]),
    queryFn: () => getAllUsers(query.value),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  function setQuery(patch: Partial<UserQuery>) {
    query.value = { ...query.value, ...patch };
  }

  return {
    setQuery,
    data: computed(() => response.value?.data),
    pagination: computed(() => response.value?.pagination),
    isLoading,
    error,
    isFetching,
  };
}

export function useGetUserById(id: number) {
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['users', id],
    queryFn: () => getUserById(id),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  return { data, isLoading, error, isFetching };
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, error, reset } = useMutation({
    mutationFn: updateUser,

    onSuccess: (user: User) => {
      queryClient.invalidateQueries({ queryKey: ['users', 'all'] });
      queryClient.setQueryData(['users', user.id], user);
    },

    onError: (err) => {
      console.error('User update failed', err);
    },
  });

  return { mutate, mutateAsync, isPending, error, reset };
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, error, reset } = useMutation({
    mutationFn: (id: number) => deleteUser(id),

    onSuccess: (user: User) => {
      queryClient.invalidateQueries({ queryKey: ['users', 'all'] });
      queryClient.removeQueries({ queryKey: ['user', user.id], exact: true });
    },

    onError: (err) => {
      console.error('User creation failed', err);
    },
  });

  return { mutate, mutateAsync, isPending, error, reset };
}
