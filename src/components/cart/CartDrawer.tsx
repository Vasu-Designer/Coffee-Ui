'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { getLenis } from '@/components/motion/SmoothScroll';
import { Icon } from '@/components/ui/Icon';
import { FREE_SHIPPING_THRESHOLD, formatPrice } from '@/lib/format';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { lineKey, useCart } from './CartProvider';
import { QuantityStepper } from './QuantityStepper';
import styles from './CartDrawer.module.css';

export function CartDrawer() {
  const { lines, subtotal, drawerOpen, closeDrawer, setQuantity } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => closeDrawer(), [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!drawerOpen) {
      getLenis()?.start();
      return;
    }
    getLenis()?.stop();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeDrawer();
    window.addEventListener('keydown', onKey);
    panelRef.current?.focus({ preventScroll: true });
    if (!prefersReducedMotion() && panelRef.current) {
      gsap.fromTo(panelRef.current.querySelectorAll('[data-line]'), { opacity: 0, x: 24 }, { opacity: 1, x: 0, stagger: 0.05, duration: 0.6, delay: 0.15 });
    }
    return () => window.removeEventListener('keydown', onKey);
  }, [drawerOpen, closeDrawer]);

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(1, subtotal / FREE_SHIPPING_THRESHOLD);

  return (
    <div className={styles.root} data-open={drawerOpen || undefined} aria-hidden={!drawerOpen}>
      <button type="button" className={styles.scrim} onClick={closeDrawer} aria-label="Close cart" tabIndex={drawerOpen ? 0 : -1} />
      <aside ref={panelRef} className={styles.panel} role="dialog" aria-modal="true" aria-label="Your cart" tabIndex={-1}>
        <header className={styles.head}>
          <h2 className={styles.title}>
            Your bag <span className="muted">({lines.reduce((n, l) => n + l.quantity, 0)})</span>
          </h2>
          <button type="button" className={styles.close} onClick={closeDrawer} aria-label="Close cart" tabIndex={drawerOpen ? 0 : -1}>
            <Icon name="close" />
          </button>
        </header>

        <div className={styles.ship}>
          <p className="small">
            {remaining > 0 ? (
              <>
                You are <strong>{formatPrice(remaining)}</strong> away from free shipping.
              </>
            ) : (
              <>Your order ships free. Roasted &amp; dispatched within 24 hours.</>
            )}
          </p>
          <span className={styles.bar}>
            <span style={{ transform: `scaleX(${progress})` }} />
          </span>
        </div>

        {lines.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>Your bag is empty.</p>
            <p className="muted small">A good place to start: this week’s single-estate roasts.</p>
            <Link href="/shop" className="btn btn--sm" tabIndex={drawerOpen ? 0 : -1}>
              Browse coffee
            </Link>
          </div>
        ) : (
          <ul className={styles.lines} data-lenis-prevent>
            {lines.map((l) => (
              <li key={lineKey(l)} className={styles.line} data-line>
                <Link href={`/shop/${l.productSlug}`} className={styles.thumb} tabIndex={drawerOpen ? 0 : -1}>
                  {l.image && <Image src={l.image} alt="" fill sizes="88px" />}
                </Link>
                <div className={styles.lineBody}>
                  <div className={styles.lineTop}>
                    <Link href={`/shop/${l.productSlug}`} className={styles.lineName} tabIndex={drawerOpen ? 0 : -1}>
                      {l.name}
                    </Link>
                    <span className="tabular">{formatPrice(l.price * l.quantity)}</span>
                  </div>
                  <p className="small muted">
                    {l.variantLabel}
                    {l.grind !== 'N/A' && ` · ${l.grind}`}
                  </p>
                  <div className={styles.lineBottom}>
                    <QuantityStepper value={l.quantity} onChange={(q) => setQuantity(l, q)} min={0} size="sm" label={l.name} />
                    <button type="button" className={styles.remove} onClick={() => setQuantity(l, 0)} tabIndex={drawerOpen ? 0 : -1}>
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {lines.length > 0 && (
          <footer className={styles.foot}>
            <div className={styles.subtotal}>
              <span>Subtotal</span>
              <span className="tabular">{formatPrice(subtotal)}</span>
            </div>
            <p className="small muted">Shipping and taxes calculated at checkout.</p>
            <Link href="/cart" className="btn btn--block" tabIndex={drawerOpen ? 0 : -1}>
              View bag &amp; check out
              <span className="btn-arrow"><Icon name="arrow" size={14} /></span>
            </Link>
          </footer>
        )}
      </aside>
    </div>
  );
}
