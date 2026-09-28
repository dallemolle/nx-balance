import { healthResponseSchema } from '@nx-balance/contracts';
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api-client';

/** Consulta `GET /v1/health`. */
export function useHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: ({ signal }) => apiGet('/v1/health', healthResponseSchema, { signal }),
  });
}
