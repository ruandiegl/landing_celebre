import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { FloatingPizzaSection } from '@/components/FloatingPizzaSection';
import { CardapioSection } from '@/components/CardapioSection';
import { RodizioSection } from '@/components/RodizioSection';
import { KaraokeSection } from '@/components/KaraokeSection';
import { AmbienceSection } from '@/components/AmbienceSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { ReservationSection } from '@/components/ReservationSection';
import { Footer } from '@/components/Footer';
import { MobileFloatingCTA } from '@/components/MobileFloatingCTA';
import { FloatingWhatsAppButton } from '@/components/FloatingWhatsAppButton';
import { Reveal } from '@/components/motion/Reveal';

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-background grain-overlay">
      <Navigation />
      <Reveal><HeroSection /></Reveal>
      <Reveal direction="left"><FloatingPizzaSection /></Reveal>
      <Reveal><CardapioSection /></Reveal>
      <Reveal direction="right"><RodizioSection /></Reveal>
      <Reveal><KaraokeSection /></Reveal>
      <Reveal><AmbienceSection /></Reveal>
      <Reveal><TestimonialsSection /></Reveal>
      <Reveal><ReservationSection /></Reveal>
      <Footer />
      <MobileFloatingCTA />
      <FloatingWhatsAppButton />
    </div>
  );
}
