'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Logo } from '@/components/brand/Logo';
import { useCart } from '@/components/cart/CartProvider';
import { getLenis } from '@/components/motion/SmoothScroll';
import { Icon } from '@/components/ui/Icon';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { site } from '@/lib/site';
import { ThemeToggle } from './ThemeToggle';
import styles from './Header.module.css';

/** Routes whose hero sits on an espresso band, so the header starts in cream. */
const DARK_HERO = ['/', '/about'];

export function Header() {
  const pathname = usePathname();
  const { count, openDrawer, ready } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // The header is sticky and always visible; scrolling only switches it to
  // its solid, blurred state.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? 'hidden' : '';
    if (menuOpen) getLenis()?.stop();
    else getLenis()?.start();
    const el = menuRef.current;
    if (!el || !menuOpen || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { clipPath: 'circle(0% at calc(100% - 40px) 38px)' }, { clipPath: 'circle(150% at calc(100% - 40px) 38px)', duration: 0.9, ease: 'expo.inOut' });
      gsap.fromTo('[data-menu-item]', { yPercent: 110 }, { yPercent: 0, stagger: 0.06, duration: 0.9, ease: 'expo.out', delay: 0.35 });
      gsap.fromTo('[data-menu-foot]', { opacity: 0 }, { opacity: 1, duration: 0.6, delay: 0.7 });
    }, el);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      ctx.revert();
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const onDark = menuOpen || (DARK_HERO.includes(pathname) && !scrolled);
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header
        className={styles.header}
        data-scrolled={scrolled || undefined}
        data-on-dark={onDark || undefined}
      >
        <div className={`container ${styles.inner}`}>
          <nav className={styles.nav} aria-label="Primary">
            {[...site.nav, { href: '/faq', label: 'FAQ' }].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={styles.navLink}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Logo className={styles.logo} />

          <div className={styles.actions}>
            <ThemeToggle />
            <button type="button" className={styles.cartBtn} onClick={openDrawer} aria-label={`Open cart, ${count} items`}>
              <Icon name="bag" size={20} />
              <span className={styles.cartCount} data-empty={!ready || count === 0 || undefined} aria-hidden="true">
                {count}
              </span>
            </button>
            <Link href="/shop" className={styles.shopNow}>
              Shop now
              <span className={styles.shopNowArrow} aria-hidden="true"><Icon name="arrow" size={14} /></span>
            </Link>
            <button
              type="button"
              className={styles.menuBtn}
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              <span data-open={menuOpen || undefined} />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div id="mobile-menu" ref={menuRef} className={`band ${styles.menu}`} role="dialog" aria-modal="true" aria-label="Menu">
          <nav className={`container ${styles.menuNav}`} aria-label="Mobile">
            {[{ href: '/', label: 'Home' }, ...site.nav, { href: '/faq', label: 'FAQ' }, { href: '/cart', label: 'Cart' }].map((item, i) => (
              <span className={styles.menuLine} key={item.href}>
                <Link href={item.href} data-menu-item className={styles.menuLink} aria-current={pathname === item.href ? 'page' : undefined}>
                  <small>0{i + 1}</small>
                  {item.label}
                </Link>
              </span>
            ))}
          </nav>
          <div className={`container ${styles.menuFoot}`} data-menu-foot>
            <span>{site.address.street.split(',').slice(-1)[0].trim()}, {site.address.city}</span>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </div>
        </div>
      )}
    </>
  );
}
