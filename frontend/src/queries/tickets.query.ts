import type { Ticket, TicketUpdatePayload } from '@ticketbasics/backend/client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { ticketsClient } from '@ticketbasics/backend/client';

export function useGetAllTickets() {
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['tickets', 'all'],
    queryFn: async () => {
      const response = await ticketsClient.index.$get();

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const json = await response.json();

      if (!Array.isArray(json.data)) {
        throw new TypeError('Invalid response: expected array of tickets');
      }

      return json.data as Ticket[];
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  return { data, isLoading, error, isFetching };
}

export function useGetTicketById(id: number) {
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['tickets', id],
    queryFn: async () => {
      const response = await ticketsClient[':id'].$get({
        param: { id: String(id) },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const json = await response.json();

      if (Array.isArray(json.data)) {
        throw new TypeError('Invalid response: expected single ticket');
      }

      return json.data as Ticket;
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  return { data, isLoading, error, isFetching };
}

export function useUpdateTicket() {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, error, reset } = useMutation({
    mutationFn: async (data: { id: number; changes: TicketUpdatePayload }) => {
      const response = await ticketsClient[':id'].$put({
        param: { id: String(data.id) },
        json: data.changes,
      } as any);

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const json = await response.json();

      if (Array.isArray(json.data)) {
        throw new TypeError('Invalid response: expected single ticket');
      }

      return json.data as Ticket;
    },

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
