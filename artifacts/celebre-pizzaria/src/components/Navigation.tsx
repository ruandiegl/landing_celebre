import { useState, useEffect } from 'react';
import { Link } from 'wouter';

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'py-3' : 'py-6'
      }`}
      style={{
        backgroundColor: scrolled ? 'rgba(10, 10, 10, 0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        {/* Left navigation */}
        <div className="hidden lg:flex items-center gap-8">
          <button
            onClick={() => scrollToSection('cardapio')}
            className="text-xs tracking-widest uppercase text-foreground/80 hover:text-primary transition-colors duration-300"
            data-testid="nav-cardapio"
          >
            Cardápio
          </button>
          <button
            onClick={() => scrollToSection('rodizio')}
            className="text-xs tracking-widest uppercase text-foreground/80 hover:text-primary transition-colors duration-300"
            data-testid="nav-rodizio"
          >
            Rodízio
          </button>
          <button
            onClick={() => scrollToSection('karaoke')}
            className="text-xs tracking-widest uppercase text-foreground/80 hover:text-primary transition-colors duration-300"
            data-testid="nav-karaoke"
          >
            Karaokê
          </button>
        </div>

        {/* Center logo */}
        <Link href="/" className="flex flex-col items-center" data-testid="nav-logo">
          <span className="font-serif text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
            CELEBRE
          </span>
          <span className="text-[0.65rem] tracking-[0.4em] uppercase text-primary font-sans font-semibold">
            PIZZARIA
          </span>
        </Link>

        {/* Right CTA */}
        <div className="hidden lg:block">
          <button
            onClick={() => scrollToSection('reserva')}
            className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-sans font-semibold text-sm tracking-wide hover:scale-105 transition-transform duration-300"
            data-testid="nav-reserva"
          >
            Faça uma Reserva
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => scrollToSection('cardapio')}
          className="lg:hidden text-primary"
          data-testid="nav-mobile-menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
