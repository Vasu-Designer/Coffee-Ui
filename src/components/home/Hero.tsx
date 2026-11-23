'use client';

import Link from 'next/link';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { JourneyAnchor } from '@/components/journey/JourneyAnchor';
import { journeyStore, useJourneySlide } from '@/components/journey/journey-store';
import { heroSlides } from '@/components/journey/slides';
import { Edge } from '@/components/ui/Edge';
import { Icon } from '@/components/ui/Icon';
import { gsap, prefersReducedMotion, useGsap } from '@/lib/gsap';
import styles from './Hero.module.css';

const regions = ['Chikmagalur', 'Coorg', 'Araku Valley', 'Nilgiris', 'Shevaroy Hills', 'Malabar Coast', 'Baba Budan Giri'];
const AUTOPLAY_SECONDS = 7;
const n = heroSlides.length;
const STEAM_SRCSET = '/cutouts/steam-sm.webp 200w, /cutouts/steam.webp 360w';

/** Depth beans that drift behind the cup and get knocked about on every slide change. */
const depthBeans = [
  { left: '6%', top: '14%', size: 74, rot: -30, img: 1, blur: 3 },
  { left: '84%', top: '8%', size: 46, rot: 40, img: 2, blur: 1.5 },
  { left: '90%', top: '70%', size: 88, rot: 12, img: 1, blur: 4 },
  { left: '2%', top: '78%', size: 52, rot: -70, img: 2, blur: 2 },
];

