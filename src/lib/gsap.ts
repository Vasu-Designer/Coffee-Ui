'use client';

import { useEffect, useLayoutEffect, useRef, type DependencyList, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'power3.out', duration: 1 });
}

export { gsap, ScrollTrigger };

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Scoped GSAP effect. Everything created inside `setup` is reverted on unmount
 * or when deps change, so route transitions never leak ScrollTriggers.
 */
export function useGsap<T extends HTMLElement>(
  setup: (ctx: { root: T; reduced: boolean }) => void | (() => void),
  deps: DependencyList = [],
): RefObject<T | null> {
  const ref = useRef<T>(null);
  useIsoLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    let cleanup: void | (() => void);
    const ctx = gsap.context(() => {
      cleanup = setup({ root, reduced: prefersReducedMotion() });
    }, root);
    return () => {
      if (typeof cleanup === 'function') cleanup();
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}
