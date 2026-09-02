import type { PropsWithChildren } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LandingContentProvider } from '@/content/content-provider';
import { HeroSection } from '@/components/HeroSection';

vi.mock('@/components/motion/HeroIntro', () => ({
  HeroIntro: ({ children }: PropsWithChildren) => <>{children}</>,
}));

describe('HeroSection branding', () => {
  it('uses the chromakey logo asset as the hero brand mark', () => {
    render(
      <LandingContentProvider>
        <HeroSection />
      </LandingContentProvider>,
    );

    expect(
      screen.getByRole('img', { name: 'Logo CELEBRE Pizzaria Gospel Bar Abbas' }),
    ).toHaveAttribute('src', expect.stringContaining('/images/logo-chromakey.png'));
  });
});
