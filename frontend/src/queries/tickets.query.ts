import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';

import { getAllTickets, getTicketById, updateTicket } from '@/apis/tickets.api';

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

    onSuccess: (ticket) => {
      queryClient.invalidateQueries({ queryKey: ['tickets', 'all'] });
      queryClient.setQueryData(['tickets', ticket.id], ticket);
    },

    onError: (err) => {
      console.error('Ticket update failed', err);
    },
  });

  return { mutate, mutateAsync, isPending, error, reset };
}
