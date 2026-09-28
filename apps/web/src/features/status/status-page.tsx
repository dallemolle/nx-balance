import { ThemeButtons } from '@/components/theme-buttons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ApiError } from '@/lib/api-client';
import { useHealth } from './use-health';

function statusMessage(health: ReturnType<typeof useHealth>): { text: string; error: boolean } {
  if (health.isPending) return { text: 'Verificando…', error: false };
  if (health.isError) {
    const dbDown = health.error instanceof ApiError && health.error.status === 503;
    return { text: dbDown ? 'Banco de dados indisponível' : 'API fora do ar', error: true };
  }
  return { text: 'API: ok · Banco: no ar', error: false };
}

/** Página inicial: mostra se a API e o banco estão no ar e permite trocar o tema. */
export function StatusPage() {
  const health = useHealth();
  const { text, error } = statusMessage(health);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h1 className="text-2xl font-semibold">NX-Balance</h1>
        </CardTitle>
        <CardDescription>Situação do sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <p role="status" className={error ? 'text-destructive' : undefined}>
          {text}
        </p>
        <ThemeButtons />
      </CardContent>
    </Card>
  );
}
