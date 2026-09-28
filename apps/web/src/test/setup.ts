import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';
import { stubMatchMedia } from './match-media';

beforeEach(() => {
  // Padrão dos testes: sistema em modo claro.
  stubMatchMedia(false);
  // O jsdom não implementa rolagem; o TanStack Router chama `scrollTo` ao navegar.
  vi.stubGlobal('scrollTo', vi.fn());
});

afterEach(() => {
  cleanup();
  localStorage.clear();
  document.documentElement.classList.remove('dark');
});
