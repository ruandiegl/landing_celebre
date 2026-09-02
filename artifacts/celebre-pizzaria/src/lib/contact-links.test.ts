import { describe, expect, it } from 'vitest';
import {
  DEFAULT_WHATSAPP_PHONE,
  GOOGLE_MAPS_URL,
  INSTAGRAM_URL,
  getWhatsAppUrl,
  normalizePhone,
} from '@/lib/contact-links';

describe('contact links', () => {
  it('normalizes phone values for wa.me', () => {
    expect(normalizePhone('+55 (24) 99968-7150')).toBe('5524999687150');
    expect(normalizePhone('abc')).toBe('');
    expect(DEFAULT_WHATSAPP_PHONE).toBe('5524999687150');
  });

  it('builds a WhatsApp URL with an encoded reservation message', () => {
    const url = getWhatsAppUrl('olá, quero fazer uma reserva!');

    expect(url).toContain('https://wa.me/5524999687150?text=');
    expect(url).toContain(encodeURIComponent('olá, quero fazer uma reserva!'));
  });

  it('exposes the confirmed Instagram and address links', () => {
    expect(INSTAGRAM_URL).toBe('https://instagram.com/celebrepizzaria');
    expect(GOOGLE_MAPS_URL).toBe('https://maps.app.goo.gl/3btrZZdN3EAZXz968');
  });
});
