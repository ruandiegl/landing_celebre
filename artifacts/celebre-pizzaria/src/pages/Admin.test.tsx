import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import Admin from '@/pages/Admin';
import { LandingContentProvider } from '@/content/content-provider';

describe('Admin page', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('shows the same explicit section labels and catalog slots used by the landing', () => {
    render(
      <LandingContentProvider>
        <Admin />
      </LandingContentProvider>,
    );

    expect(
      screen.getByRole('heading', { name: 'Administração da landing' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Abertura da landing')).toBeInTheDocument();
    expect(screen.getByText('Mini catálogo / cardápio')).toBeInTheDocument();
    expect(screen.getByText('Imagem da Margherita Clássica')).toBeInTheDocument();
  });

  it('edits a section title through its labeled control', () => {
    render(
      <LandingContentProvider>
        <Admin />
      </LandingContentProvider>,
    );

    const titleInput = screen.getByLabelText('Título — Mini catálogo / cardápio');
    fireEvent.change(titleInput, { target: { value: 'Sabores renovados' } });

    expect(titleInput).toHaveValue('Sabores renovados');
    expect(window.localStorage.getItem('celebre-pizzaria:landing-content:v1')).toContain(
      'Sabores renovados',
    );
  });
});
