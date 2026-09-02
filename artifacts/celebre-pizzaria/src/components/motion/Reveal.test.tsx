import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Reveal } from '@/components/motion/Reveal';

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion');
  return { ...actual, useReducedMotion: () => true };
});

describe('Reveal', () => {
  it('keeps content available immediately when reduced motion is preferred', () => {
    render(
      <Reveal>
        <p>Conteúdo acessível</p>
      </Reveal>,
    );

    expect(screen.getByText('Conteúdo acessível')).toBeVisible();
  });
});
