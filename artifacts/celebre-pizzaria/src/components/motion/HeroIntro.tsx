import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef, type PropsWithChildren } from 'react';
import { useReducedMotion } from 'framer-motion';

export function HeroIntro({ children }: PropsWithChildren) {
  const container = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      gsap.fromTo(
        '[data-hero-animate]',
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.08,
          ease: 'power3.out',
          clearProps: 'transform,opacity,visibility',
        },
      );
    },
    { scope: container, dependencies: [prefersReducedMotion] },
  );

  return (
    <div ref={container}>
      {children}
    </div>
  );
}
