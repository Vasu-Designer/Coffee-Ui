'use client';

import { useState } from 'react';
import type { ProductDTO } from '@/lib/data';
import { useCart } from '@/components/cart/CartProvider';
import { QuantityStepper } from '@/components/cart/QuantityStepper';
import { Icon } from '@/components/ui/Icon';
import { formatPrice } from '@/lib/format';
import styles from './ProductDetail.module.css';

const GRINDS = ['Whole bean', 'Espresso', 'Filter / pour-over', 'French press', 'South Indian filter'];

export function AddToCart({ product }: { product: ProductDTO }) {
  const { add } = useCart();
  const [variantIdx, setVariantIdx] = useState(0);
  const [grind, setGrind] = useState(product.categorySlug === 'filter-kaapi' ? 'South Indian filter' : 'Whole bean');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const variant = product.variants[variantIdx];
  const isGear = product.kind === 'gear';

  const onAdd = () => {
    add(
      {
        productSlug: product.slug,
        name: product.name,
        subtitle: product.subtitle,
        image: product.images[0] ?? null,
        variantLabel: variant.label,
        grind: isGear ? 'N/A' : grind,
        price: variant.price,
      },
      qty,
    );
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div className={styles.buy}>
      <p className={`${styles.price} tabular`} aria-live="polite">
        {formatPrice(variant.price)}
        {variant.grams && variant.grams >= 250 && (
          <span className="muted"> · {formatPrice(Math.round((variant.price / variant.grams) * 100))} / 100 g</span>
        )}
      </p>

      {product.variants.length > 1 && (
        <fieldset className={styles.option}>
          <legend>{isGear ? 'Option' : 'Bag size'}</legend>
          <div className={styles.swatches}>
            {product.variants.map((v, i) => (
              <label key={v.label} className={styles.swatch} data-checked={i === variantIdx || undefined}>
                <input type="radio" name="variant" value={v.label} checked={i === variantIdx} onChange={() => setVariantIdx(i)} className="sr-only" />
                <span>{v.label}</span>
                <small className="tabular">{formatPrice(v.price)}</small>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {!isGear && (
        <div className={styles.option}>
          <label htmlFor="grind" className={styles.optionLabel}>Grind</label>
          <select id="grind" className="input" value={grind} onChange={(e) => setGrind(e.target.value)}>
            {GRINDS.map((g) => <option key={g}>{g}</option>)}
          </select>
        </div>
      )}

      <div className={styles.addRow}>
        <QuantityStepper value={qty} onChange={setQty} label={product.name} />
        <button type="button" className={`btn ${styles.addBtn}`} onClick={onAdd} data-added={added || undefined}>
          {added ? (
            <>Added to bag <Icon name="check" size={16} /></>
          ) : (
            <>
              Add to bag · <span className="tabular">{formatPrice(variant.price * qty)}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
