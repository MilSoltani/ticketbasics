import type { Ticket } from '@ticketbasics/backend/client';

import { useQuery } from '@tanstack/vue-query';
import { ticketsClient } from '@ticketbasics/backend/client';

/**
 * Fetches all tickets from the API
 * @returns Query state including tickets data, loading and error states
 */
export function useGetAllTickets() {
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['tickets', 'all'],
    queryFn: async () => {
      try {
        const response = await ticketsClient.index.$get();

        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }

        const json = await response.json();

        if (!Array.isArray(json.data)) {
          throw new TypeError('Invalid response: expected array of tickets');
        }

        return json.data as Ticket[];
      }
      catch (err) {
        throw new Error(
          err instanceof Error ? err.message : 'Failed to fetch tickets',
        );
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });

  return { data, isLoading, error, isFetching };
}
