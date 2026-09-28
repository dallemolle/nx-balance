import { Outlet } from '@tanstack/react-router';

/** Layout raiz: moldura comum a todas as páginas. */
export function RootLayout() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10">
        <Outlet />
      </main>
    </div>
  );
}
