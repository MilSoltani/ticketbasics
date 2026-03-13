import type { Pagination, Ticket, TicketQuery } from '@ticketbasics/zod-schemas';

import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { computed, ref } from 'vue';

import { createTicket, getAllTickets, getTicketById, updateTicket } from '@/apis/tickets.api';

export function useGetAllTickets(initialQuery: Partial<TicketQuery> = {}) {
  const query = ref<Partial<TicketQuery>>({
    sort: 'createdAt',
    order: 'desc',
    limit: 25,
    offset: 0,
    ...initialQuery,
  });

  interface TicketsResponse { data: Ticket[]; pagination?: Pagination }

  const { data: response, isLoading, error, isFetching } = useQuery<TicketsResponse>({
    queryKey: ['tickets', 'all', query],
    queryFn: () => getAllTickets(query.value),
    staleTime: 0,
    retry: 2,
  });

  function setQuery(patch: Partial<TicketQuery>) {
    query.value = { ...query.value, ...patch };
  }

  return {
    query,
    setQuery,
    data: computed(() => response.value?.data),
    pagination: computed(() => response.value?.pagination),
    isLoading,
    error,
    isFetching,
  };
}

export function useGetTicketById(id: number) {
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['tickets', id],
    queryFn: () => getTicketById(id),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  return { data, isLoading, error, isFetching };
}

export function useUpdateTicket() {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, error, reset } = useMutation({
    mutationFn: updateTicket,

    onSuccess: (ticket: Ticket) => {
      queryClient.invalidateQueries({ queryKey: ['tickets', 'all'] });
      queryClient.setQueryData(['tickets', ticket.id], ticket);
    },

    onError: (err) => {
      console.error('Ticket update failed', err);
    },
  });

  return { mutate, mutateAsync, isPending, error, reset };
}

export function useCreateTicket() {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, error, reset } = useMutation({
    mutationFn: createTicket,

    onSuccess: (ticket: Ticket) => {
      queryClient.invalidateQueries({ queryKey: ['tickets', 'all'] });
      queryClient.setQueryData(['tickets', ticket.id], ticket);
    },

    onError: (err) => {
      console.error('Ticket creation failed', err);
    },
  });

  return { mutate, mutateAsync, isPending, error, reset };
}
