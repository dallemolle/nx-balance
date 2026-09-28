import { vi } from 'vitest';

/** Substitui o `fetch` global por um mock que responde com `status` e `body` em JSON. */
export function mockFetch(status: number, body: unknown) {
  const fetchMock = vi.fn<typeof fetch>(
    async () =>
      new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
      }),
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}
