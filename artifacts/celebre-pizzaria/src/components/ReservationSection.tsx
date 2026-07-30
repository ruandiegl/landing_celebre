import { useEffect, useState, useRef } from 'react';

export function ReservationSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    people: '',
    message: '',
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire up when API exists
    console.log('Reservation:', formData);
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-card/30"
      id="reserva"
    >
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div
          className={`text-center mb-12 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-xs tracking-[0.5em] uppercase text-primary font-sans font-semibold mb-4">
            Reserve sua Mesa
          </p>
          <h2 className="font-serif text-5xl lg:text-6xl font-bold leading-tight text-foreground mb-6">
            Garanta seu lugar
          </h2>
          <p className="text-lg text-foreground/70">
            Preencha o formulário abaixo e entraremos em contato para confirmar sua reserva.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className={`space-y-6 transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-sans font-semibold text-foreground mb-2 tracking-wide">
                Nome Completo
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-border/50 rounded-lg text-foreground focus:border-primary focus:outline-none transition-colors"
                placeholder="Seu nome"
                required
                data-testid="input-name"
              />
            </div>

            <div>
              <label className="block text-sm font-sans font-semibold text-foreground mb-2 tracking-wide">
                Telefone / WhatsApp
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-border/50 rounded-lg text-foreground focus:border-primary focus:outline-none transition-colors"
                placeholder="(00) 00000-0000"
                required
                data-testid="input-phone"
              />
            </div>

            <div>
              <label className="block text-sm font-sans font-semibold text-foreground mb-2 tracking-wide">
                Data
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-border/50 rounded-lg text-foreground focus:border-primary focus:outline-none transition-colors"
                required
                data-testid="input-date"
              />
            </div>

            <div>
              <label className="block text-sm font-sans font-semibold text-foreground mb-2 tracking-wide">
                Horário
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-border/50 rounded-lg text-foreground focus:border-primary focus:outline-none transition-colors"
                required
                data-testid="input-time"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-sans font-semibold text-foreground mb-2 tracking-wide">
              Número de Pessoas
            </label>
            <select
              value={formData.people}
              onChange={(e) => setFormData({ ...formData, people: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border/50 rounded-lg text-foreground focus:border-primary focus:outline-none transition-colors"
              required
              data-testid="select-people"
            >
              <option value="">Selecione</option>
              <option value="2">2 pessoas</option>
              <option value="3-4">3-4 pessoas</option>
              <option value="5-8">5-8 pessoas</option>
              <option value="9-15">9-15 pessoas</option>
              <option value="16+">Mais de 16 pessoas (grupo)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-sans font-semibold text-foreground mb-2 tracking-wide">
              Mensagem (opcional)
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border/50 rounded-lg text-foreground focus:border-primary focus:outline-none transition-colors resize-none"
              rows={4}
              placeholder="Alguma observação especial? Celebração? Evento de igreja?"
              data-testid="textarea-message"
            />
          </div>

          <button
            type="submit"
            className="w-full px-8 py-4 rounded-full bg-primary text-primary-foreground font-sans font-bold text-sm tracking-wide hover:scale-[1.02] transition-transform duration-300"
            data-testid="submit-reservation"
          >
            Enviar Reserva
          </button>

          <p className="text-center text-sm text-foreground/50">
            Você receberá a confirmação via WhatsApp em até 2 horas
          </p>
        </form>

        {/* Contact info */}
        <div
          className={`mt-16 grid md:grid-cols-3 gap-6 transition-all duration-1000 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center p-6 border border-border/30 rounded-xl">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div className="text-foreground/60 text-sm">Telefone</div>
            <div className="text-foreground font-semibold">(11) 98765-4321</div>
          </div>

          <div className="text-center p-6 border border-border/30 rounded-xl">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="text-foreground/60 text-sm">Endereço</div>
            <div className="text-foreground font-semibold">Av. Principal, 1234 - São Paulo</div>
          </div>

          <div className="text-center p-6 border border-border/30 rounded-xl">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-foreground/60 text-sm">Horário</div>
            <div className="text-foreground font-semibold">Ter-Dom: 18h - 23h</div>
          </div>
        </div>
      </div>
    </section>
  );
}
