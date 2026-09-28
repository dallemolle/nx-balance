import { QueryClient } from '@tanstack/react-query';
import { createMemoryHistory, RouterProvider } from '@tanstack/react-router';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { Providers } from '@/app/providers';
import { createAppRouter } from '@/app/router';
import { ThemeProvider } from '@/lib/theme';

/** Renderiza um componente dentro do `ThemeProvider`. */
export function renderWithTheme(ui: ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

/** Renderiza a aplicação inteira (providers + rotas) numa URL em memória. */
export function renderApp(path = '/') {
  // Sem retentativas nos testes: o estado de erro aparece na hora.
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const router = createAppRouter({ history: createMemoryHistory({ initialEntries: [path] }) });
  return render(
    <Providers queryClient={queryClient}>
      <RouterProvider router={router} />
    </Providers>,
  );
}
