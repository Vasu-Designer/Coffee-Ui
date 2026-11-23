'use client';

import Image from 'next/image';
import { img } from '@/data';
import { JourneyAnchor } from '@/components/journey/JourneyAnchor';
import { Icon, type IconName } from '@/components/ui/Icon';
import { gsap, useGsap } from '@/lib/gsap';
import s from './home.module.css';

const pillars: { icon: IconName; title: string; body: string; pos: string }[] = [
  { icon: 'leaf', title: 'Picked ripe, three times over', body: 'Pickers pass every tree up to four times a season so only deep-red cherry reaches the mill.', pos: 'tl' },
  { icon: 'handshake', title: 'Bought direct, paid fairly', body: 'We pay growers on average 2.3× the commodity price, agreed before harvest, never after.', pos: 'tr' },
  { icon: 'flame', title: 'Roasted in six-kilo batches', body: 'Each lot gets its own profile on our Turkish drum roaster, tasted on the cupping table daily.', pos: 'bl' },
  { icon: 'truck', title: 'At your door in two days', body: 'We roast Monday, Wednesday and Friday and ship within 24 hours, roast date stamped by hand.', pos: 'br' },
];

/** Pinned centrepiece: the cup grows into view while the four pillars settle around it. */
export function Ritual() {
  const ref = useGsap<HTMLElement>(({ root, reduced }) => {
    const q = gsap.utils.selector(root);
    if (reduced) return;
    const mm = gsap.matchMedia();

    mm.add('(min-width: 900px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: 'top top', end: '+=140%', scrub: 0.8, pin: true },
      });
      tl.fromTo(q('[data-cup]'), { scale: 0.42, rotate: -24 }, { scale: 1, rotate: 0, ease: 'power2.out', duration: 1 })
        .fromTo(q('[data-ghost]'), { xPercent: 12 }, { xPercent: -12, ease: 'none', duration: 2 }, 0)
        .fromTo(q('[data-steam]'), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6 }, 0.4);
      q('[data-pillar]').forEach((el, i) => {
        const fromX = el.dataset.pos?.includes('l') ? -60 : 60;
        tl.fromTo(el, { opacity: 0, x: fromX }, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, 0.45 + i * 0.22);
      });
    });

    mm.add('(max-width: 899px)', () => {
      gsap.fromTo(q('[data-cup]'), { scale: 0.7, rotate: -18 }, { scale: 1, rotate: 0, ease: 'none', scrollTrigger: { trigger: q('[data-cup]')[0], start: 'top bottom', end: 'center center', scrub: true } });
      q('[data-pillar]').forEach((el) => {
        gsap.fromTo(el, { opacity: 0, y: 30 }, { opacity: 1, y: 0, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
      });
    });
    return () => mm.revert();
  });

  return (
    <section ref={ref} className={s.ritual} aria-labelledby="ritual-title">
      <span className={s.ritualGhost} data-ghost aria-hidden="true">ritual · ritual · ritual</span>
      <div className={`container ${s.ritualInner}`}>
        <header className={s.ritualHead}>
          <p className="eyebrow">Why it tastes different</p>
          <h2 id="ritual-title" className="h2">
            Four promises, <em>one cup</em>
          </h2>
        </header>

        <div className={s.ritualStage}>
          <div className={s.cupWrap}>
            <svg className={s.steam} data-steam viewBox="0 0 120 120" aria-hidden="true">
              <path d="M40 110c-14-22 18-30 4-54s14-30 6-50" />
              <path d="M62 112c-10-20 14-28 2-50s12-28 6-46" />
              <path d="M84 110c-12-22 16-28 4-50s12-30 6-48" />
            </svg>
            <div className={s.cup} data-cup>
              <Image src={img.latteTop} alt="A cappuccino seen from above, latte art on top" fill sizes="(max-width: 900px) 70vw, 34vw" />
            </div>
            <JourneyAnchor id="ritual" rotate={-18} />
          </div>

          {pillars.map((p, i) => (
            <article key={p.title} className={s.pillar} data-pillar data-pos={p.pos}>
              <span className={s.pillarIcon}><Icon name={p.icon} size={22} /></span>
              <span className={s.pillarNum}>0{i + 1}</span>
              <h3 className={s.pillarTitle}>{p.title}</h3>
              <p className={s.pillarBody}>{p.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
