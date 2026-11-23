'use client';

import { useLayoutEffect, useRef } from 'react';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { gsap, prefersReducedMotion, ScrollTrigger } from '@/lib/gsap';
import styles from './BeanJourney.module.css';

if (typeof window !== 'undefined') gsap.registerPlugin(MotionPathPlugin);

/** Rendered bean box in px; a seat's size / BASE gives the (constant) scale. */
const BASE = 72;

interface Keyframe {
  id: string;
  s: number; // scroll position (px)
  x: number; // viewport centre x
  y: number; // viewport centre y
  rot: number;
  /** Document y of the seat for glued (non-pinned) stops: y = docY - s. */
  docY?: number;
}

/**
 * Scroll px the bean needs per px of on-screen travel, and the floor/ceiling
 * (as viewport fractions) for any single flight. Keeps flight speed even.
 */
const SCROLL_PER_PX = 1.15;
const MIN_FLIGHT = 0.45;
const MAX_FLIGHT = 1.2;

/**
 * Gives every flight enough scroll distance for its on-screen length by
 * borrowing from the resting holds on either side of it. Without this, two
 * seats that sit close together in the document but far apart on screen
 * (e.g. the Kaapi ritual → the Journal) make the bean dart across.
 */
function balanceFlights(kfs: Keyframe[], vh: number) {
  for (let i = 0; i < kfs.length - 1; i++) {
    const a = kfs[i];
    const b = kfs[i + 1];
    if (a.id === b.id) continue;
    const dist = Math.hypot(b.x - a.x, b.y - a.y);
    const need = clamp(vh * MIN_FLIGHT, vh * MAX_FLIGHT, dist * SCROLL_PER_PX);
    let deficit = need - (b.s - a.s);
    if (deficit <= 0) continue;

    // Room available in the hold before (a's own seat) and after (b's seat).
    const prev = kfs[i - 1];
    const next = kfs[i + 2];
    let roomA = prev && prev.id === a.id ? a.s - prev.s - 1 : 0;
    let roomB = next && next.id === b.id ? next.s - b.s - 1 : 0;
    const half = deficit / 2;
    let takeA = Math.min(roomA, half);
    let takeB = Math.min(roomB, half);
    roomA -= takeA;
    roomB -= takeB;
    deficit -= takeA + takeB;
    // Whatever one side couldn't give, ask the other side for.
    const extraA = Math.min(roomA, deficit);
    takeA += extraA;
    deficit -= extraA;
    takeB += Math.min(roomB, deficit);

    a.s -= takeA;
    b.s += takeB;
    if (a.docY !== undefined) a.y = a.docY - a.s;
    if (b.docY !== undefined) b.y = b.docY - b.s;
  }
}

const clamp = gsap.utils.clamp;

/**
 * Turns every visible [data-journey-anchor] into scroll-positioned keyframes.
 * Around each seat the bean is "glued": for ±hold px of scroll it moves 1:1
 * with its section, so it reads as resting on the page, not floating over it.
 */
function measure(): { kfs: Keyframe[]; scale: number } {
  const vh = window.innerHeight;
  const vw = window.innerWidth;
  const max = ScrollTrigger.maxScroll(window);
  const scrollY = window.scrollY;
  const pins = ScrollTrigger.getAll().filter((t) => Boolean(t.pin));
  /** One rest stop per seat: [arrive, leave] keyframes, kept in document order. */
  const stops: { pinned: boolean; a: Keyframe; b: Keyframe }[] = [];
  let scale = 1;

  document.querySelectorAll<HTMLElement>('[data-journey-anchor]').forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.width < 2) return;
    scale = rect.width / BASE;
    const id = el.dataset.journeyAnchor!;
    const rot = Number(el.dataset.journeyRotate ?? 0);
    const x = clamp(rect.width, vw - rect.width, rect.left + rect.width / 2);
    const pin = pins.find((p) => (p.pin as Element).contains(el));

    if (pin) {
      // Inside a pinned section the seat is frozen in the viewport while pinned.
      const pinEl = pin.pin as HTMLElement;
      const pinRect = pinEl.getBoundingClientRect();
      const spacerTop = pinEl.parentElement!.getBoundingClientRect().top + scrollY;
      const y = spacerTop - pin.start + (rect.top - pinRect.top) + rect.height / 2;
      stops.push({ pinned: true, a: { id, s: pin.start, x, y, rot }, b: { id, s: pin.end, x, y, rot: rot + 6 } });
      return;
    }

    const docY = rect.top + scrollY + rect.height / 2;
    const focus = Number(el.dataset.journeyFocus ?? 0.5);
    const hold = Number(el.dataset.journeyHold ?? 0.2) * vh;
    const seat = clamp(0, max, docY - vh * focus);
    let s0 = clamp(0, max, seat - hold);
    let s1 = clamp(0, max, seat + hold);
    if (id === 'hero') {
      s0 = 0;
      s1 = Math.min(max, hold * 0.6);
    }
    if (id === 'footer') s1 = max;
    stops.push({
      pinned: false,
      a: { id, s: s0, x, y: docY - s0, rot, docY },
      b: { id, s: s1, x, y: docY - s1, rot: id === 'footer' ? rot : rot + 6, docY },
    });
  });

  // Neighbouring seats can sit so close that their rest windows overlap
  // (common on phones). Never interleave them, which would make the bean dart
  // back and forth: split the overlap, and never cut into a pinned section's hold.
  stops.sort((p, q) => p.a.s - q.a.s);
  for (let i = 1; i < stops.length; i++) {
    const prev = stops[i - 1];
    const cur = stops[i];
    if (cur.a.s > prev.b.s) continue;
    if (prev.pinned) {
      cur.a.s = prev.b.s + 1;
    } else if (cur.pinned) {
      prev.b.s = Math.max(prev.a.s, cur.a.s - 1);
    } else {
      const mid = clamp(prev.a.s, cur.b.s, (prev.b.s + cur.a.s) / 2);
      prev.b.s = Math.max(prev.a.s, mid - 1);
      cur.a.s = mid;
    }
    cur.b.s = Math.max(cur.b.s, cur.a.s + 1);
  }
  const kfs = stops.flatMap(({ a, b }) => [a, b]);
  for (let i = 1; i < kfs.length; i++) if (kfs[i].s <= kfs[i - 1].s) kfs[i].s = kfs[i - 1].s + 1;
  for (const k of kfs) if (k.docY !== undefined) k.y = k.docY - k.s;
  if (kfs.length && kfs[0].s > 0) kfs.unshift({ ...kfs[0], s: 0 });
  balanceFlights(kfs, vh);
  return { kfs, scale };
}

