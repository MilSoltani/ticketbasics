import type { Ticket } from '@ticketbasics/backend/client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';

import { createTicket, getAllTickets, getTicketById, updateTicket } from '@/apis/tickets.api';

export function useGetAllTickets() {
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['tickets', 'all'],
    queryFn: getAllTickets,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  return { data, isLoading, error, isFetching };
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
