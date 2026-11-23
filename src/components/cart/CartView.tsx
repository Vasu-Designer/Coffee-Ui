'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { Icon } from '@/components/ui/Icon';
import { FREE_SHIPPING_THRESHOLD, formatPrice } from '@/lib/format';
import { lineKey, useCart, type CheckoutDetails } from './CartProvider';
import { QuantityStepper } from './QuantityStepper';
import styles from './CartView.module.css';

type Field = keyof CheckoutDetails;
const required: Field[] = ['name', 'email', 'address', 'city', 'postcode'];

function validate(d: CheckoutDetails) {
  const e: Partial<Record<Field, string>> = {};
  required.forEach((k) => {
    if (!String(d[k] ?? '').trim()) e[k] = 'Required';
  });
  if (d.email && !/^\S+@\S+\.\S+$/.test(d.email)) e.email = 'Enter a valid email';
  if (d.postcode && !/^\d{6}$/.test(d.postcode)) e.postcode = '6-digit PIN code';
  if (d.phone && !/^[+\d][\d\s-]{6,16}$/.test(d.phone)) e.phone = 'Enter a valid phone number';
  return e;
}

export function CartView() {
  const { lines, subtotal, shipping, total, ready, setQuantity, checkout } = useCart();
  const [step, setStep] = useState<'bag' | 'details'>('bag');
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<{ number: string; total: number } | null>(null);

  async function onCheckout(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const details = Object.fromEntries(['name', 'email', 'phone', 'address', 'city', 'postcode'].map((k) => [k, String(fd.get(k) ?? '').trim()])) as unknown as CheckoutDetails;
    const v = validate(details);
    setErrors(v);
    if (Object.keys(v).length) return;
    setSubmitting(true);
    setError('');
    try {
      setOrder(await checkout(details));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err instanceof Error && err.message !== 'Failed to fetch' ? err.message : 'We could not place your order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (order) {
    return (
      <div className={styles.done}>
        <span className={styles.doneIcon}><Icon name="check" size={32} /></span>
        <p className="eyebrow eyebrow--plain">Order {order.number}</p>
        <h2 className="h2">Thank you. <em>It’s on the roaster.</em></h2>
        <p className="lede" style={{ marginInline: 'auto' }}>
          Keep your order number handy. Your coffee will be roasted on the next roast day and dispatched within 24 hours.
          Total due on delivery: <strong>{formatPrice(order.total)}</strong>.
        </p>
        <Link href="/shop" className="btn">Keep browsing <span className="btn-arrow"><Icon name="arrow" size={14} /></span></Link>
      </div>
    );
  }

  if (!ready) return <div className={styles.skeleton} aria-busy="true" />;

  if (lines.length === 0) {
    return (
      <div className={styles.done}>
        <p className="h2">Your bag is <em>empty.</em></p>
        <p className="lede" style={{ marginInline: 'auto' }}>Fresh roasts go out Monday, Wednesday and Friday. Pick something and we’ll roast it for you.</p>
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
          <Link href="/shop" className="btn">Shop coffee <span className="btn-arrow"><Icon name="arrow" size={14} /></span></Link>
          <Link href="/collections" className="link-underline">Browse collections</Link>
        </div>
      </div>
    );
  }

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <div className={styles.layout}>
      <div>
        {step === 'bag' ? (
          <ul className={styles.lines} aria-label="Items in your bag">
            {lines.map((l) => (
              <li key={lineKey(l)} className={styles.line}>
                <Link href={`/shop/${l.productSlug}`} className={styles.thumb}>
                  {l.image && <Image src={l.image} alt={l.name} fill sizes="140px" />}
                </Link>
                <div className={styles.lineInfo}>
                  <Link href={`/shop/${l.productSlug}`} className={styles.lineName}>{l.name}</Link>
                  <p className="small muted">{l.subtitle}</p>
                  <p className={styles.lineOpts}>
                    <span>{l.variantLabel}</span>
                    {l.grind !== 'N/A' && <span>{l.grind}</span>}
                  </p>
                </div>
                <div className={styles.lineQty}>
                  <QuantityStepper value={l.quantity} min={0} onChange={(q) => setQuantity(l, q)} size="sm" label={l.name} />
                  <button type="button" className={styles.remove} onClick={() => setQuantity(l, 0)}>Remove</button>
                </div>
                <p className={`${styles.linePrice} tabular`}>
                  {formatPrice(l.price * l.quantity)}
                  {l.quantity > 1 && <small>{formatPrice(l.price)} each</small>}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <form id="checkout" className={styles.checkout} onSubmit={onCheckout} noValidate>
            <h2 className="h3">Delivery <em>details</em></h2>
            <div className={styles.fields}>
              {(
                [
                  ['name', 'Full name', 'name', 'text'],
                  ['email', 'Email', 'email', 'email'],
                  ['phone', 'Phone (optional)', 'tel', 'tel'],
                  ['address', 'Address', 'street-address', 'text'],
                  ['city', 'City', 'address-level2', 'text'],
                  ['postcode', 'PIN code', 'postal-code', 'text'],
                ] as const
              ).map(([name, label, ac, type]) => (
                <div key={name} className="field" data-wide={name === 'address' || undefined}>
                  <label htmlFor={`co-${name}`}>{label}</label>
                  <input
                    id={`co-${name}`}
                    name={name}
                    type={type}
                    autoComplete={ac}
                    inputMode={name === 'postcode' ? 'numeric' : undefined}
                    className="input"
                    aria-invalid={!!errors[name] || undefined}
                    aria-describedby={errors[name] ? `co-${name}-e` : undefined}
                  />
                  {errors[name] && <p id={`co-${name}-e`} className="field-error">{errors[name]}</p>}
                </div>
              ))}
            </div>
            <p className="small muted">Payment is collected on delivery (UPI or card) while we finish integrating online payments.</p>
            {error && <p className="field-error" role="alert">{error}</p>}
            <button type="button" className="link-underline" onClick={() => setStep('bag')} style={{ justifySelf: 'start' }}>
              ← Back to bag
            </button>
          </form>
        )}
      </div>

      <aside className={styles.summary} aria-label="Order summary">
        <h2 className={styles.summaryTitle}>Summary</h2>
        <dl className={styles.totals}>
          <div><dt>Subtotal</dt><dd className="tabular">{formatPrice(subtotal)}</dd></div>
          <div><dt>Shipping</dt><dd className="tabular">{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd></div>
          <div className={styles.grand}><dt>Total</dt><dd className="tabular">{formatPrice(total)}</dd></div>
        </dl>
        {remaining > 0 && <p className={styles.nudge}>Add {formatPrice(remaining)} more for free shipping.</p>}
        {step === 'bag' ? (
          <button type="button" className="btn btn--block" onClick={() => setStep('details')}>
            Continue to checkout
            <span className="btn-arrow"><Icon name="arrow" size={14} /></span>
          </button>
        ) : (
          <button type="submit" form="checkout" className="btn btn--block" disabled={submitting}>
            {submitting ? 'Placing order…' : `Place order · ${formatPrice(total)}`}
          </button>
        )}
        <p className="small muted">Demo store: orders are simulated and your bag is saved on this device.</p>
        <ul className={styles.perks}>
          <li><Icon name="flame" size={16} /> Roasted to order</li>
          <li><Icon name="truck" size={16} /> Dispatched within 24 h</li>
          <li><Icon name="leaf" size={16} /> Plastic-free packaging</li>
        </ul>
      </aside>
    </div>
  );
}
