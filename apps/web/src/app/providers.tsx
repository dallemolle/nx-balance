import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { ThemeProvider } from '@/lib/theme';

export function createQueryClient() {
  return new QueryClient({ defaultOptions: { queries: { retry: 1 } } });
}

/** Providers globais da aplicação (tema e cache de consultas). */
export function Providers({
  queryClient,
  children,
}: {
  queryClient: QueryClient;
  children: ReactNode;
}) {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ThemeProvider>
  );
}
