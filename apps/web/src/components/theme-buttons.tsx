import { Button } from '@/components/ui/button';
import { useTheme, type Theme } from '@/lib/theme';

const OPTIONS: { value: Theme; label: string }[] = [
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Escuro' },
  { value: 'system', label: 'Automático' },
];

/** Três botões para escolher o tema: Claro, Escuro ou Automático (segue o sistema). */
export function ThemeButtons() {
  const { theme, setTheme } = useTheme();
  return (
    <div role="group" aria-label="Tema" className="flex gap-2">
      {OPTIONS.map(({ value, label }) => (
        <Button
          key={value}
          type="button"
          size="sm"
          variant={theme === value ? 'default' : 'outline'}
          aria-pressed={theme === value}
          onClick={() => setTheme(value)}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
