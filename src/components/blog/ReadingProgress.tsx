'use client';

import { gsap, useGsap } from '@/lib/gsap';

export function ReadingProgress() {
  const ref = useGsap<HTMLDivElement>(({ root }) => {
    gsap.fromTo(
      root,
      { scaleX: 0 },
      { scaleX: 1, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 } },
    );
  });
  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        zIndex: 60,
        background: 'var(--accent)',
        transformOrigin: 'left',
        transform: 'scaleX(0)',
      }}
    />
  );
}
