export const DEFAULT_WHATSAPP_PHONE = '5524999687150';
export const WHATSAPP_MESSAGE = 'olá, quero fazer uma reserva!';
export const INSTAGRAM_URL = 'https://instagram.com/celebrepizzaria';
export const ADDRESS = 'R. Beira Rio n 2233, Morada do Vale, 27275-330';
export const GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/3btrZZdN3EAZXz968';

export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function getWhatsAppPhone(value?: string): string {
  const normalized = normalizePhone(value ?? '');
  return normalized || DEFAULT_WHATSAPP_PHONE;
}

export function formatPhoneForDisplay(phone = getWhatsAppPhone()): string {
  const normalized = getWhatsAppPhone(phone);
  if (normalized === DEFAULT_WHATSAPP_PHONE) return '+55 (24) 99968-7150';
  return `+${normalized}`;
}

export function getWhatsAppUrl(message = WHATSAPP_MESSAGE, phone?: string): string {
  return `https://wa.me/${getWhatsAppPhone(phone)}?text=${encodeURIComponent(message)}`;
}
