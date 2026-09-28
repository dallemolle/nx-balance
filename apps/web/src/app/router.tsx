import {
  createRootRoute,
  createRoute,
  createRouter,
  type RouterHistory,
} from '@tanstack/react-router';
import { StatusPage } from '@/features/status/status-page';
import { RootLayout } from './root-layout';

const rootRoute = createRootRoute({ component: RootLayout });

const statusRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: StatusPage,
});

const routeTree = rootRoute.addChildren([statusRoute]);

/** Cria o roteador (rotas em código). Os testes passam um `history` em memória. */
export function createAppRouter(options: { history?: RouterHistory } = {}) {
  return createRouter({ routeTree, history: options.history });
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createAppRouter>;
  }
}
