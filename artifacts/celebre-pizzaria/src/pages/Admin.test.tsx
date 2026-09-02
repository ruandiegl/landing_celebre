import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Admin from '@/pages/Admin';
import { LandingContentProvider } from '@/content/content-provider';

describe('Admin page', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.endsWith('/api/admin/session')) {
          return new Response(
            JSON.stringify({ session: { username: 'administrator', issuedAt: 1, expiresAt: 2 } }),
            { status: 200, headers: { 'Content-Type': 'application/json' } },
          );
        }
        if (url.endsWith('/api/admin/media')) {
          return new Response(JSON.stringify({ assets: [] }), { status: 200 });
        }
        return new Response(null, { status: 404 });
      }),
    );
  });

  it('shows the same explicit section labels and catalog slots used by the landing', async () => {
    render(
      <LandingContentProvider>
        <Admin />
      </LandingContentProvider>,
    );

    await waitFor(() => expect(
      screen.getByRole('heading', { name: 'Administração da landing' }),
    ).toBeInTheDocument());
    expect(screen.getByText('Abertura da landing')).toBeInTheDocument();
    expect(screen.getByText('Mini catálogo / cardápio')).toBeInTheDocument();
    expect(screen.getByText('Imagem da Margherita Clássica')).toBeInTheDocument();
  });

  it('edits a section title through its labeled control', async () => {
    render(
      <LandingContentProvider>
        <Admin />
      </LandingContentProvider>,
    );

    const titleInput = await screen.findByLabelText('Título — Mini catálogo / cardápio');
    fireEvent.change(titleInput, { target: { value: 'Sabores renovados' } });

    expect(titleInput).toHaveValue('Sabores renovados');
    expect(titleInput).toHaveValue('Sabores renovados');
  });
});
