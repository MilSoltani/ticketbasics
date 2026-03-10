import { useQuery } from '@tanstack/vue-query';
import { ticketsClient } from '@ticketbasics/backend/client';

export function useGetAllTickets() {
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['all-tickets'],
    queryFn: async () => {
      const response = await ticketsClient.index.$get();
      const json = await response.json();

      return json.data;
    },
  });

  return { data, isLoading, error, isFetching };
}