export function Hero() {
  const { slide } = useJourneySlide();
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const [hovering, setHovering] = useState(false);
  /** Becomes true once the page has loaded; until then only the first cup is downloaded. */
  const [warm, setWarm] = useState(false);
  useEffect(() => {
    const go = () => setWarm(true);
    if (document.readyState === 'complete') { go(); return; }
    window.addEventListener('load', go, { once: true });
    return () => window.removeEventListener('load', go);
  }, []);
  const progressRef = useRef<gsap.core.Tween | null>(null);
  const busy = useRef(false);
  const touchX = useRef<number | null>(null);

  /* ---------- Intro + ambient motion ---------- */
  const ref = useGsap<HTMLElement>(({ root, reduced }) => {
    const q = gsap.utils.selector(root);
    if (reduced) {
      gsap.set(q('[data-slide-text="0"] .split-word, [data-hero], [data-cup-item="0"]'), { clearProps: 'all', opacity: 1 });
      setPaused(true);
      return;
    }
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.15 });
    tl.to(q('[data-slide-text="0"] .split-word'), { y: 0, duration: 1.4, stagger: 0.07 })
      .fromTo(q('[data-cup-item="0"]'), { opacity: 0, y: 90 }, { opacity: 1, y: 0, duration: 1.6, ease: 'power3.out' }, 0.2)
      .fromTo(q('[data-hero="fade"]'), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.2, stagger: 0.08 }, '<0.35')
      .fromTo(q('[data-slide-text="0"] [data-copy]'), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.2, stagger: 0.08 }, '<0.1')
      .fromTo(q('[data-hero="badge"]'), { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 1.2 }, '<0.2')
      .fromTo(q('[data-depth-bean]'), { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 1.6, stagger: 0.1 }, '<');

    gsap.to(q('[data-hero="badge"] svg'), { rotate: 360, duration: 28, ease: 'none', repeat: -1 });
    q('[data-depth-bean]').forEach((el, i) => {
      gsap.to(el, { y: i % 2 ? 18 : -22, rotation: `+=${i % 2 ? 14 : -18}`, duration: 4 + i, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    });

    // Scroll: copy drifts back, the depth beans separate on parallax.
    const st = { trigger: root, start: 'top top', end: 'bottom top', scrub: true };
    gsap.to(q('[data-hero="copy"]'), { yPercent: 12, opacity: 0.2, ease: 'none', scrollTrigger: st });
    q('[data-depth-wrap]').forEach((el, i) => gsap.to(el, { yPercent: -60 - i * 25, ease: 'none', scrollTrigger: st }));
    gsap.to(q('[data-hero="numeral"]'), { yPercent: 30, ease: 'none', scrollTrigger: st });
  });

  /* ---------- Changing slides ---------- */
  const go = useCallback((to: number, dir: 1 | -1) => {
    const root = ref.current;
    const from = journeyStore.get().slide;
    const next = ((to % n) + n) % n;
    if (!root || next === from || busy.current) return;
    busy.current = true;
    journeyStore.goTo(next, dir);

    const q = gsap.utils.selector(root);
    const outText = q(`[data-slide-text="${from}"]`)[0];
    const inText = q(`[data-slide-text="${next}"]`)[0];
    const done = () => { busy.current = false; };

    if (prefersReducedMotion()) {
      gsap.set(inText.querySelectorAll('.split-word, [data-copy]'), { clearProps: 'all', opacity: 1 });
      gsap.set(q(`[data-cup-item="${from}"]`), { opacity: 0 });
      gsap.set(q(`[data-cup-item="${next}"]`), { opacity: 1 });
      done();
      return;
    }
    const outCup = q(`[data-cup-item="${from}"]`)[0];
    const inCup = q(`[data-cup-item="${next}"]`)[0];

    // Everything leaves by fading, and the new coffee rises in from below:
    // no rotation, no scaling, the photography stays at its natural size.
    const tl = gsap.timeline({ onComplete: done });
    tl.to(outCup, { opacity: 0, y: -24, duration: 0.55, ease: 'power2.in' }, 0)
      .to(outText.querySelectorAll('.split-word'), { opacity: 0, y: -18, duration: 0.45, ease: 'power2.in', stagger: 0.02 }, 0)
      .to(outText.querySelectorAll('[data-copy]'), { opacity: 0, y: -14, duration: 0.4, ease: 'power2.in', stagger: 0.03 }, 0)
      .to(q('[data-hero="numeral"]'), { opacity: 0, y: -20, duration: 0.45, ease: 'power2.in' }, 0)
      .fromTo(inCup, { opacity: 0, y: 90 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }, 0.45)
      .fromTo(inText.querySelectorAll('.split-word'), { opacity: 0, y: 0, yPercent: 100 }, { opacity: 1, yPercent: 0, duration: 1, ease: 'power3.out', stagger: 0.05 }, 0.5)
      .fromTo(inText.querySelectorAll('[data-copy]'), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.07 }, 0.62)
      .fromTo(q('[data-hero="numeral"]'), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' }, 0.55);
    // Depth beans drift a little on each change.
    q('[data-depth-bean]').forEach((el, i) => {
      gsap.to(el, { y: `+=${i % 2 ? 14 : -14}`, rotation: `+=${i % 2 ? 18 : -18}`, duration: 1.4, ease: 'power2.out' });
    });
  }, [ref]);

  const next = useCallback(() => go(journeyStore.get().slide + 1, 1), [go]);
  const prev = useCallback(() => go(journeyStore.get().slide - 1, -1), [go]);

  /* ---------- Autoplay with a visible progress bar ---------- */
  const running = !paused && inView && !hovering;
  useEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion()) return;
    const bar = root.querySelector<HTMLElement>(`[data-bar="${slide}"]`);
    root.querySelectorAll<HTMLElement>('[data-bar]').forEach((b) => gsap.set(b, { scaleX: Number(b.dataset.bar) < slide ? 1 : 0 }));
    if (!bar) return;
    progressRef.current?.kill();
    progressRef.current = gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: AUTOPLAY_SECONDS, ease: 'none', onComplete: next });
    return () => { progressRef.current?.kill(); };
  }, [slide, next, ref]);

  useEffect(() => {
    const t = progressRef.current;
    if (!t) return;
    if (running) t.resume();
    else t.pause();
  }, [running, slide]);

  // Pause when the hero leaves the viewport or the tab is hidden.
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting && e.intersectionRatio > 0.45), { threshold: [0, 0.45, 1] });
    io.observe(root);
    const vis = () => setInView(document.visibilityState === 'visible' && root.getBoundingClientRect().bottom > window.innerHeight * 0.45);
    document.addEventListener('visibilitychange', vis);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', vis);
    };
  }, [ref]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
  };

  const active = heroSlides[slide];

  return (
    <>
      <section
        ref={ref}
        className={`band ${styles.hero}`}
        data-motion-manual
        data-active={active.key}
        aria-roledescription="carousel"
        aria-label="Kaapii coffees"
        onKeyDown={onKey}
        onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          touchX.current = null;
          if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
        }}
      >
        {/* Background moods, cross-faded per coffee */}
        {heroSlides.map((s, i) => (
          <div key={s.key} className={styles.mood} data-mood={s.key} data-on={i === slide || undefined} aria-hidden="true" />
        ))}

        <div className={`container ${styles.grid}`}>
          <div className={styles.copy} data-hero="copy">
            <p className={`eyebrow ${styles.eyebrow}`} data-hero="fade">
              Small-batch roasters · Bengaluru · Est. 2019
            </p>
            <h1 className="sr-only">Kaapii: single-estate Indian coffee. Hot espresso, iced coffee and signature cold brew.</h1>

            <div className={styles.texts}>
              {heroSlides.map((s, i) => (
                <div
                  key={s.key}
                  className={styles.text}
                  data-slide-text={i}
                  data-active={i === slide || undefined}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${n}: ${s.label}`}
                  aria-hidden={i !== slide}
                >
                  <p className={styles.kicker} data-copy>
                    <span className={styles.kickerLabel}>{s.label}</span>
                    <span className={styles.kickerMeta}>{s.kicker}</span>
                  </p>
                  <h2 className={`h1 ${styles.title}`} aria-label={s.title.flat().map((t) => (typeof t === 'string' ? t : t.text)).join(' ')}>
                    {s.title.map((line, li) => (
                      <span className="split-line" aria-hidden="true" key={li}>
                        {line.map((seg, si) => {
                          const text = typeof seg === 'string' ? seg : seg.text;
                          const em = typeof seg !== 'string';
                          return (
                            <Fragment key={si}>
                              {si > 0 ? ' ' : null}
                              {text.split(' ').map((w, wi, arr) => (
                                <Fragment key={wi}>
                                  <span className="split-word">{em ? <em>{w}</em> : w}</span>
                                  {wi < arr.length - 1 ? ' ' : null}
                                </Fragment>
                              ))}
                            </Fragment>
                          );
                        })}
                      </span>
                    ))}
                  </h2>
                  <p className={`lede ${styles.lede}`} data-copy>{s.description}</p>
                  <ul className={styles.meta} data-copy>
                    {s.meta.map((m) => <li key={m}>{m}</li>)}
                  </ul>
                  <div className={styles.ctas} data-copy>
                    <Link href={s.cta.href} className="btn btn--cream" tabIndex={i === slide ? 0 : -1}>
                      {s.cta.label}
                      <span className="btn-arrow"><Icon name="arrow" size={14} /></span>
                    </Link>
                    <Link href={s.secondary.href} className="link-underline" tabIndex={i === slide ? 0 : -1}>{s.secondary.label}</Link>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.controls} data-hero="fade">
              <div className={styles.arrows}>
                <button type="button" className={styles.arrow} onClick={prev} aria-label="Previous coffee">
                  <Icon name="arrow" size={18} style={{ transform: 'scaleX(-1)' }} />
                </button>
                <button type="button" className={styles.arrow} onClick={next} aria-label="Next coffee">
                  <Icon name="arrow" size={18} />
                </button>
              </div>
              <ol className={styles.dots} aria-label="Choose a coffee">
                {heroSlides.map((s, i) => (
                  <li key={s.key}>
                    <button
                      type="button"
                      className={styles.dot}
                      aria-current={i === slide ? 'true' : undefined}
                      aria-label={`0${i + 1} ${s.label}`}
                      onClick={() => go(i, i > slide ? 1 : -1)}
                    >
                      <span className={styles.dotNum}>0{i + 1}</span>
                      <span className={styles.dotLabel}>{s.label}</span>
                      <span className={styles.dotTrack}><span data-bar={i} /></span>
                    </button>
                  </li>
                ))}
              </ol>
              <button
                type="button"
                className={styles.pause}
                onClick={() => setPaused((p) => !p)}
                aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}
                aria-pressed={paused}
              >
                {paused ? (
                  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M7 5v14l12-7z" fill="currentColor" /></svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" /></svg>
                )}
              </button>
            </div>
          </div>

          <div
            className={styles.visual}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            <span className={styles.numeral} data-hero="numeral" aria-hidden="true">0{slide + 1}</span>
            <span className={styles.halo} aria-hidden="true" />
            <span className={styles.plate} aria-hidden="true" />
            <div className={styles.cups}>
              {heroSlides.map((s, i) => (
                <div
                  key={s.key}
                  className={styles.cupItem}
                  data-cup-item={i}
                  data-hot={s.hot || undefined}
                  aria-hidden={i !== slide}
                  style={{ ['--cup-h' as string]: s.cup.fit }}
                >
                  {s.hot && (
                    <span className={styles.steam} aria-hidden="true">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/cutouts/steam.webp" srcSet={STEAM_SRCSET} sizes="min(24vw, 22vh)" alt="" className={styles.steamA} />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/cutouts/steam.webp" srcSet={STEAM_SRCSET} sizes="min(24vw, 22vh)" alt="" className={styles.steamB} />
                    </span>
                  )}
                  {/* The other two cups wait until the page has loaded, so they don't compete with first paint. */}
                  {(i === 0 || warm) && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={s.cup.src}
                      srcSet={`${s.cup.sm.src} ${s.cup.sm.width}w, ${s.cup.src} ${s.cup.width}w`}
                      sizes={s.cup.sizes}
                      alt={s.cup.alt}
                      width={s.cup.width}
                      height={s.cup.height}
                      className={styles.cupImg}
                      fetchPriority={i === 0 ? 'high' : 'low'}
                      decoding="async"
                    />
                  )}
                </div>
              ))}
            </div>
            {/* Where the travelling bean starts its journey down the page. */}
            <JourneyAnchor id="hero" rotate={-24} />
            <div className={styles.badge} data-hero="badge" aria-hidden="true">
              <svg viewBox="0 0 120 120">
                <defs>
                  <path id="badge-circle" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0" />
                </defs>
                <text>
                  <textPath href="#badge-circle" startOffset="0">
                    Roasted Mon · Wed · Fri · Shipped in 24 h ·
                  </textPath>
                </text>
              </svg>
              <span className={styles.badgeCore}>
                <svg viewBox="0 0 40 40" width="26" height="26">
                  <g transform="rotate(-32 20 20.5)">
                    <ellipse cx="20" cy="20.5" rx="7.6" ry="10.8" fill="currentColor" />
                    <path d="M20.4 10.2c-3.6 3.4 3.8 8.6.1 12.2-2.4 2.3-1.6 5.5-.3 8.3" stroke="var(--caramel-500)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  </g>
                </svg>
              </span>
            </div>
            <p className="sr-only" aria-live={running ? 'off' : 'polite'}>{active.cup.alt}</p>
          </div>
        </div>

        {depthBeans.map((b, i) => (
          <span key={i} className={styles.depthWrap} data-depth-wrap style={{ left: b.left, top: b.top }} aria-hidden="true">
            <span data-depth-bean style={{ display: 'block', transform: `rotate(${b.rot}deg)` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/cutouts/bean-${b.img}.webp`}
                srcSet={`/cutouts/bean-${b.img}-sm.webp 150w, /cutouts/bean-${b.img}.webp 220w`}
                sizes={`${Math.round(b.size * 1.4)}px`}
                alt=""
                width={b.size}
                height={b.size}
                loading="lazy"
                style={{ filter: `blur(${b.blur}px) brightness(0.8)` }} />
            </span>
          </span>
        ))}

        <div className={styles.marquee} data-hero="fade" aria-hidden="true">
          <div className="marquee">
            {[0, 1].map((k) => (
              <div className="marquee__track" key={k}>
                {regions.map((r) => (
                  <span key={r} className={styles.region}>
                    {r}
                    <svg viewBox="0 0 10 10" width="10" height="10"><path d="M5 0 6.2 3.8 10 5 6.2 6.2 5 10 3.8 6.2 0 5 3.8 3.8Z" fill="currentColor" /></svg>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
      <Edge position="bottom" />
    </>
  );
}
