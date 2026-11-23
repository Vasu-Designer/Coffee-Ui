'use client';

import Image from 'next/image';
import { Fragment } from 'react';
import { img } from '@/data';
import { JourneyAnchor } from '@/components/journey/JourneyAnchor';
import { gsap, useGsap } from '@/lib/gsap';
import s from './home.module.css';

type Token = string | { pill: string; alt: string };

const copy: Token[] = [
  'We think a cup of coffee should taste of',
  { pill: img.estate, alt: 'A planter’s bungalow on a Coorg estate' },
  'the hillside it grew on. So we buy from six estates we know by name, roast in',
  { pill: img.roaster, alt: 'Beans cooling in the roaster tray' },
  'six-kilo batches, and send every bag out',
  { pill: img.pourTumbler, alt: 'Filter coffee poured into a tumbler' },
  'within a day of the roast.',
];

/** Editorial statement whose words “brew” from faint to full as you scroll. */
export function Manifesto() {
  const ref = useGsap<HTMLElement>(({ root, reduced }) => {
    const words = root.querySelectorAll('[data-w]');
    const pills = root.querySelectorAll('[data-pill]');
    if (reduced) return;
    gsap.fromTo(
      words,
      // Faint words still need ≥3:1 contrast (large text) in both themes.
      { opacity: 0.5 },
      {
        opacity: 1,
        stagger: 0.05,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top 75%', end: 'bottom 55%', scrub: 0.6 },
      },
    );
    pills.forEach((p) => {
      gsap.fromTo(
        p,
        { width: 0, opacity: 0 },
        {
          width: 'var(--pill-w)',
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: { trigger: p, start: 'top 82%', end: 'top 55%', scrub: 0.6 },
        },
      );
    });
  });

  return (
    <section ref={ref} className={`section ${s.manifesto}`} aria-label="Our philosophy">
      <div className="container">
        <p className="eyebrow eyebrow--plain center" style={{ display: 'flex', justifyContent: 'center' }}>
          — The Kaapii way —
        </p>
        <p className={s.manifestoText}>
          {copy.map((t, i) =>
            typeof t === 'string' ? (
              <Fragment key={i}>
                {t.split(' ').map((w, j) => (
                  <Fragment key={j}>
                    <span data-w>{w}</span>{' '}
                  </Fragment>
                ))}
              </Fragment>
            ) : (
              <Fragment key={i}>
                <span className={s.pill} data-pill>
                  <Image src={t.pill} alt={t.alt} fill sizes="200px" />
                </span>{' '}
              </Fragment>
            ),
          )}
        </p>
        <p className={s.signature}>
          <span>— Meera &amp; Kabir, founders</span>
        </p>
      </div>
      <JourneyAnchor id="manifesto" rotate={-8} focus={0.62} />
    </section>
  );
}
