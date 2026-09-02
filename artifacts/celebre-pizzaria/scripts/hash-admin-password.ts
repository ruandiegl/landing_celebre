import { createInterface } from 'node:readline/promises';
import { hashAdminPassword } from '../src/server/admin-password';

async function main(): Promise<void> {
  const input = createInterface({ input: process.stdin, output: process.stdout });
  const password = await input.question('Senha do administrador: ');
  input.close();

  if (!password) {
    throw new Error('A senha não pode ser vazia.');
  }

  process.stdout.write(`${await hashAdminPassword(password)}\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : 'Falha ao gerar hash.'}\n`,
  );
  process.exitCode = 1;
});
