import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ThemeButtons } from '@/components/theme-buttons';
import { renderWithTheme } from '@/test/render';
import { stubMatchMedia } from '@/test/match-media';

describe('tema', () => {
  it('escuro aplica a classe dark e persiste', async () => {
    const user = userEvent.setup();
    renderWithTheme(<ThemeButtons />);
    await user.click(screen.getByRole('button', { name: 'Escuro' }));
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('nx-balance:theme')).toBe('dark');
  });

  it('localStorage bloqueado não quebra a tela', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(() => renderWithTheme(<ThemeButtons />)).not.toThrow();
  });

  it('gravação bloqueada no localStorage não impede a troca de tema', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const user = userEvent.setup();
    renderWithTheme(<ThemeButtons />);
    await user.click(screen.getByRole('button', { name: 'Escuro' }));
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('tema salvo é restaurado ao abrir', () => {
    localStorage.setItem('nx-balance:theme', 'dark');
    renderWithTheme(<ThemeButtons />);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(screen.getByRole('button', { name: 'Escuro' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('automático segue a preferência do sistema', async () => {
    stubMatchMedia(true);
    const user = userEvent.setup();
    renderWithTheme(<ThemeButtons />);
    await user.click(screen.getByRole('button', { name: 'Claro' }));
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    await user.click(screen.getByRole('button', { name: 'Automático' }));
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('nx-balance:theme')).toBe('system');
  });
});
