'use client';

import Lenis from 'lenis';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion, ScrollTrigger } from '@/lib/gsap';

let instance: Lenis | null = null;

/** The running Lenis instance (null when reduced motion is on or before mount). */
export const getLenis = () => instance;

/**
 * Inertial wheel scrolling for the whole site, driven by GSAP's ticker so
 * every ScrollTrigger reads exactly the same scroll position Lenis renders.
 * Touch devices keep their native scrolling; reduced-motion users get none.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 0.95,
      allowNestedScroll: true,
      anchors: { offset: -96 },
      autoRaf: false,
    });
    instance = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      instance = null;
    };
  }, []);

  // New page: jump to the top without easing through the old page's height.
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!instance || window.location.hash) return;
    instance.scrollTo(0, { immediate: true, force: true });
    const t = window.setTimeout(() => instance?.resize(), 300);
    return () => window.clearTimeout(t);
  }, [pathname]);

  return null;
}
