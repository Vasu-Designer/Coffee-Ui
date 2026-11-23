'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { gsap, prefersReducedMotion, ScrollTrigger } from '@/lib/gsap';

/**
 * Declarative scroll motion for the whole site. Server components opt in with
 * data attributes, so pages stay server-rendered and the JS stays tiny:
 *
 *   data-reveal            fade + rise on enter (data-delay="0.1")
 *   data-reveal="clip"     image wipes up from the bottom
 *   data-stagger           children reveal one after another
 *   data-split             <SplitWords> headline rises word by word
 *   data-parallax="0.12"   element drifts at a fraction of scroll speed
 *   data-scale             image settles from 1.18 → 1 as it crosses the viewport
 *
 * Elements are bound once (marked with data-motion-bound). A MutationObserver
 * picks up content that streams in after navigation, so nothing stays hidden.
 */
const SELECTOR = '[data-reveal], [data-stagger], [data-split], [data-parallax], [data-scale]';

function bind(el: HTMLElement) {
  if (el.dataset.motionBound) return;
  el.dataset.motionBound = '1';
  if (el.closest('[data-motion-manual]')) return;

  const delay = Number(el.dataset.delay ?? 0);
  const start = el.dataset.start ?? 'top 88%';

  if (el.hasAttribute('data-reveal')) {
    if (el.dataset.reveal === 'clip') {
      gsap.fromTo(
        el,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.out', delay, scrollTrigger: { trigger: el, start, once: true } },
      );
      const inner = el.querySelector('img');
      if (inner && !inner.hasAttribute('data-parallax')) {
        gsap.fromTo(inner, { scale: 1.25 }, { scale: 1, duration: 1.8, ease: 'expo.out', delay, scrollTrigger: { trigger: el, start, once: true } });
      }
    } else {
      gsap.fromTo(el, { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 1.1, delay, scrollTrigger: { trigger: el, start, once: true } });
    }
  }

  if (el.hasAttribute('data-stagger')) {
    gsap.fromTo(
      el.children,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.09, scrollTrigger: { trigger: el, start: 'top 85%', once: true } },
    );
  }

  if (el.hasAttribute('data-split')) {
    gsap.to(el.querySelectorAll('.split-word'), {
      y: 0,
      duration: 1.2,
      ease: 'expo.out',
      stagger: 0.045,
      delay,
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  }

  if (el.hasAttribute('data-parallax')) {
    const speed = Number(el.dataset.parallax || 0.12);
    gsap.fromTo(
      el,
      { yPercent: -speed * 50 },
      {
        yPercent: speed * 50,
        ease: 'none',
        scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  }

  if (el.hasAttribute('data-scale')) {
    const target = el.querySelector('img') ?? el;
    gsap.fromTo(target, { scale: 1.18 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
  }
}

export function MotionRoot() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.body;

    if (prefersReducedMotion()) {
      gsap.set(root.querySelectorAll('[data-reveal], [data-split] .split-word, [data-stagger] > *'), { clearProps: 'all', opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {});
    let queued = false;
    const scan = () => {
      queued = false;
      const fresh = Array.from(root.querySelectorAll<HTMLElement>(SELECTOR)).filter((el) => !el.dataset.motionBound);
      if (!fresh.length) return;
      ctx.add(() => fresh.forEach(bind));
      ScrollTrigger.refresh();
    };
    const queue = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(scan);
    };

    // Elements from a previous page are gone; anything still in the DOM keeps its binding.
    scan();
    const observer = new MutationObserver(queue);
    observer.observe(root, { childList: true, subtree: true });

    const refresh = () => ScrollTrigger.refresh();
    const t = window.setTimeout(refresh, 700);
    window.addEventListener('load', refresh, { once: true });
    document.fonts?.ready.then(refresh).catch(() => {});

    return () => {
      observer.disconnect();
      window.clearTimeout(t);
      window.removeEventListener('load', refresh);
      ctx.revert();
      root.querySelectorAll<HTMLElement>('[data-motion-bound]').forEach((el) => delete el.dataset.motionBound);
    };
  }, [pathname]);

  return null;
}
