import { FaWhatsapp } from 'react-icons/fa6';
import { getWhatsAppUrl } from '@/lib/contact-links';

export function FloatingWhatsAppButton() {
  return (
    <a
      href={getWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a CELEBRE pelo WhatsApp"
      data-testid="floating-whatsapp"
      className="fixed bottom-24 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_35px_rgba(37,211,102,0.3)] transition-transform duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:bottom-7 sm:right-7"
    >
      <FaWhatsapp className="h-7 w-7" aria-hidden="true" />
      <span className="sr-only">WhatsApp</span>
    </a>
  );
}