/** One real coffee bean that travels from the hero to the footer with the scroll. */
export function BeanJourney() {
  const layerRef = useRef<HTMLDivElement>(null);
  const beanRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const layer = layerRef.current!;
    const bean = beanRef.current!;
    gsap.set(bean, { xPercent: -50, yPercent: -50 });

    // Reduced motion: the bean simply rests at its hero seat and scrolls away with the page.
    if (prefersReducedMotion()) {
      layer.dataset.mode = 'static';
      const place = () => {
        const a = document.querySelector<HTMLElement>('[data-journey-anchor="hero"]');
        if (!a) return;
        const r = a.getBoundingClientRect();
        gsap.set(bean, { x: r.left + r.width / 2, y: r.top + window.scrollY + r.height / 2, scale: r.width / BASE, rotation: -24 });
        gsap.set(layer, { opacity: 1 });
      };
      place();
      window.addEventListener('resize', place);
      return () => window.removeEventListener('resize', place);
    }

    const tl = gsap.timeline({ paused: true });
    // Timeline time is measured in scroll pixels, so progress maps 1:1 to the page
    // and scrolling back up retraces exactly the same path.
    // A soft scrub lets the bean ease after the (already smoothed) scroll rather than snap to it.
    const st = ScrollTrigger.create({ start: 0, end: 'max', scrub: 0.8, animation: tl });

    const build = () => {
      const { kfs, scale } = measure();
      tl.clear();
      if (kfs.length < 2) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const first = kfs[0];
      tl.set(bean, { x: first.x, y: first.y, rotation: first.rot, scale }, 0);

      // `turns` accumulates the full tumbles taken so far, so every segment
      // starts exactly at the angle the previous one ended on.
      let turns = 0;
      let spin = 1;
      for (let i = 0; i < kfs.length - 1; i++) {
        const a = kfs[i];
        const b = kfs[i + 1];
        const dur = Math.max(1, b.s - a.s);
        const from = { x: a.x, y: a.y, rotation: a.rot + turns };
        if (a.id === b.id) {
          tl.fromTo(bean, from, { x: b.x, y: b.y, rotation: b.rot + turns, ease: 'none', duration: dur, immediateRender: false }, a.s);
        } else {
          // A gentle arc that bows toward the nearer edge, with one natural tumble.
          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2;
          const side = mx > vw / 2 ? 1 : -1;
          const ctrl = { x: clamp(40, vw - 40, mx + side * Math.min(vw * 0.1, 140)), y: clamp(40, vh - 40, my - vh * 0.05) };
          tl.fromTo(
            bean,
            from,
            {
              motionPath: { path: [{ x: a.x, y: a.y }, ctrl, { x: b.x, y: b.y }], curviness: 1.2 },
              rotation: b.rot + turns + 360 * spin,
              ease: 'sine.inOut',
              duration: dur,
              immediateRender: false,
            },
            a.s,
          );
          turns += 360 * spin;
          spin = -spin;
        }
      }
      const max = ScrollTrigger.maxScroll(window);
      if (tl.duration() < max) tl.to({}, { duration: max - tl.duration() });
      // Render the current scroll position right away (a paused timeline at 0 wouldn't).
      tl.progress(1, true).progress(st.progress || 0, true);
    };

    build();
    ScrollTrigger.addEventListener('refresh', build);
    const late = window.setTimeout(() => ScrollTrigger.refresh(), 900);
    gsap.fromTo(layer, { opacity: 0 }, { opacity: 1, duration: 1, delay: 0.9 });

    return () => {
      window.clearTimeout(late);
      ScrollTrigger.removeEventListener('refresh', build);
      st.kill();
      tl.kill();
    };
  }, []);

  return (
    <div ref={layerRef} className={styles.layer} aria-hidden="true">
      <div ref={beanRef} className={styles.bean} style={{ width: BASE, height: BASE }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/cutouts/bean-1.webp"
          srcSet="/cutouts/bean-1-sm.webp 150w, /cutouts/bean-1.webp 220w"
          sizes={`${BASE}px`}
          alt=""
          width={BASE}
          height={BASE}
          decoding="async"
        />
      </div>
    </div>
  );
}
