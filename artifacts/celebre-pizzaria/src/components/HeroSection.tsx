import { useEffect, useState } from 'react';
import heroPizzaPath from '../../attached_assets/generated_images/pizza-hero.jpg';

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src={heroPizzaPath}
          alt=""
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-12 text-center">
        <div
          className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-xs tracking-[0.5em] uppercase text-primary font-sans font-semibold mb-6">
            Onde Fé e Sabor se Encontram
          </p>
          <h1 className="font-serif text-6xl sm:text-7xl lg:text-8xl font-bold mb-6 leading-[0.95] text-foreground">
            Celebre cada
            <br />
            <span className="gold-gradient-text">momento</span>
          </h1>
          <p className="text-lg lg:text-xl text-foreground/70 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            Pizza artesanal, rodízio completo e noites de karaokê gospel.
            <br />
            Um lugar feito para famílias, grupos de igreja e celebração.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => scrollToSection('cardapio')}
              className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-sans font-bold text-sm tracking-wide hover:scale-105 transition-transform duration-300"
              data-testid="hero-cta-cardapio"
            >
              Ver Cardápio Completo
            </button>
            <button
              onClick={() => scrollToSection('reserva')}
              className="px-8 py-4 rounded-full border-2 border-foreground/20 text-foreground font-sans font-semibold text-sm tracking-wide hover:border-primary hover:text-primary transition-all duration-300"
              data-testid="hero-cta-reserva"
            >
              Reservar Mesa
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary/40 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
