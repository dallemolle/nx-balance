import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { mockFetch } from '@/test/mock-fetch';
import { renderApp } from '@/test/render';

describe('StatusPage', () => {
  it('mostra API e banco no ar', async () => {
    mockFetch(200, { status: 'ok', database: 'up', version: '1' });
    renderApp();
    expect(await screen.findByText('API: ok · Banco: no ar')).toBeInTheDocument();
    expect(screen.getByText('NX-Balance')).toBeInTheDocument();
    for (const name of ['Claro', 'Escuro', 'Automático']) {
      expect(screen.getByRole('button', { name })).toBeInTheDocument();
    }
  });

  it('mostra banco indisponível no 503', async () => {
    mockFetch(503, { status: 'degraded', database: 'down', version: '1' });
    renderApp();
    expect(await screen.findByText('Banco de dados indisponível')).toBeInTheDocument();
  });

  it('mostra API fora do ar em qualquer outro erro', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    renderApp();
    expect(await screen.findByText('API fora do ar')).toBeInTheDocument();
  });

  it('consulta GET /v1/health', async () => {
    const fetchMock = mockFetch(200, { status: 'ok', database: 'up', version: '1' });
    renderApp();
    await screen.findByText('API: ok · Banco: no ar');
    expect(fetchMock).toHaveBeenCalledWith('/v1/health', expect.anything());
  });
});
