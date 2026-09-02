import { useState, type FormEvent } from 'react';
import { ArrowLeft, LockKeyhole, LogIn } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AdminApiError } from '@/lib/admin-client';

export default function AdminLogin({
  onLogin,
}: {
  onLogin: (username: string, password: string) => Promise<void>;
}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await onLogin(username, password);
    } catch (cause) {
      setError(
        cause instanceof AdminApiError
          ? cause.message
          : 'Não foi possível iniciar a sessão.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8 text-foreground">
      <Card className="w-full max-w-md border-primary/20 bg-card/90 shadow-xl">
        <CardHeader>
          <Link href="/" className="mb-4 inline-flex items-center gap-2 text-sm text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Voltar para a landing
          </Link>
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <LockKeyhole className="h-6 w-6" aria-hidden="true" />
          </div>
          <CardTitle className="font-serif text-3xl">Acesso administrativo</CardTitle>
          <CardDescription>
            Entre para editar os títulos, imagens e itens do mini catálogo da landing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={(event) => void submit(event)}>
            <div className="space-y-2">
              <Label htmlFor="admin-username">Usuário</Label>
              <Input
                id="admin-username"
                name="username"
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
                maxLength={80}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Senha</Label>
              <Input
                id="admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                maxLength={256}
              />
            </div>
            {error && (
              <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}
            <Button className="w-full" type="submit" disabled={submitting}>
              <LogIn className="h-4 w-4" aria-hidden="true" />
              {submitting ? 'Entrando…' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
