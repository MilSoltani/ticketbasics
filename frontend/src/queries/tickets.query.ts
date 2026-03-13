import type { Pagination, Ticket, TicketQuery } from '@ticketbasics/zod-schemas';

import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { computed, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { createTicket, getAllTickets, getTicketById, updateTicket } from '@/apis/tickets.api';

function parseQueryFromURL(route: ReturnType<typeof useRoute>): TicketQuery {
  return {
    status: route.query.status as TicketQuery['status'],
    priority: route.query.priority as TicketQuery['priority'],
    sort: (route.query.sort as TicketQuery['sort']) ?? 'createdAt',
    order: (route.query.order as TicketQuery['order']) ?? 'desc',
    limit: route.query.limit ? Number(route.query.limit) : 25,
    offset: route.query.offset ? Number(route.query.offset) : 0,
    subject: route.query.subject as TicketQuery['subject'],
  };
}

export function useGetAllTickets() {
  const route = useRoute();
  const router = useRouter();
  const query = reactive(parseQueryFromURL(route));

  watch(
    query,
    (newQuery) => {
      const safeQuery: Record<string, string | undefined> = {};
      Object.entries(newQuery).forEach(([key, value]) => {
        if (value instanceof Date) {
          safeQuery[key] = value.toISOString();
        }
        else if (typeof value === 'number') {
          safeQuery[key] = value.toString();
        }
        else if (typeof value !== 'undefined') {
          safeQuery[key] = value as string;
        }
      });
      router.replace({ query: safeQuery });
    },
    { deep: true },
  );

  interface TicketsResponse { data: Ticket[]; pagination?: Pagination }

  const { data: response, isLoading, error, isFetching } = useQuery<TicketsResponse>({
    queryKey: ['tickets', 'all', { ...query }],
    queryFn: () => getAllTickets(query),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  return {
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
