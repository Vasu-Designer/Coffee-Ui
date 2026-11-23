'use client';

import Link from 'next/link';
import type { ProductDTO } from '@/lib/data';
import { JourneyAnchor } from '@/components/journey/JourneyAnchor';
import { ProductCard } from '@/components/product/ProductCard';
import { Icon } from '@/components/ui/Icon';
import { gsap, ScrollTrigger, useGsap } from '@/lib/gsap';
import s from './home.module.css';

/**
 * Featured roasts. On desktop the section pins and the rail glides
 * horizontally with scroll; on touch devices it is a native snap-scroller.
 */
export function ProductRail({ products }: { products: ProductDTO[] }) {
  const ref = useGsap<HTMLElement>(({ root, reduced }) => {
    const track = root.querySelector<HTMLElement>('[data-track]');
    if (!track) return;

    gsap.fromTo(root.querySelectorAll('[data-rail-head] > *'), { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.08, scrollTrigger: { trigger: root, start: 'top 80%', once: true } });
    if (reduced) return;

    const mm = gsap.matchMedia();
    mm.add('(min-width: 1081px)', () => {
      const distance = () => Math.max(0, track.scrollWidth - track.clientWidth);
      // Cards tilt very slightly with scroll velocity for a tactile feel.
      const setters = Array.from(track.children).map((c) => gsap.quickTo(c, 'rotate', { duration: 0.6, ease: 'power3' }));
      const settle = () => setters.forEach((set) => set(0));

      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const v = gsap.utils.clamp(-2.5, 2.5, self.getVelocity() / -500);
            setters.forEach((set) => set(v));
          },
        },
      });
      gsap.fromTo(
        track.children,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, stagger: 0.08, duration: 1.1, scrollTrigger: { trigger: root, start: 'top 70%', once: true } },
      );
      ScrollTrigger.addEventListener('scrollEnd', settle);
      return () => ScrollTrigger.removeEventListener('scrollEnd', settle);
    });
    return () => mm.revert();
  });

  return (
    <section ref={ref} className={`band ${s.rail}`} aria-labelledby="rail-title">
      <div className={`container ${s.railHead}`} data-rail-head>
        <p className="eyebrow">This week on the roaster</p>
        <h2 id="rail-title" className="h2">
          Freshly roasted, <em>still warm</em>
        </h2>
        <Link href="/shop" className="btn btn--ghost btn--sm">
          View all coffee
          <span className="btn-arrow"><Icon name="arrow" size={14} /></span>
        </Link>
        <JourneyAnchor id="rail" rotate={8} />
      </div>
      <div className={s.railViewport}>
        <ul className={s.railTrack} data-track>
          {products.map((p, i) => (
            <li key={p.slug} className={s.railItem}>
              <ProductCard product={p} index={i} sizes="(max-width: 640px) 78vw, 380px" />
            </li>
          ))}
          <li className={`${s.railItem} ${s.railEnd}`}>
            <Link href="/shop" className={s.railEndLink}>
              <span className="h3">
                See the
                <br />
                <em>whole menu</em>
              </span>
              <span className={s.railEndIcon}><Icon name="arrowUpRight" size={26} /></span>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
