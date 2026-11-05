import { useQuery } from '@tanstack/react-query';
import { ticketsApi } from '@/features/tickets/tickets-api';

export function useApiHealth() {
  const query = useQuery({
    queryKey: ['api-health'],
    queryFn: ticketsApi.checkHealth,
    retry: false,
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });

  return {
    ...query,
    isOnline: query.isSuccess && !query.isError,
  };
}
