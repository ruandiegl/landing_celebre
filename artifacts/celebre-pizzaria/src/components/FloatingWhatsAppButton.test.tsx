import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FloatingWhatsAppButton } from '@/components/FloatingWhatsAppButton';

describe('FloatingWhatsAppButton', () => {
  it('points to the confirmed WhatsApp number and has an accessible name', () => {
    render(<FloatingWhatsAppButton />);

    const button = screen.getByTestId('floating-whatsapp');
    expect(button).toHaveAttribute('href', expect.stringContaining('wa.me/5524999687150'));
    expect(button).toHaveAccessibleName('Falar com a CELEBRE pelo WhatsApp');
  });
});
